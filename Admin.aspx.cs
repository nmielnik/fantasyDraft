using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Text;
using System.Web.Script.Serialization;

public partial class Admin : System.Web.UI.Page
{
    private JavaScriptSerializer jsonSerializer = new JavaScriptSerializer();

    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            _UserData = DraftAuthentication.AuthenticateRequest(Request, 1);
        }
        catch (DraftAuthenticationException)
        {
            Response.Redirect(DraftAuthentication.LoginPage, true);
        }
    }

    public DraftUser UserData
    {
        get
        {
            return _UserData;
        }
    }
    private DraftUser _UserData;
}