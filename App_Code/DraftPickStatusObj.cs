using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for DraftPickStatusObj
/// </summary>
public class DraftPickStatusObj
{
    public int? Round { get; set; }
    public int? Pick { get; set; }
    public int? Team { get; set; }
    public int? Player { get; set; }
    public int? Type { get; set; }
    public int? TimeLeft { get; set; }
    public int TotalPick
    {
        get
        {
            int toRet = 0;
            if (Round.HasValue && Pick.HasValue)
            {
                toRet = ((Round.Value - 1) * BallersDraftObj.Settings.TeamsPerDraft) + Pick.Value;
            }
            return toRet;
        }
    }

	public DraftPickStatusObj()
	{
        
    }
}