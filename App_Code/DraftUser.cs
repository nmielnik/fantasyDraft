using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

/// <summary>
/// User authentication data
/// </summary>
public class DraftUser
{
    public String Username { get; private set; }
    public String TeamName { get; private set; }
    public DateTime Expires { get; private set; }
    public int DraftOrder { get; private set; }
    public int ID { get; private set; }

    public DraftUser()
    {
        Username = null;
        Expires = DateTime.Now.AddMinutes(30);
        DraftOrder = -1;
        ID = -1;
    }

    public DraftUser(Username dbUsername, int order) : this()
    {
        TeamName = dbUsername.TeamName;
        Username = dbUsername.Username1;
        DraftOrder = order;
        ID = dbUsername.User.UserID;
    }

    public String toJson()
    {
        JavaScriptSerializer ser = new JavaScriptSerializer();
        return ser.Serialize(this);
    }
}