using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;

/// <summary>
/// Summary description for BallersDraftObj
/// </summary>
public class BallersDraftObj
{
    private static DraftSettings m_oSettings = new DraftSettings();
    public static DraftSettings Settings { get { return m_oSettings; } }

    private BallersDraftDBDataContext db = new BallersDraftDBDataContext();

    private object _DraftLock = new object();
    private object _ChatLock = new object();
    private object _UsageLock = new object();

    public BallersDraftObj()
    {
        // Make sure the Current Draft starts with a 'Keep' or 'Empty' in every slot
        lock (_DraftLock)
        {
            int intKeep = (int)DraftMoveType.Keep;
            int intEmpty = (int)DraftMoveType.Empty;
            Dictionary<QuickPick, int> overrides = GetDraftOverrides();
            var query = from t in db.DraftMoves
                        where t.SeasonID == Settings.DraftSeasonID && (t.MoveType == intKeep || t.MoveType == intEmpty)
                        select new DraftMoveObj(t);

            if (query.Count() < (Settings.RoundsPerDraft * Settings.TeamsPerDraft))
            {
                int intMoveType = (int)DraftMoveType.Empty;
                DateTime runTime = DateTime.Now;
                Dictionary<int, int> draftOrder = GetDraftOrder();
                Dictionary<QuickPick, DraftMoveObj> existing = new Dictionary<QuickPick, DraftMoveObj>();
                foreach (DraftMoveObj nextMove in query)
                {
                    existing[nextMove.Index] = nextMove;
                }
                // for (int round = 1; round <= Settings.RoundsPerDraft; round++)
                for (QuickPick index = new QuickPick() { Round = 1, Pick = 1 }; index.Round <= Settings.RoundsPerDraft; index.Round++)
                {
                    for (index.Pick = 1; index.Pick <= Settings.TeamsPerDraft; index.Pick++)
                    {
                        if (!existing.ContainsKey(index))
                            db.DraftMoves.InsertOnSubmit(new DraftMove()
                            {
                                Round = index.Round,
                                Pick = index.Pick,
                                MoveType = intMoveType,
                                PlayerID = null,
                                SeasonID = Settings.DraftSeasonID,
                                Time = runTime,
                                UserID = overrides.ContainsKey(index) ? overrides[index] : draftOrder[index.Pick]
                            });
                    }
                }
                db.SubmitChanges();
            }
        }
    }

    /// <summary>
    /// NOTE: You MUST Lock before calling this function if you are going to use the data to write
    /// </summary>
    /// <returns></returns>
    private Dictionary<int, int> GetDraftOrder()
    {
        Dictionary<int, int> draftOrder = new Dictionary<int, int>();

        var query = from t in db.DraftOrders
                    where t.SeasonID == Settings.DraftSeasonID
                    select t;

        foreach (DraftOrder currUser in query)
            draftOrder[currUser.Order] = currUser.UserID;

        return draftOrder;
    }

    /// <summary>
    /// NOTE: You MUST Lock before calling this function if you are going to use the data to write
    /// </summary>
    /// <returns></returns>
    private Dictionary<QuickPick, int> GetDraftOverrides()
    {
        Dictionary<QuickPick, int> toRet = new Dictionary<QuickPick, int>();
        var allOverrides = from t in db.DraftOverrides
                           select t;
        foreach (DraftOverride next in allOverrides)
            toRet[new QuickPick() { Round = next.Round, Pick = next.Pick }] = next.UserID;
        return toRet;
    }

