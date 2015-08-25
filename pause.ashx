<%@ WebHandler Language="C#" Class="pause" %>

using System;
using System.Web;
using System.Net;
using System.Collections.Generic;
using System.IO;
using System.Web.Script.Serialization;

public class pause : IHttpHandler {

    protected BallersDraftObj dataSource = new BallersDraftObj();
    
    public void ProcessRequest (HttpContext context) {
        JavaScriptSerializer jsonSerializer = new JavaScriptSerializer();
        
        try
        {
            DraftUser user = DraftAuthentication.AuthenticateRequest(context.Request, 1);

            DraftStatusObj status = null;

            if (context.Request.HttpMethod == "POST" || context.Request.HttpMethod == "PUT")
            {
                String jsonString = String.Empty;

                context.Request.InputStream.Position = 0;
                using (StreamReader inputStream = new StreamReader(context.Request.InputStream))
                {
                    jsonString = inputStream.ReadToEnd();
                }

                status = dataSource.SetDraftStatusObj(jsonSerializer.Deserialize<DraftStatusObj>(jsonString));
            }
            else
            {
                status = dataSource.GetDraftStatusObj();
            }

            context.Response.StatusCode = (int)HttpStatusCode.OK;
            context.Response.Write(jsonSerializer.Serialize(status));
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