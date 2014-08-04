<%@ WebHandler Language="C#" Class="chat" %>

using System;
using System.IO;
using System.Web;
using System.Net;
using System.Collections.Generic;
using System.Web.Script.Serialization;

public class chat : IHttpHandler {
    
    BallersDraftObj dataSource = new BallersDraftObj();
    
    public void ProcessRequest (HttpContext context) 
    {
        try
        {
            JavaScriptSerializer jsonSerializer = new JavaScriptSerializer();
            
            DraftUser user = DraftAuthentication.AuthenticateRequest(context.Request);
            if (context.Request.HttpMethod == "POST")
            {
                String jsonString = String.Empty;

                context.Request.InputStream.Position = 0;
                using (StreamReader inputStream = new StreamReader(context.Request.InputStream))
                {
                    jsonString = inputStream.ReadToEnd();
                }

                ChatObj next = jsonSerializer.Deserialize<ChatObj>(jsonString);

                String text = next.Text;
                if (!String.IsNullOrWhiteSpace(text))
                {
                    dataSource.SubmitChat(new ChatObj()
                    {
                        Text = text.Trim(),
                        UserID = user.ID,
                        Date = DateTime.Now
                    });
                }
                SimpleResponse response = new SimpleResponse() { Status = 200, Message = text };
                context.Response.StatusCode = 200;
                context.Response.Write(response.toJson());
            }
            List<ChatObj> chatData = dataSource.GetChatData();

            context.Response.StatusCode = (int)HttpStatusCode.OK;
            context.Response.ContentType = "application/json";
            context.Response.Write(jsonSerializer.Serialize(chatData));
        }
        catch (DraftAuthenticationException)
        {
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            SimpleResponse response = new SimpleResponse() { Status = context.Response.StatusCode, Message = "Unauthorized" };
            context.Response.Write(response.toJson());
        }
        context.Response.End();
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }
}