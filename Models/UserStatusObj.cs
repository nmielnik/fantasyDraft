using System;
using System.Collections.Generic;

namespace FantasyDraftAPI.Models
{
    /// <summary>
    /// Summary description for DraftStatus
    /// </summary>
    public class UserStatusObj
    {
        public int UserID { get; set; }
        public List<int> ActiveUsers { get; set; }
        public List<int> DraftQueue { get; set; }

        public UserStatusObj()
        {
            ActiveUsers = new List<int>();
            DraftQueue = new List<int>();
        }

        public UserStatusObj(UserStatus status)
            : this()
        {
            if (status != null)
            {
                UserID = status.UserID;
                if (!String.IsNullOrWhiteSpace(status.Queue))
                {
                    String[] queueStr = status.Queue.Split(new string[] { "|" }, StringSplitOptions.RemoveEmptyEntries);
                    foreach (String part in queueStr)
                    {
                        int playerId = -1;
                        if (int.TryParse(part, out playerId))
                        {
                            DraftQueue.Add(playerId);
                        }
                    }
                }
            }
        }

        public String QueueToString()
        {
            List<String> list = new List<string>();
            foreach (int playerId in DraftQueue)
            {
                list.Add(playerId.ToString());
            }

            return String.Join("|", list);
        }
    }
}