    /// <summary>
    /// NOTE: You MUST Lock before calling this function if you are going to use the data to write
    /// </summary>
    /// <returns></returns>    
    private Dictionary<QuickPick, DraftMoveObj> GetDraftStatus()
    {
        Dictionary<QuickPick, DraftMoveObj> data = new Dictionary<QuickPick, DraftMoveObj>();
        Dictionary<QuickPick, int> overrides = GetDraftOverrides();

        // Retrieve all moves from the DB
        var allMoves = from t in db.DraftMoves
                       where t.SeasonID == Settings.DraftSeasonID
                       select new DraftMoveObj(t);

        // Loop through all moves and overwrite the empty values with actual ones
        foreach (DraftMoveObj move in allMoves)
        {
            QuickPick index = new QuickPick() { Round = move.Round, Pick = move.Pick };
            // Check for an override and update the UserID
            if (overrides.ContainsKey(index))
                move.UserID = overrides[index];
            // If no data exists, add it
            if (!data.ContainsKey(index))
                data[index] = move;
            // Only overwrite if the Pick is Open (Empty or OnClock)
            // Empty means there is no data, and OnClock is only valid until a Pick happens
            else if (!data[index].IsPicked && (move.IsPicked || data[index].Type == DraftMoveType.Empty))
                data[index] = move;
        }

        return data;
    }

    /// <summary>
    /// NOTE: You MUST Lock before calling this function if you are going to use the date to write
    /// </summary>
    /// <returns></returns>
    private DraftMoveObj FindNextEmptySlot()
    {
        DraftMoveObj toRet = null;
        Dictionary<QuickPick, DraftMoveObj> draft = GetDraftStatus();
        for (QuickPick index = new QuickPick() { Round = 1, Pick = 1 }; index.Round <= Settings.RoundsPerDraft && toRet == null; index.Round++)
        {
            for (index.Pick = 1; index.Pick <= Settings.TeamsPerDraft; index.Pick++)
            {
                if (draft[index].IsEmpty)
                {
                    toRet = draft[index];
                    break;
                }
            }
        }
        return toRet;
    }

    public List<PlayerObj> QueryPlayers()
    {
        List<PlayerObj> allPlayers = new List<PlayerObj>();

        var query = from t in db.Players
                    select t;

        foreach (Player p in query)
            allPlayers.Add(new PlayerObj()
            {
                PlayerID = p.PlayerID,
                FirstName = p.FirstName,
                LastName = p.LastName,
                Suffix = p.Suffix,
                Identity = p.Identifier,
                Team = p.Team,
                Position = p.Position
            });

        return allPlayers;
    }

    public DraftUser GetUser(String username, String password)
    {
        DraftUser toRet = null;

        var query = from t in db.Usernames
                    where t.Username1 == username &&
                    t.User.Password == password
                    select t;

        if (query.Count() > 0)
        {
            Username currUsername = query.First();

            var orderQuery = from t in db.DraftOrders
                             where t.SeasonID == Settings.DraftSeasonID &&
                             t.UserID == currUsername.UserID
                             select t;

            int order = -1;
            if (orderQuery.Count() > 0)
            {
                order = orderQuery.First().Order;
            }

            toRet = new DraftUser(query.First(), order);
        }

        return toRet;
    }

    public List<UserObj> QueryUsers()
    {
        List<UserObj> allUsers = new List<UserObj>();

        var query = from t in db.DraftOrders
                    where t.SeasonID == Settings.DraftSeasonID
                    select t;

        foreach (DraftOrder nextOrder in query)
        {
            allUsers.Add(new UserObj(nextOrder.User, nextOrder.Order));
        }

        return allUsers;
    }

