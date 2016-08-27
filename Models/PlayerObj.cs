using System;
using System.Text;

namespace FantasyDraftAPI.Models
{
    public class PlayerObj
    {
        public int PlayerID { get; set; }
        public String FirstName { get; set; }
        public String LastName { get; set; }
        public String Suffix { get; set; }
        public String Identity { get; set; }
        public String Team { get; set; }
        public String Position { get; set; }
        public bool Picked { get; set; }

        public String Name
        {
            get
            {
                StringBuilder sb = new StringBuilder();
                sb.AppendFormat("{0} {1}", FirstName, LastName);
                if (!String.IsNullOrEmpty(Suffix))
                    sb.AppendFormat(" ({0})", Suffix);
                if (!String.IsNullOrEmpty(Identity))
                    sb.AppendFormat(" [{0}]", Identity);
                return sb.ToString();
            }
        }

        public String SearchName
        {
            get
            {
                return String.Format("{0} - {1}", Name, TeamInfo);
            }
        }

        public String TeamInfo
        {
            get
            {
                return String.Format("{0} ({1})", Position, Team);
            }
        }

        public PlayerObj()
        {
            Picked = false;
        }

        public PlayerObj(Player toCopy) : this()
        {
            PlayerID = toCopy.PlayerID;
            FirstName = toCopy.FirstName;
            LastName = toCopy.LastName;
            Suffix = toCopy.Suffix;
            Identity = toCopy.Identifier;
            Team = toCopy.Team;
            Position = toCopy.Position;
        }
    }
}