using System;

namespace FantasyDraftAPI.Models
{
    public class QuickPick : IComparable<QuickPick>
    {
        public int Round { get; set; }
        public int Pick { get; set; }

        public QuickPick()
        {
            Round = 1;
            Pick = 1;
        }

        public int CompareTo(QuickPick other)
        {
            int result = Round < other.Round ? -1 : (Round > other.Round ? 1 : 0);
            if (result == 0)
                result = Pick < other.Pick ? -1 : (Pick > other.Pick ? 1 : 0);
            return result;
        }

        public override bool Equals(object obj)
        {
            if (!(obj is QuickPick))
                return false;
            return (this.CompareTo((QuickPick)obj) == 0);
        }

        public override int GetHashCode()
        {
            return ToString().GetHashCode();
        }

        public override string ToString()
        {
            return String.Format("{0}.{1}", Round.ToString(), Pick.ToString());
        }
    }
}