    private List<DraftMoveObj> FindOnTheClock()
    {
        List<DraftMoveObj> onclock = new List<DraftMoveObj>();
        Dictionary<QuickPick, DraftMoveObj> Picked = new Dictionary<QuickPick, DraftMoveObj>();
        List<DraftMove> toPause = new List<DraftMove>();
        bool updateStatusTime = false;
        DraftMoveObj addedOnClock = null;

        // This entire operation MUST be atomic, so a Lock is required
        lock (_DraftLock)
        {
            int intClock = (int)DraftMoveType.OnClock;
            var allOnClock = from t in db.DraftMoves
                             where t.MoveType == intClock && t.SeasonID == Settings.DraftSeasonID
                             select t;

            int intPick = (int)DraftMoveType.Pick;
            var allPicked = from t in db.DraftMoves
                            where t.MoveType == intPick && t.SeasonID == Settings.DraftSeasonID
                            select t;

            var allCurrStatus = from t in db.DraftStatus
                            where t.ID == 1
                            select t;
            DraftStatus oStatus = allCurrStatus.First();
            DraftStatusType currStatus = Converter.ToDraftStatusType(oStatus.Status);
            bool isPaused = (currStatus == DraftStatusType.Paused);

            var allNextStatus = from t in db.DraftStatus
                                where t.ID == 2
                                select t;
            DraftActionType nextStatus = Converter.ToDraftActionType(allNextStatus.First().Status);

            foreach (DraftMove mPicked in allPicked)
            {
                Picked[new QuickPick() { Round = mPicked.Round, Pick = mPicked.Pick }] = new DraftMoveObj(mPicked);
            }

            DateTime nextTime = DateTime.Now;
            foreach (DraftMove mOnClock in allOnClock)
            {
                QuickPick index = new QuickPick() { Round = mOnClock.Round, Pick = mOnClock.Pick };
                if (!Picked.ContainsKey(index))
                {
                    if (isPaused)
                    {
                        toPause.Add(mOnClock);
                    }
                    else
                    {
                        onclock.Add(new DraftMoveObj(mOnClock));
                        onclock.Sort(new DraftMoveObjComparer());
                    }
                }
            }

            // Update Paused Time
            if (isPaused)
                updateStatusTime = true;

            // Determine if a new OnClock Move is needed
            bool addOnClock = (onclock.Count == 0 && toPause.Count == 0);

            // We attempt to minimize the time delay by waiting to calculate the current time
            // as far as possible. So if we don't need to calculate how much time is left
            // on the last OnClock Move, we'll wait longer. Otherwise, we have to re-use this one
            // to keep everything synchronized
            DateTime? currentTime = null;
            if (!addOnClock && !isPaused)
            {
                currentTime = DateTime.Now;
                TimeSpan? timeLeft = null;
                if (onclock.Count > 0)
                {
                    DraftMoveObj lastOnClock = onclock[onclock.Count - 1];
                    timeLeft = TimeSpan.FromSeconds(Settings.SecondsPerPick) - (currentTime.Value - lastOnClock.Time);
                }
                else
                {
                    DraftMove lastOnClock = toPause[toPause.Count - 1];
                    timeLeft = TimeSpan.FromSeconds(Settings.SecondsPerPick) - (currentTime.Value - lastOnClock.Time);
                }
                // Check if the last OnClock Move is over the time limit
                if (timeLeft < TimeSpan.FromTicks(0))
                    addOnClock = true;
            }

            if (addOnClock && !isPaused)
            {
                // Find the next empty slot
                DraftMoveObj nextEmpty = FindNextEmptySlot();
                // If no Empty Slots, the Draft is over, so make sure it gets paused
                if (nextEmpty == null)
                {
                    nextStatus = DraftActionType.Pause;
                }
                else
                {
                    if (!currentTime.HasValue)
                        currentTime = DateTime.Now;
                    DraftMove newOnClock = new DraftMove()
                    {
                        SeasonID = nextEmpty.SeasonID,
                        Round = nextEmpty.Round,
                        Pick = nextEmpty.Pick,
                        PlayerID = null,
                        MoveType = (int)DraftMoveType.OnClock,
                        UserID = nextEmpty.UserID,
                        Time = currentTime.Value
                    };
                    db.DraftMoves.InsertOnSubmit(newOnClock);
                    addedOnClock = new DraftMoveObj(newOnClock);
                }
            }

            // If the draft is paused, we need to update all the onClock Moves
            if (toPause.Count > 0)
            {
                if (!currentTime.HasValue)
                    currentTime = DateTime.Now;
                foreach (DraftMove nextMove in toPause)
                {
                    TimeSpan origGap = oStatus.Time - nextMove.Time;
                    nextMove.Time = currentTime.Value - origGap;
                    onclock.Add(new DraftMoveObj(nextMove));
                }
                onclock.Sort(new DraftMoveObjComparer());
            }

            // If we added a new OnClock Move, make sure it is at the end of the onclock list
            if (addedOnClock != null)
            {
                onclock.Add(addedOnClock);
                onclock.Sort(new DraftMoveObjComparer());
            }

            // If the Draft is Puased or Stopped, or needs to change actions, update it
            int iCurr = (int)currStatus;
            int iNext = (int)nextStatus;
            if (updateStatusTime || iCurr != iNext)
            {
                if (!currentTime.HasValue)
                    currentTime = DateTime.Now;
                oStatus.Time = currentTime.Value;
                oStatus.Status = iNext;
            }

            // Commit all changes to the DB
            db.SubmitChanges();
        }

        return onclock;
    }

