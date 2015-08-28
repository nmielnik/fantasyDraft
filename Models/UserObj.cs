using System;

namespace FantasyDraftAPI.Models
{
    public class UserObj
    {
        public int UserID { get; set; }
        public String Username { get; set; }
        public String Password { get; private set; }
        public String TeamName { get; set; }
        public int Order { get; set; }

        public UserObj()
        {
            UserID = 0;
            Username = "Invalid User";
            TeamName = "Invalid Team";
            Order = 0;
            Password = "No Password";
        }

        public UserObj(User usr, int order)
        {
            UserID = usr.UserID;
            Order = order;
            if (usr.Usernames.Count > 0)
            {
                Username = usr.Usernames[0].Username1;
                TeamName = usr.Usernames[0].TeamName;
                Password = usr.Password;
            }
            else
            {
                Username = String.Empty;
                TeamName = String.Empty;
            }
        }
    }
}