using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Jayrock;
using Jayrock.Json;

public partial class Chat : System.Web.UI.Page
{
    BallersDraftObj dataSource = new BallersDraftObj();

    public enum ChatResponse { Success = 0, InvalidText = 1, InvalidUser = 2 }

    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            DraftUser user = DraftAuthentication.AuthenticateRequest(Request);
            String command = Request["command"];
            String text = String.IsNullOrEmpty(Request["text"]) ? String.Empty : Request["text"];

            switch (command)
            {
                case "submit":
                    dataSource.LogUsage(user.Username, Request.ServerVariables["REMOTE_ADDR"], UserActionType.ChatSubmit);
                    SubmitText(user.Username, text);
                    break;
                case "query":
                    WriteQuery();
                    break;
            }
        }
        catch (DraftAuthenticationException)
        {
            WriteResponse((int)ChatResponse.InvalidUser);
        }
    }

    public void SubmitText(String username, String text)
    {
        ChatResponse eResponse = ChatResponse.Success;
        if (String.IsNullOrWhiteSpace(text))
        {
            eResponse = ChatResponse.InvalidText;
        }
        else
        {
            String toWrite = text.Trim();
            int userID = dataSource.FindUser(username);
            if (userID < 1)
            {
                eResponse = ChatResponse.InvalidUser;
            }
            else
            {
                dataSource.SubmitChat(new ChatObj()
                {
                    Text = toWrite,
                    UserID = userID,
                    Date = DateTime.Now
                });
            }
        }
        WriteResponse((int)eResponse);
    }

    private String FilterText(String rawText)
    {
        return rawText.Replace("'", "*");
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

    public void WriteQuery()
    {
        List<ChatObj> chatData = dataSource.GetChatData();
        using (JsonTextWriter writer = new JsonTextWriter(Response.Output))
        {
            writer.WriteStartObject();
            writer.WriteMember("Lines");
            writer.WriteStartArray();
            foreach (ChatObj data in chatData)
            {
                writer.WriteStartObject();
                writer.WriteMember("User");
                writer.WriteString(data.Username);
                writer.WriteMember("Text");
                writer.WriteString(HttpUtility.JavaScriptStringEncode(data.Text));
                writer.WriteEndObject();
            }
            writer.WriteEndArray();
            writer.WriteEndObject();
        }
        Response.End();
    }
}