using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Jayrock;
using Jayrock.Json;

public partial class Status : System.Web.UI.Page
{
    protected BallersDraftObj dataSource = new BallersDraftObj();

    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            DraftUser user = DraftAuthentication.AuthenticateRequest(Request);
            dataSource.LogUsage(user.Username, Request.ServerVariables["REMOTE_ADDR"], UserActionType.DraftQuery);
            List<int> activeUsers = dataSource.GetActiveUsers();
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

            using (JsonTextWriter writer = new JsonTextWriter(Response.Output))
            {
                writer.WriteStartObject();
                writer.WriteMember("TimeLeft");
                writer.WriteNumber((int)timeLeft.TotalSeconds);
                writer.WriteMember("ActiveUsers");
                writer.WriteStartObject();
                foreach (int userID in activeUsers)
                {
                    writer.WriteMember(userID.ToString());
                    writer.WriteNumber(userID);
                }
                writer.WriteEndObject();
                writer.WriteMember("OnTheClock");
                writer.WriteStartArray();
                foreach (DraftMoveObj currMove in onTheClock)
                {
                    writer.WriteStartObject();
                    writer.WriteMember("Round");
                    writer.WriteNumber(currMove.Round);
                    writer.WriteMember("Pick");
                    writer.WriteNumber(currMove.Pick);
                    writer.WriteMember("Team");
                    writer.WriteNumber(currMove.UserID);
                    writer.WriteMember("Type");
                    writer.WriteNumber((int)currMove.Type);
                    writer.WriteEndObject();
                }
                writer.WriteEndArray();
                writer.WriteMember("DraftPicks");
                writer.WriteStartArray();
                for (QuickPick index = new QuickPick(); index.Round <= BallersDraftObj.Settings.RoundsPerDraft; index.Round++)
                {
                    for (index.Pick = 1; index.Pick <= BallersDraftObj.Settings.TeamsPerDraft; index.Pick++)
                    {
                        DraftMoveObj nextMove = draftData[index];
                        writer.WriteStartObject();
                        writer.WriteMember("Round");
                        writer.WriteNumber(nextMove.Round);
                        writer.WriteMember("Pick");
                        writer.WriteNumber(nextMove.Pick);
                        writer.WriteMember("Team");
                        writer.WriteNumber(nextMove.UserID);
                        writer.WriteMember("Player");
                        if (nextMove.PlayerID.HasValue)
                            writer.WriteNumber(nextMove.PlayerID.Value);
                        else
                            writer.WriteNull();
                        writer.WriteMember("Type");
                        writer.WriteNumber((int)nextMove.Type);
                        writer.WriteEndObject();
                    }
                }
                writer.WriteEndArray();
                writer.WriteEndObject();
            }
            Response.End();
        }
        catch (DraftAuthenticationException)
        {
            using (JsonTextWriter writer = new JsonTextWriter(Response.Output))
            {
                writer.WriteStartObject();
                writer.WriteMember("Result");
                writer.WriteNumber(2);
                writer.WriteEndObject();
            }
            Response.End();
        }
    }
}