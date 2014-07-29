using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

/// <summary>
/// Summary description for DraftStatus
/// </summary>
public class DraftStatusObj
{
    public int TimeLeft { get; set; }
    public List<int> ActiveUsers { get; set; }
    public List<DraftPickStatusObj> OnTheClock { get; set; }
    public List<DraftPickStatusObj> DraftPicks { get; set; }

    public DraftStatusObj()
	{
        TimeLeft = -1;
        ActiveUsers = new List<int>();
        OnTheClock = new List<DraftPickStatusObj>();
        DraftPicks = new List<DraftPickStatusObj>();
	}

    public String toJson()
    {
        JavaScriptSerializer ser = new JavaScriptSerializer();
        return ser.Serialize(this);
    }
}