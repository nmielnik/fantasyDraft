using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Text;
using Jayrock;
using Jayrock.Json;

public partial class Draft : System.Web.UI.Page
{
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
            if (String.IsNullOrEmpty(_SettingsJSON))
            {
                using (StringWriter sw = new StringWriter())
                {
                    using (JsonTextWriter writer = new JsonTextWriter(sw))
                    {
                        writer.WriteStartObject();
                        writer.WriteMember("Teams");
                        writer.WriteNumber(Options.TeamsPerDraft);
                        writer.WriteMember("Rounds");
                        writer.WriteNumber(Options.RoundsPerDraft);
                        writer.WriteMember("PickSeconds");
                        writer.WriteNumber(Options.SecondsPerPick);
                        writer.WriteMember("SeasonID");
                        writer.WriteNumber(Options.DraftSeasonID);
                        writer.WriteMember("ClockWarn");
                        writer.WriteNumber(Options.ClockWarningSeconds);
                        writer.WriteMember("RefreshRate");
                        writer.WriteNumber(Options.MSPerRefresh);
                        writer.WriteEndObject();
                    }
                    _SettingsJSON = sw.ToString();
                    sw.Close();
                }
            }
            return _SettingsJSON;
        }
    }
    private String _SettingsJSON;

    public String CurrentUserJSON
    {
        get
        {
            String toRet = String.Empty;
            using (StringWriter sw = new StringWriter())
            {
                using (JsonTextWriter writer = new JsonTextWriter(sw))
                {
                    writer.WriteStartObject();
                    writer.WriteMember("ID");
                    writer.WriteNumber(UserData.ID);
                    writer.WriteMember("Name");
                    writer.WriteString(UserData.Username);
                    writer.WriteMember("Team");
                    writer.WriteString(UserData.TeamName);
                    writer.WriteMember("Pick");
                    writer.WriteNumber(UserData.DraftOrder);
                    writer.WriteEndObject();
                }
                toRet = sw.ToString();
                sw.Close();
            }
            return toRet;
        }
    }

    public String PlayerTableJSON
    {
        get
        {
            if (String.IsNullOrEmpty(_PlayerTableJSON))
            {
                List<PlayerObj> allPlayers = DraftObj.QueryPlayers();
                using (StringWriter sw = new StringWriter())
                {
                    using (JsonTextWriter writer = new JsonTextWriter(sw))
                    {
                        writer.WriteStartObject();
                        foreach (PlayerObj nextP in allPlayers)
                        {
                            writer.WriteMember(nextP.PlayerID.ToString());
                            writer.WriteStartObject();
                            writer.WriteMember("ID");
                            writer.WriteNumber(nextP.PlayerID);
                            writer.WriteMember("Name");
                            writer.WriteString(nextP.Name);
                            writer.WriteMember("TeamInfo");
                            writer.WriteString(nextP.TeamInfo);
                            writer.WriteMember("Picked");
                            writer.WriteBoolean(false);
                            writer.WriteEndObject();
                        }
                        writer.WriteEndObject();
                    }
                    _PlayerTableJSON = sw.ToString();
                    sw.Close();
                }
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
                using (StringWriter sw = new StringWriter())
                {
                    using (JsonTextWriter writer = new JsonTextWriter(sw))
                    {
                        writer.WriteStartObject();
                        foreach (UserObj nextUser in AllUsers)
                        {
                            writer.WriteMember(nextUser.Order.ToString());
                            writer.WriteNumber(nextUser.UserID);
                        }
                        writer.WriteEndObject();
                    }
                    _OrderMapJson = sw.ToString();
                    sw.Close();
                }
            }
            return _OrderMapJson;
        }
    }
    private String _OrderMapJson;

    public String UserTableJSON
    {
        get
        {
            if (String.IsNullOrEmpty(_UserTableJSON))
            {
                using (StringWriter sw = new StringWriter())
                {
                    using (JsonTextWriter writer = new JsonTextWriter(sw))
                    {
                        writer.WriteStartObject();
                        foreach (UserObj nextUser in AllUsers)
                        {
                            writer.WriteMember(nextUser.UserID.ToString());
                            writer.WriteStartObject();
                            writer.WriteMember("ID");
                            writer.WriteNumber(nextUser.UserID);
                            writer.WriteMember("Name");
                            writer.WriteString(nextUser.Username);
                            writer.WriteMember("Team");
                            writer.WriteString(nextUser.TeamName);
                            writer.WriteMember("Pick");
                            writer.WriteNumber(nextUser.Order);
                            writer.WriteEndObject();
                        }
                        writer.WriteEndObject();
                    }
                    _UserTableJSON = sw.ToString();
                    sw.Close();
                }
            }
            return _UserTableJSON;
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