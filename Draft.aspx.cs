using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Text;
using System.Web.Script.Serialization;

public partial class Draft : System.Web.UI.Page
{
    private JavaScriptSerializer jsonSerializer = new JavaScriptSerializer();

    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            _UserData = DraftAuthentication.AuthenticateRequest(Request);
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

    protected BallersDraftObj DraftObj
    {
        get
        {
            if (_DraftObj == null)
                _DraftObj = new BallersDraftObj();
            return _DraftObj;
        }
    }
    private BallersDraftObj _DraftObj;

    public DraftSettings Options
    {
        get
        {
            return BallersDraftObj.Settings;
        }
    }

    public String SettingsJSON
    {
        get
        {
            return jsonSerializer.Serialize(Options);
            // "Teams" -> "TeamsPerDraft"
            // "Rounds" -> "RoundsPerDraft"
            // "PickSeconds" -> "SecondsPerPick"
            // "SeasonID" -> "DraftSeasonID"
            // "ClockWarn" -> "ClockWarningSeconds"
            // "RefreshRate" -> "MSPerRefresh"
        }
    }

    public String CurrentUserJSON
    {
        get
        {
            return UserData.toJson();
            // "ID" -> "ID"
            // "Name" -> "Username"
            // "Team" -> "TeamName"
            // "Pick" -> "DraftOrder"
        }
    }

    public String PlayerTableJSON
    {
        get
        {
            if (String.IsNullOrEmpty(_PlayerTableJSON))
            {
                _PlayerTableJSON = jsonSerializer.Serialize(DraftObj.QueryPlayers());
            }
            return _PlayerTableJSON;
        }
    }
    private String _PlayerTableJSON;

    public String OrderMapJSON
    {
        get
        {
            if (String.IsNullOrEmpty(_OrderMapJson))
            {
                Dictionary<String, int> orderMap = new Dictionary<String, int>();
                foreach (UserObj nextUser in AllUsers)
                {
                    orderMap[nextUser.Order.ToString()] = nextUser.UserID;
                }
                _OrderMapJson = jsonSerializer.Serialize(orderMap);
            }
            return _OrderMapJson;
        }
    }
    private String _OrderMapJson;

    public String UserTableJSON
    {
        get
        {
            return jsonSerializer.Serialize(AllUsers);
            // "ID" -> "UserID"
            // "Name" -> "Username"
            // "Team" -> "TeamName"
            // "Pick" -. "Order"
        }
    }
    private String _UserTableJSON;

    public List<UserObj> AllUsers
    {
        get
        {
            if (_AllUsers == null)
                _AllUsers = DraftObj.QueryUsers();
            return _AllUsers;
        }
    }
    private List<UserObj> _AllUsers;
}