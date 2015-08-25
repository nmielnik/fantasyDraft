using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.IO;

/// <summary>
/// Summary description for DraftStatusObj
/// </summary>
public class DraftStatusObj
{
    public int Status { get; set; }
    public DateTime? Time { get; set; }

    public DraftStatusObj()
    {
        Status = (int)DraftStatusType.Invalid;
        Time = null;
    }

    public DraftStatusObj(DraftStatus draftStatus)
    {
        Status = draftStatus.Status;
        Time = draftStatus.Time;
    }

    public String toJson()
    {
        JavaScriptSerializer ser = new JavaScriptSerializer();
        return ser.Serialize(this);
    }
}