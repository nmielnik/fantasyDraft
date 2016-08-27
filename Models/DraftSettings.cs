using System;

namespace FantasyDraftAPI.Models
{
    /// <summary>
    /// Summary description for DraftSettings
    /// </summary>
    public class DraftSettings
    {
        public int SecondsPerPick { get; set; }
        public int ClockWarningSeconds { get; set; }
        public int TeamsPerDraft { get; set; }
        public int RoundsPerDraft { get; set; }
        public int DraftSeasonID { get; set; }
        public int ChatRoomCache { get; set; }
        public int MSPerRefresh { get; set; }
        public int MSPerChatRefresh { get; set; }
        public int MSPerStatusRefresh { get; set; }
        public int ActiveUserSeconds { get; set; }
        public DateTime ChatFilter { get; set; }

        public DraftSettings()
        {
            SecondsPerPick = 120;
            ClockWarningSeconds = 30;
            TeamsPerDraft = 12;
            RoundsPerDraft = 17;
            DraftSeasonID = 10;
            ChatRoomCache = 50;
            MSPerRefresh = 1000;
            MSPerChatRefresh = 1500;
            MSPerStatusRefresh = 5000;
            ActiveUserSeconds = 15;
            ChatFilter = new DateTime(2016, 8, 20, 12, 0, 0);
        }
    }
}