    public PickResult SubmitPick(int userID, int playerID)
    {
        PickResult result = PickResult.Success;

        var allPlayers = from t in db.Players
                         where t.PlayerID == playerID
                         select t;

        if (allPlayers.Count() == 0)
            result = PickResult.InvalidPlayer;
        else
        {
            lock (_DraftLock)
            {
                allPlayers = from t in db.Players
                             where t.PlayerID == playerID
                             select t;
                if (allPlayers.Count() == 0)
                    result = PickResult.InvalidPlayer;
                else
                {
                    List<DraftMoveObj> onClock = FindOnTheClock();
                    DraftMoveObj match = null;
                    foreach (DraftMoveObj allowed in onClock)
                    {
                        if (allowed.UserID == userID)
                        {
                            match = allowed;
                            break;
                        }
                    }
                    if (match == null)
                        result = PickResult.NotTurn;
                    else
                    {
                        var intPicked = (int)DraftMoveType.Pick;
                        var intKept = (int)DraftMoveType.Keep;
                        var pickedPlayer = from p in db.DraftMoves
                                           where p.SeasonID == Settings.DraftSeasonID &&
                                           (p.MoveType == intPicked || p.MoveType == intKept) &&
                                           p.PlayerID.HasValue &&
                                           p.PlayerID == playerID
                                           select p;
                        if (pickedPlayer.Count() > 0)
                            result = PickResult.AlreadyPicked;
                        else
                        {
                            DraftMove move = new DraftMove()
                            {
                                Pick = match.Pick,
                                Round = match.Round,
                                SeasonID = Settings.DraftSeasonID,
                                PlayerID = playerID,
                                Time = DateTime.Now,
                                MoveType = (int)DraftMoveType.Pick,
                                UserID = userID
                            };
                            db.DraftMoves.InsertOnSubmit(move);
                            db.SubmitChanges();
                        }
                    }
                }
            }
        }
        return result;
    }

    public int FindUser(String username)
    {
        int toRet = 0;

        var names = from n in db.Usernames
                    where String.Compare(username, n.Username1, true) == 0
                    select n;

        if (names.Count() == 1)
            toRet = names.First().UserID;

        return toRet;
    }

    public List<ChatObj> GetChatData()
    {
        List<ChatObj> data = new List<ChatObj>();
        lock (_ChatLock)
        {
            var query = from c in db.ChatRooms
                        orderby c.Date descending
                        select c;

            foreach (ChatRoom next in query)
            {
                if (next.Date > Settings.ChatFilter)
                {
                    data.Add(new ChatObj(next));
                    if (data.Count >= Settings.ChatRoomCache)
                        break;
                }
            }
            data.Reverse();
        }
        return data;
    }

    public void SubmitChat(ChatObj toSubmit)
    {
        lock (_ChatLock)
        {
            var query = from u in db.Users
                        where u.UserID == toSubmit.UserID
                        select u;
            if (query.Count() == 1)
            {
                ChatRoom newChat = new ChatRoom()
                {
                    Date = toSubmit.Date,
                    Text = toSubmit.Text,
                    UserID = toSubmit.UserID
                };
                db.ChatRooms.InsertOnSubmit(newChat);
                db.SubmitChanges();
            }
        }
    }

    public Dictionary<QuickPick, DraftMoveObj> QueryDraftData(out List<DraftMoveObj> onTheClock)
    {
        Dictionary<QuickPick, DraftMoveObj> toRet = new Dictionary<QuickPick, DraftMoveObj>();

        onTheClock = FindOnTheClock();
        lock (_DraftLock)
        {
            toRet = GetDraftStatus();
        }
        return toRet;
    }

