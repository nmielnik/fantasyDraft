using System;
using System.Collections.Generic;
using System.Linq;
using FantasyDraftAPI.Models;

namespace FantasyDraftAPI.Services
{
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
                               where t.SeasonID == Settings.DraftSeasonID
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

        public Dictionary<String, PlayerObj> GetPlayerMap()
        {
            Dictionary<String, PlayerObj> allPlayers = new Dictionary<String, PlayerObj>();

            var query = from t in db.Players
                        select t;

            foreach (Player p in query)
            {
                PlayerObj nextPlayer = new PlayerObj()
                {
                    PlayerID = p.PlayerID,
                    FirstName = p.FirstName,
                    LastName = p.LastName,
                    Suffix = p.Suffix,
                    Identity = p.Identifier,
                    Team = p.Team,
                    Position = p.Position
                };
                allPlayers[nextPlayer.PlayerID.ToString()] = nextPlayer;
            }

            return allPlayers;
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

        public DraftStatusObj GetDraftStatusObj()
        {
            return new DraftStatusObj(this.GetCurrentDraftStatus());
        }

        private DraftStatus GetCurrentDraftStatus()
        {
            DraftStatus toRet = null;

            var allCurrStatus = from t in db.DraftStatus
                                where t.ID == 1
                                select t;
            if (allCurrStatus.Count() > 0)
            {
                toRet = allCurrStatus.First();
            }

            return toRet;
        }

        public DraftStatusObj SetNextDraftStatusObj(DraftStatusObj toSet)
        {
            DraftStatusObj toRet = null;
            lock (_DraftLock)
            {
                var allNextStatus = from t in db.DraftStatus
                                    where t.ID == 2
                                    select t;
                DraftStatus next = allNextStatus.First();
                next.Status = toSet.Status;
                next.Time = DateTime.Now;

                // Commit all changes to the DB
                db.SubmitChanges();

                toRet = new DraftStatusObj(next);
            }
            return toRet;
        }

        public DraftMoveObj UpdateLastOnTheClock(OnClockUpdateObj update)
        {
            DraftMoveObj toRet = null;

            lock (_DraftLock)
            {
                bool isPaused = this.GetCurrentDraftStatus().Status == (int)DraftStatusType.Paused;
                if (isPaused)
                {
                    List<DraftMove> onClock = this.GetCurrentOnClock_Internal();

                    if (onClock.Count >= 1)
                    {
                        onClock.Sort(new DraftMoveComparer());
                        DraftMove last = onClock[onClock.Count - 1];
                        int secondsLeft = update.SecondsLeft > Settings.SecondsPerPick ? Settings.SecondsPerPick : update.SecondsLeft;
                        last.Time = DateTime.Now - TimeSpan.FromSeconds(Settings.SecondsPerPick - secondsLeft);
                        toRet = new DraftMoveObj(last);

                        db.SubmitChanges();
                    }
                }
            }

            return toRet;
        }

        public DraftMoveObj RemoveLastOnTheClock()
        {
            DraftMoveObj toRet = null;

            lock (_DraftLock)
            {
                bool isPaused = this.GetCurrentDraftStatus().Status == (int)DraftStatusType.Paused;
                if (isPaused)
                {
                    List<DraftMove> onClock = this.GetCurrentOnClock_Internal();

                    if (onClock.Count >= 1)
                    {
                        onClock.Sort(new DraftMoveComparer());
                        DraftMove last = onClock[onClock.Count - 1];
                        toRet = new DraftMoveObj(last);
                        db.DraftMoves.DeleteOnSubmit(last);

                        if (onClock.Count >= 2)
                        {
                            DraftMove nextToLast = onClock[onClock.Count - 2];
                            nextToLast.Time = DateTime.Now - TimeSpan.FromSeconds(Settings.SecondsPerPick - 30);
                        }

                        db.SubmitChanges();
                    }
                }
            }

            return toRet;
        }

        /// <summary>
        /// NOTE: You MUST Lock before calling this function
        /// </summary>
        /// <returns></returns>
        private List<DraftMove> GetCurrentOnClock_Internal()
        {
            List<DraftMove> toRet = new List<DraftMove>();
            Dictionary<QuickPick, DraftMoveObj> Picked = new Dictionary<QuickPick, DraftMoveObj>();

            int intClock = (int)DraftMoveType.OnClock;
            var allOnClock = from t in db.DraftMoves
                             where t.MoveType == intClock && t.SeasonID == Settings.DraftSeasonID
                             select t;

            int intPick = (int)DraftMoveType.Pick;
            var allPicked = from t in db.DraftMoves
                            where t.MoveType == intPick && t.SeasonID == Settings.DraftSeasonID
                            select t;

            foreach (DraftMove mPicked in allPicked)
            {
                Picked[new QuickPick() { Round = mPicked.Round, Pick = mPicked.Pick }] = new DraftMoveObj(mPicked);
            }

            foreach (DraftMove mOnClock in allOnClock)
            {
                QuickPick index = new QuickPick() { Round = mOnClock.Round, Pick = mOnClock.Pick };
                if (!Picked.ContainsKey(index))
                {
                    toRet.Add(mOnClock);
                }
            }

            return toRet;
        }

        public List<DraftMoveObj> FindOnTheClock()
        {
            List<DraftMoveObj> onclock = new List<DraftMoveObj>();
            List<DraftMove> toPause = new List<DraftMove>();
            DraftMoveObj addedOnClock = null;

            // This entire operation MUST be atomic, so a Lock is required
            lock (_DraftLock)
            {
                DraftStatus oStatus = GetCurrentDraftStatus();
                DraftStatusType currStatus = Converter.ToDraftStatusType(oStatus.Status);
                bool isPaused = (currStatus == DraftStatusType.Paused);

                var allNextStatus = from t in db.DraftStatus
                                    where t.ID == 2
                                    select t;
                DraftActionType nextStatus = Converter.ToDraftActionType(allNextStatus.First().Status);

                List<DraftMove> currentOnClock = this.GetCurrentOnClock_Internal();
                if (isPaused)
                {
                    toPause = currentOnClock;
                }
                else
                {
                    foreach (DraftMove mOnClock in currentOnClock)
                    {
                        onclock.Add(new DraftMoveObj(mOnClock));
                    }

                    if (onclock.Count > 0)
                    {
                        onclock.Sort(new DraftMoveObjComparer());
                    }
                }

                // Determine if a new OnClock Move is needed
                bool addOnClock = (onclock.Count == 0 && toPause.Count == 0);

                // We attempt to minimize the time delay by waiting to calculate the current time
                // as far as possible. So if we don't need to calculate how much time is left
                // on the last OnClock Move, we'll wait longer. Otherwise, we have to re-use this one
                // to keep everything synchronized
                DateTime? currentTime = null;

                if (onclock.Count > 0)
                {
                    currentTime = DateTime.Now;
                    DraftMoveObj lastOnClock = onclock[onclock.Count - 1];
                    TimeSpan timeLeft = TimeSpan.FromSeconds(Settings.SecondsPerPick) - (currentTime.Value - lastOnClock.Time);

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

                // If the Draft is Paused or needs to change actions, update it
                int iCurr = (int)currStatus;
                int iNext = (int)nextStatus;
                if (isPaused || iCurr != iNext)
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
            PlayerObj player = null;

            lock (_DraftLock)
            {
                player = FindPlayer(playerID);
                if (player == null)
                    result = PickResult.InvalidPlayer;
                else if (!Settings.PositionMaxes.ContainsKey(player.Position))
                    result = PickResult.InvalidPosition;
                else
                {
                    List<PlayerObj> draftedPlayers = GetUsersDraftedPlayers(userID);
                    int posCount = draftedPlayers.Sum(x => x.Position == player.Position ? 1 : 0);
                    if (posCount >= Settings.PositionMaxes[player.Position])
                        result = PickResult.PositionMax;
                    else
                    {
                        PlayerObj pickedPlayer = FindPickedPlayer(playerID);
                        if (pickedPlayer != null)
                            result = PickResult.AlreadyPicked;
                        else
                        {
                            DraftMoveObj match = FindUserOnClock(userID);
                            if (match == null)
                                result = PickResult.NotTurn;
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

        List<PlayerObj> GetUsersDraftedPlayers(int userID)
        {
            List<PlayerObj> players = new List<PlayerObj>();

            var intPicked = (int)DraftMoveType.Pick;
            var intKept = (int)DraftMoveType.Keep;
            var draftPicks = from p in db.DraftMoves
                               where p.SeasonID == Settings.DraftSeasonID &&
                               p.UserID == userID &&
                               (p.MoveType == intPicked || p.MoveType == intKept) &&
                               p.PlayerID.HasValue
                               select p;
            foreach (DraftMove pick in draftPicks)
            {
                players.Add(new PlayerObj(pick.Player));
            }

            return players;
        }

        DraftMoveObj FindUserOnClock(int userID)
        {
            DraftMoveObj match = null;
            List<DraftMoveObj> onClock = FindOnTheClock();
            foreach (DraftMoveObj allowed in onClock)
            {
                if (allowed.UserID == userID)
                {
                    match = allowed;
                    break;
                }
            }
            return match;
        }

        PlayerObj FindPlayer(int playerID)
        {
            PlayerObj match = null;
            var allPlayers = from t in db.Players
                             where t.PlayerID == playerID
                             select t;

            if (allPlayers.Count() > 0)
                match = new PlayerObj(allPlayers.First());

            return match;
        }

        PlayerObj FindPickedPlayer(int playerID)
        {
            PlayerObj match = null;
            var intPicked = (int)DraftMoveType.Pick;
            var intKept = (int)DraftMoveType.Keep;
            var pickedPlayer = from p in db.DraftMoves
                                where p.SeasonID == Settings.DraftSeasonID &&
                                (p.MoveType == intPicked || p.MoveType == intKept) &&
                                p.PlayerID.HasValue &&
                                p.PlayerID == playerID
                                select p;
            if (pickedPlayer.Count() > 0)
                match = new PlayerObj(pickedPlayer.First().Player);

            return match;
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

        public UserStatusObj GetStatus(int userId)
        {
            UserStatusObj toRet = new UserStatusObj() { UserID = userId };

            lock (_UsageLock)
            {
                UserStatus status = GetOrCreateUserStatus(userId);
                status.Date = DateTime.Now;
                db.SubmitChanges();

                toRet = new UserStatusObj(status);

                // Get Active Users
                toRet.ActiveUsers = GetActiveUsers();
            }

            return toRet;
        }

        public UserStatusObj UpdateStatus(UserStatusObj updated)
        {
            UserStatusObj toRet = null;

            lock (_UsageLock)
            {
                // Get user
                UserStatus status = GetOrCreateUserStatus(updated.UserID);
                status.Queue = updated.QueueToString();
                status.Date = DateTime.Now;
                db.SubmitChanges();

                toRet = new UserStatusObj(status);

                // Get Active Users
                toRet.ActiveUsers = GetActiveUsers();
            }

            return toRet;
        }

        private UserStatus GetOrCreateUserStatus(int userId)
        {
            UserStatus status = null;
            var query = from t in db.UserStatus
                        where t.UserID == userId && t.SeasonID == Settings.DraftSeasonID
                        select t;
            if (query.Count() > 0)
            {
                status = query.First();
            }
            else
            {
                status = new UserStatus()
                {
                    UserID = userId,
                    SeasonID = Settings.DraftSeasonID
                };
                db.UserStatus.InsertOnSubmit(status);
            }
            return status;
        }

        private List<int> GetActiveUsers()
        {
            List<int> toRet = new List<int>();
            DateTime activeTime = DateTime.Now.Subtract(TimeSpan.FromSeconds(Settings.ActiveUserSeconds));

            var query = from t in db.UserStatus
                        where t.SeasonID == Settings.DraftSeasonID &&
                        t.Date >= activeTime
                        select t;

            if (query.Count() > 0)
            {
                foreach (UserStatus nextStatus in query)
                {
                    if (!toRet.Contains(nextStatus.UserID))
                        toRet.Add(nextStatus.UserID);
                }
            }
            return toRet;
        }
    }
}