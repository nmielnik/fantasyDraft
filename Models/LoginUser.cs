using System;

namespace FantasyDraftAPI.Models
{
    public class LoginUser
    {
        public String Username { get; set; }
        public String Password { get; set; }
        public String ErrorMessage { get; set; }
        public String LoginMessage { get; set; }

        public LoginUser()
        {
            Username = String.Empty;
            Password = String.Empty;
            ErrorMessage = String.Empty;
            LoginMessage = String.Empty;
        }
    }
}