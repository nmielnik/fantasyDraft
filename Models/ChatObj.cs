using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FantasyDraftAPI.Models
{
    public class ChatObj
    {
        public DateTime Date { get; set; }
        public int UserID { get; set; }
        public String Username
        {
            get
            {
                return _Username;
            }
            set
            {
                return;
            }
        }
        private String _Username;
        public String Text
        {
            get
            {
                return _Text;
            }
            set
            {
                _Text = HttpUtility.HtmlEncode(value);
            }
        }
        private String _Text;

        public ChatObj()
        {
            _Text = null;
            _Username = String.Empty;
            Date = DateTime.Now;
            UserID = 0;
        }

        public ChatObj(String text)
            : this()
        {
            _Text = text;
        }

        public ChatObj(ChatRoom line)
            : this(line.Text)
        {
            Date = line.Date;
            UserID = line.UserID;
            if (line.User.Usernames.Count > 0)
                _Username = line.User.Usernames[0].Username1;
        }
    }
}