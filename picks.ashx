<%@ WebHandler Language="C#" Class="picks" %>

using System;
using System.Web;
using System.Net;
using System.Collections.Generic;

public class picks : IHttpHandler {

    protected BallersDraftObj dataSource = new BallersDraftObj();
    
    public void ProcessRequest (HttpContext context) 
    {
        try
        {
            DraftUser user = DraftAuthentication.AuthenticateRequest(context.Request);
            // dataSource.LogUsage(user.Username, context.Request.ServerVariables["REMOTE_ADDR"], UserActionType.DraftQuery);
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
            context.Response.Write(data.toJson());
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