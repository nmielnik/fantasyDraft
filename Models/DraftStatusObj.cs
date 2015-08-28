using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FantasyDraftAPI.Models
{
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
            : this()
        {
            if (draftStatus != null)
            {
                Status = draftStatus.Status;
                Time = draftStatus.Time.ToUniversalTime();
            }
        }
    }
}