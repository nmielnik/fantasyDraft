using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;
using System.IO;

/// <summary>
/// Summary description for DraftSettings
/// </summary>
public class DraftSettings
{
    public int SecondsPerPick { get; private set; }
    public int ClockWarningSeconds { get; private set; }
    public int TeamsPerDraft { get; private set; }
    public int RoundsPerDraft { get; private set; }
    public int DraftSeasonID { get; private set; }
    public int ChatRoomCache { get; private set; }
    public int MSPerRefresh { get; private set; }
    public int ActiveUserSeconds { get; private set; }
    public DateTime ChatFilter { get; private set; }

	public DraftSettings()
	{
        SecondsPerPick = 90;
        ClockWarningSeconds = 30;
        TeamsPerDraft = 12;
        RoundsPerDraft = 18;
        DraftSeasonID = 6;
        ChatRoomCache = 50;
        MSPerRefresh = 750;
        ActiveUserSeconds = 5;
        ChatFilter = new DateTime(2013, 8, 25, 12, 0, 0);
	}
}