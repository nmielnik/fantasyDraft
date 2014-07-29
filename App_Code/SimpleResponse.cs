using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.IO;

/// <summary>
/// Summary description for SimpleResponse
/// </summary>
public class SimpleResponse
{
    public int Status { get; set; }
    public String Message { get; set; }

	public SimpleResponse()
	{
        Status = 200;
        Message = "";
	}

    public String toJson()
    {
        JavaScriptSerializer ser = new JavaScriptSerializer();
        return ser.Serialize(this);
    }
}