    public void LogUsage(String username, String ipAddress, UserActionType actionType)
    {
        int userID = FindUser(username);
        String trueIP = String.Empty;
        if (!String.IsNullOrEmpty(ipAddress))
        {
            string[] parts = ipAddress.Split(',');
            trueIP = parts[parts.Length - 1];
        }
        lock (_UsageLock)
        {
            db.UsageLogs.InsertOnSubmit(new UsageLog()
            {
                UserID = userID,
                Action = (int)actionType,
                IP = trueIP,
                Date = DateTime.Now
            });
            db.SubmitChanges();
        }
    }

    public List<int> GetActiveUsers()
    {
        List<int> toRet = new List<int>();
        DateTime activeTime = DateTime.Now.Subtract(TimeSpan.FromSeconds(Settings.ActiveUserSeconds));
        lock (_UsageLock)
        {
            var query = from t in db.UsageLogs
                        where t.Date >= activeTime
                        select t;

            foreach (UsageLog nextLog in query)
            {
                if (!toRet.Contains(nextLog.UserID))
                    toRet.Add(nextLog.UserID);
            }
        }
        return toRet;
    }
}

public enum DraftMoveType { Empty = 0, Keep = 1, OnClock = 2, Pick = 3, Invalid = 4 }
public enum DraftStatusType { Invalid = 0, Running = 1, Paused = 2 }
public enum DraftActionType { Invalid = 0, Run = 1, Pause = 2 }
public enum PickResult { Success = 0, NotTurn = 1, InvalidPlayer = 2, AlreadyPicked = 3 }
public enum UserActionType { Unknown = 0, DraftQuery = 1, ChatQuery = 2, PickSucces = 3, PickFailed = 4, ChatSubmit = 5 }

public class QuickPick : IComparable<QuickPick>
{
    public int Round { get; set; }
    public int Pick { get; set; }

    public QuickPick()
    {
        Round = 1;
        Pick = 1;
    }

    public int CompareTo(QuickPick other)
    {
        int result = Round < other.Round ? -1 : (Round > other.Round ? 1 : 0);
        if (result == 0)
            result = Pick < other.Pick ? -1 : (Pick > other.Pick ? 1 : 0);
        return result;
    }

    public override bool Equals(object obj)
    {
        if (!(obj is QuickPick))
            return false;
        return (this.CompareTo((QuickPick)obj) == 0);
    }

    public override int GetHashCode()
    {
        return ToString().GetHashCode();
    }

    public override string ToString()
    {
        return String.Format("{0}.{1}", Round.ToString(), Pick.ToString());
    }
}

public class DraftMoveObjComparer : IComparer<DraftMoveObj>
{
    public int Compare(DraftMoveObj one, DraftMoveObj two)
    {
        if (one.Round < two.Round)
            return -1;
        else if (one.Round > two.Round)
            return 1;
        else if (one.Pick < two.Pick)
            return -1;
        else if (one.Pick > two.Pick)
            return 1;
        else if (one.Time < two.Time)
            return -1;
        else if (one.Time > two.Time)
            return 1;
        else
            return 0;
    }
}

public class DraftMoveObj
{
    public int SeasonID { get; set; }
    public DateTime Time { get; set; }
    public int Round { get; set; }
    public int Pick { get; set; }
    public int UserID { get; set; }
    public int? PlayerID { get; set; }
    public DraftMoveType Type { get; set; }
    public int TypeInt
    {
        get { return (int)Type; }
        set
        {
            DraftMoveType valType = Converter.ToDraftMoveType(value);
            if (valType != DraftMoveType.Invalid)
                Type = valType;
        }
    }
    public bool IsNotPicked { get { return (Type == DraftMoveType.Empty || Type == DraftMoveType.OnClock); } }
    public bool IsPicked { get { return (Type == DraftMoveType.Keep || Type == DraftMoveType.Pick); } }
    public bool IsEmpty { get { return Type == DraftMoveType.Empty; } }
    public QuickPick Index { get { return new QuickPick() { Round = Round, Pick = Pick }; } }

