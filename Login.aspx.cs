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
        bool showError = false;
        _ErrorMessage = String.Empty;
        try
        {
            DraftUser user = null;
            if (!String.IsNullOrWhiteSpace(Request.Form["username"]))
            {
                showError = true;
                user = DraftAuthentication.AuthenticateCredentials(Request.Form["username"], Request.Form["password"], Response);
            }
            else
            {
                user = DraftAuthentication.AuthenticateRequest(Request);
            }
            Response.Redirect("/Draft/draft");
        }
        catch (DraftAuthenticationException exc)
        {
            if (!String.IsNullOrWhiteSpace(exc.Username))
            {
                _PrefillUsername = exc.Username;
                _LoginMessage = exc.Username + " " + exc.Message + " " + exc.Expired.ToLongDateString() + " @ " + exc.Expired.ToLongTimeString();
            }
            else
            {
                _LoginMessage = exc.Message;
            }
            if (showError)
            {
                _ErrorMessage = exc.Message;
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

    protected String ErrorMessage
    {
        get
        {
            return _ErrorMessage;
        }
    }
    private String _ErrorMessage;
}