using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for DraftStatus
/// </summary>
public class DraftStatusObj
{
    public List<int> ActiveUsers { get; set; }
    public List<int> DraftQueue { get; set; }

    public DraftStatusObj()
	{
        ActiveUsers = new List<int>();
        DraftQueue = new List<int>();
	}
}