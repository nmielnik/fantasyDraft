using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Jayrock;
using Jayrock.Json;

public partial class Submit : System.Web.UI.Page
{
    protected BallersDraftObj dataSource = new BallersDraftObj();

    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            DraftUser user = DraftAuthentication.AuthenticateRequest(Request);
            String player = String.Empty;
            int playerID = 0;
            int userID = 0;
            UserActionType actionType = UserActionType.PickFailed;

            player = Request["player"].Trim();

            if (String.IsNullOrEmpty(player) || !int.TryParse(player, out playerID))
            {
                dataSource.LogUsage(user.Username, Request.ServerVariables["REMOTE_ADDR"], actionType);
                WriteResponse((int)PickResult.InvalidPlayer);
            }
            else
            {
                userID = dataSource.FindUser(user.Username);
                if (userID <= 0)
                {
                    dataSource.LogUsage(user.Username, Request.ServerVariables["REMOTE_ADDR"], actionType);
                    WriteResponse((int)PickResult.NotTurn);
                }
                else
                {
                    PickResult result = dataSource.SubmitPick(userID, playerID);
                    if (result == PickResult.Success)
                        actionType = UserActionType.PickSucces;
                    dataSource.LogUsage(user.Username, Request.ServerVariables["REMOTE_ADDR"], actionType);
                    WriteResponse((int)result);
                }
            }
        }
        catch (DraftAuthenticationException)
        {
            WriteResponse(2);
        }
    }

    public void WriteResponse(int code)
    {
        using (JsonTextWriter writer = new JsonTextWriter(Response.Output))
        {
            writer.WriteStartObject();
            writer.WriteMember("Result");
            writer.WriteNumber(code);
            writer.WriteEndObject();
        }
        Response.End();
    }
}