using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Text;

public partial class Login : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            DraftUser user = null;
            if (!String.IsNullOrWhiteSpace(Request.Form["username"]))
            {
                user = DraftAuthentication.AuthenticateCredentials(Request.Form["username"], Request.Form["password"], Response);
            }
            else
            {
                user = DraftAuthentication.AuthenticateRequest(Request);
            }
            Response.Redirect("/Draft/Draft/Draft.aspx");
        }
        catch (DraftAuthenticationException exc)
        {
            if (!String.IsNullOrWhiteSpace(exc.Username))
            {
                _PrefillUsername = exc.Username;
                _LoginMessage = exc.Username + " " + exc.Message + " " + exc.Expired.ToLongDateString();
            }
            else
            {
                _LoginMessage = exc.Message;
            }
        }
    }

    protected String LoginMessage
    {
        get
        {
            return _LoginMessage;
        }
    }
    private String _LoginMessage;

    protected String PrefillUsername
    {
        get
        {
            return _PrefillUsername;
        }
    }
    private String _PrefillUsername;
}