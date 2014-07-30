<%@ WebHandler Language="C#" Class="picks" %>

using System;
using System.Web;
using System.Net;
using System.IO;
using System.Collections.Generic;
using System.Web.Script.Serialization;

public class picks : IHttpHandler {

    protected BallersDraftObj dataSource = new BallersDraftObj();
    
    public void ProcessRequest (HttpContext context) 
    {
        try
        {
            JavaScriptSerializer jsonSerializer = new JavaScriptSerializer();

            DraftUser user = DraftAuthentication.AuthenticateRequest(context.Request);
            /*
            DraftUser user = DraftAuthentication.AuthenticateRequest(context.Request);
            List<DraftMoveObj> onTheClock = new List<DraftMoveObj>();
            Dictionary<QuickPick, DraftMoveObj> draftData = dataSource.QueryDraftData(out onTheClock);
            TimeSpan timeLeft = TimeSpan.FromTicks(0);
            if (onTheClock.Count > 0)
            {
                DraftMoveObj current = onTheClock[onTheClock.Count - 1];
                timeLeft = TimeSpan.FromSeconds(BallersDraftObj.Settings.SecondsPerPick) - (DateTime.Now - current.Time);
                if (timeLeft < TimeSpan.FromTicks(0))
                    timeLeft = TimeSpan.FromTicks(0);
            }

            DraftStatusObj data = new DraftStatusObj();
            data.TimeLeft = (int)timeLeft.TotalSeconds;
            data.ActiveUsers = dataSource.GetActiveUsers();
            foreach (DraftMoveObj currMove in onTheClock)
            {
                data.OnTheClock.Add(new DraftPickStatusObj()
                {
                    Round = currMove.Round,
                    Pick = currMove.Pick,
                    Team = currMove.UserID,
                    Type = currMove.TypeInt
                });
            }
            for (QuickPick index = new QuickPick(); index.Round <= BallersDraftObj.Settings.RoundsPerDraft; index.Round++)
            {
                for (index.Pick = 1; index.Pick <= BallersDraftObj.Settings.TeamsPerDraft; index.Pick++)
                {
                    DraftMoveObj nextMove = draftData[index];
                    data.DraftPicks.Add(new DraftPickStatusObj()
                    {
                        Round = nextMove.Round,
                        Pick = nextMove.Pick,
                        Team = nextMove.UserID,
                        Player = nextMove.PlayerID,
                        Type = nextMove.TypeInt
                    });
                }
            }
            context.Response.StatusCode = (int)HttpStatusCode.OK;
            context.Response.Write(data.toJson());*/

            if (context.Request.HttpMethod == "POST")
            {
                UserActionType actionType = UserActionType.PickFailed;

                String jsonString = String.Empty;

                context.Request.InputStream.Position = 0;
                using (StreamReader inputStream = new StreamReader(context.Request.InputStream))
                {
                    jsonString = inputStream.ReadToEnd();
                }

                DraftPickStatusObj next = jsonSerializer.Deserialize<DraftPickStatusObj>(jsonString);

                if (!next.Player.HasValue)
                {
                    dataSource.LogUsage(user.Username, context.Request.ServerVariables["REMOTE_ADDR"], actionType);
                    throw new HttpStatusException(HttpStatusCode.NotFound, "The player you entered is invalid or does not exists");
                }
                else
                {
                    PickResult result = dataSource.SubmitPick(user.ID, next.Player.Value);
                    if (result != PickResult.Success)
                    {
                        switch (result)
                        {
                            case PickResult.AlreadyPicked:
                                throw new HttpStatusException(HttpStatusCode.MethodNotAllowed, "That player has already been chosen");
                                break;
                            case PickResult.InvalidPlayer:
                                throw new HttpStatusException(HttpStatusCode.NotFound, "The player you entered is invalid or does not exist");
                                break;
                            case PickResult.NotTurn:
                                throw new HttpStatusException(HttpStatusCode.Forbidden, "It's not your turn to pick");
                                break;
                        }
                    }
                    else
                    {
                        actionType = UserActionType.PickSucces;
                    }
                    dataSource.LogUsage(user.Username, context.Request.ServerVariables["REMOTE_ADDR"], actionType);
                }
            }
            
            List<DraftPickStatusObj> toRet = new List<DraftPickStatusObj>();

            List<DraftMoveObj> onTheClock = new List<DraftMoveObj>();
            Dictionary<QuickPick, DraftMoveObj> draftData = dataSource.QueryDraftData(out onTheClock);
            DraftPickStatusObj onClockPick = null;
            DraftMoveObj lastOnClockMoveObj = null;

            for (QuickPick index = new QuickPick(); index.Round <= BallersDraftObj.Settings.RoundsPerDraft; index.Round++)
            {
                for (index.Pick = 1; index.Pick <= BallersDraftObj.Settings.TeamsPerDraft; index.Pick++)
                {
                    DraftMoveObj nextMove = draftData[index];
                    toRet.Add(new DraftPickStatusObj()
                    {
                        Round = nextMove.Round,
                        Pick = nextMove.Pick,
                        Team = nextMove.UserID,
                        Player = nextMove.PlayerID,
                        Type = nextMove.TypeInt
                    });
                }
            }
            foreach (DraftMoveObj currMove in onTheClock)
            {
                lastOnClockMoveObj = currMove;
                onClockPick = new DraftPickStatusObj()
                {
                    Round = currMove.Round,
                    Pick = currMove.Pick,
                    Team = currMove.UserID,
                    Type = currMove.TypeInt
                };
                toRet[onClockPick.TotalPick - 1] = onClockPick;
            }

            if (lastOnClockMoveObj != null)
            {
                TimeSpan timeLeft = TimeSpan.FromSeconds(BallersDraftObj.Settings.SecondsPerPick) - (DateTime.Now - lastOnClockMoveObj.Time);
                if (timeLeft < TimeSpan.FromTicks(0))
                    timeLeft = TimeSpan.FromTicks(0);
                onClockPick.TimeLeft = (int)timeLeft.TotalSeconds;
            }

            context.Response.StatusCode = (int)HttpStatusCode.OK;
            context.Response.Write(jsonSerializer.Serialize(toRet));
        }
        catch (HttpStatusException ex)
        {
            context.Response.StatusCode = (int)ex.Status;
            SimpleResponse response = new SimpleResponse() { Status = (int)ex.Status, Message = ex.Message };
            context.Response.Write(response.toJson());
        }
        catch (DraftAuthenticationException)
        {
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            SimpleResponse response = new SimpleResponse() { Status = context.Response.StatusCode, Message = "Unauthorized" };
            context.Response.Write(response.toJson());
        }
        catch (Exception ex)
        {
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            SimpleResponse response = new SimpleResponse() { Status = context.Response.StatusCode, Message = ex.Message };
            context.Response.Write(response.toJson());
        }
        context.Response.ContentType = "application/json";
        context.Response.End();
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}

public class HttpStatusException : Exception
{
    public HttpStatusCode Status { get; set; }
    
    public HttpStatusException(HttpStatusCode status, String message) : this(status, message, null) { }

    public HttpStatusException(HttpStatusCode status, String message, Exception innerException)
        : base(message, innerException)
    {
        Status = status;
    }
}