    public DraftMoveObj()
    {
        SeasonID = 0;
        Time = new DateTime(0);
        Round = 0;
        Pick = 0;
        UserID = 0;
        PlayerID = null;
        Type = DraftMoveType.Invalid;
    }

    public DraftMoveObj(DraftMove toCopy)
    {
        SeasonID = toCopy.SeasonID;
        Time = toCopy.Time;
        Round = toCopy.Round;
        Pick = toCopy.Pick;
        UserID = toCopy.UserID;
        PlayerID = toCopy.PlayerID;
        TypeInt = toCopy.MoveType;
    }
}

public class ChatObj
{
    public DateTime Date { get; set; }
    public int UserID { get; set; }
    public String Username { get { return _Username; } }
    private String _Username;
    public String Text
    {
        get
        {
            return _Text;
        }
        set
        {
            _Text = HttpUtility.HtmlEncode(value);
        }
    }
    private String _Text;

    public ChatObj()
    {
        _Text = null;
        _Username = String.Empty;
        Date = DateTime.Now;
        UserID = 0;
    }

    public ChatObj(String text) : this()
    {
        _Text = text;
    }

    public ChatObj(ChatRoom line) : this(line.Text)
    {
        Date = line.Date;
        UserID = line.UserID;
        if (line.User.Usernames.Count > 0)
            _Username = line.User.Usernames[0].Username1;
    }
}

public class PlayerObj
{
    public int PlayerID { get; set; }
    public String FirstName { get; set; }
    public String LastName { get; set; }
    public String Suffix { get; set; }
    public String Identity { get; set; }
    public String Team { get; set; }
    public String Position { get; set; }

    public String Name
    {
        get
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("{0} {1}", FirstName, LastName);
            if (!String.IsNullOrEmpty(Suffix))
                sb.AppendFormat(" ({0})", Suffix);
            if (!String.IsNullOrEmpty(Identity))
                sb.AppendFormat(" [{0}]", Identity);
            return sb.ToString();
        }
    }

    public String TeamInfo
    {
        get
        {
            return String.Format("{0} ({1})", Position, Team);
        }
    }
}

public class UserObj
{
    public int UserID { get; set; }
    public String Username { get; set; }
    public String Password { get; private set; }
    public String TeamName { get; set; }
    public int Order { get; set; }

    public UserObj()
    {
        UserID = 0;
        Username = "Invalid User";
        TeamName = "Invalid Team";
        Order = 0;
        Password = "No Password";
    }

    public UserObj(User usr, int order)
    {
        UserID = usr.UserID;
        Order = order;
        if (usr.Usernames.Count > 0)
        {
            Username = usr.Usernames[0].Username1;
            TeamName = usr.Usernames[0].TeamName;
            Password = usr.Password;
        }
        else
        {
            Username = String.Empty;
            TeamName = String.Empty;
        }
    }
}

public class Converter
{
    public static DraftMoveType ToDraftMoveType(int intVal)
    {
        DraftMoveType toRet;
        if (!Enum.TryParse(intVal.ToString(), out toRet))
        {
            toRet = DraftMoveType.Invalid;
        }
        return toRet;
    }

    public static DraftStatusType ToDraftStatusType(int intVal)
    {
        DraftStatusType toRet;
        if (!Enum.TryParse(intVal.ToString(), out toRet))
        {
            toRet = DraftStatusType.Invalid;
        }
        return toRet;
    }

    public static DraftActionType ToDraftActionType(int intVal)
    {
        DraftActionType toRet;
        if (!Enum.TryParse(intVal.ToString(), out toRet))
        {
            toRet = DraftActionType.Invalid;
        }
        return toRet;
    }

    public static UserActionType ToUserActionType(int intVal)
    {
        UserActionType toRet;
        if (!Enum.TryParse(intVal.ToString(), out toRet))
        {
            toRet = UserActionType.Unknown;
        }
        return toRet;
    }
}