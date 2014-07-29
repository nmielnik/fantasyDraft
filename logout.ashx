<%@ WebHandler Language="C#" Class="Logout" %>

using System;
using System.Web;

public class Logout : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        DraftAuthentication.Logout(context.Response);
        context.Response.Redirect(DraftAuthentication.LoginPage, true);
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}