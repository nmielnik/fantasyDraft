using System;

namespace FantasyDraftAPI.Models
{
    /// <summary>
    /// User authentication data
    /// </summary>
    public class DraftUser
    {
        public String Username { get; set; }
        public String TeamName { get; set; }
        public DateTime Expires { get; set; }
        public int DraftOrder { get; set; }
        public int ID { get; set; }

        public DraftUser()
        {
            Username = null;
            Expires = DateTime.Now.AddHours(6);
            DraftOrder = -1;
            ID = -1;
        }

        public DraftUser(Username dbUsername, int order)
            : this()
        {
            TeamName = dbUsername.TeamName;
            Username = dbUsername.Username1;
            DraftOrder = order;
            ID = dbUsername.User.UserID;
        }
    }
}