using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FantasyDraftAPI.Models
{
    public class DraftMoveObj
    {
        public int SeasonID { get; set; }
        public DateTime Time { get; set; }
        public int Round { get; set; }
        public int Pick { get; set; }
        public int UserID { get; set; }
        public int? PlayerID { get; set; }
        public DraftMoveType Type { get; set; }
        public int TypeInt
        {
            get { return (int)Type; }
            set
            {
                DraftMoveType valType = Converter.ToDraftMoveType(value);
                if (valType != DraftMoveType.Invalid)
                    Type = valType;
            }
        }
        public bool IsNotPicked { get { return (Type == DraftMoveType.Empty || Type == DraftMoveType.OnClock); } }
        public bool IsPicked { get { return (Type == DraftMoveType.Keep || Type == DraftMoveType.Pick); } }
        public bool IsEmpty { get { return Type == DraftMoveType.Empty; } }
        public QuickPick Index { get { return new QuickPick() { Round = Round, Pick = Pick }; } }

        public DraftMoveObj()
        {
            SeasonID = 0;
            Time = new DateTime(0);
            Round = 0;
            Pick = 0;
            UserID = 0;
            PlayerID = null;
            Type = DraftMoveType.Invalid;
        }

        public DraftMoveObj(DraftMove toCopy)
        {
            SeasonID = toCopy.SeasonID;
            Time = toCopy.Time;
            Round = toCopy.Round;
            Pick = toCopy.Pick;
            UserID = toCopy.UserID;
            PlayerID = toCopy.PlayerID;
            TypeInt = toCopy.MoveType;
        }
    }

    public class DraftMoveComparer : IComparer<DraftMove>
    {
        public int Compare(DraftMove one, DraftMove two)
        {
            if (one.Round < two.Round)
                return -1;
            else if (one.Round > two.Round)
                return 1;
            else if (one.Pick < two.Pick)
                return -1;
            else if (one.Pick > two.Pick)
                return 1;
            else if (one.Time < two.Time)
                return -1;
            else if (one.Time > two.Time)
                return 1;
            else
                return 0;
        }
    }

    public class DraftMoveObjComparer : IComparer<DraftMoveObj>
    {
        public int Compare(DraftMoveObj one, DraftMoveObj two)
        {
            if (one.Round < two.Round)
                return -1;
            else if (one.Round > two.Round)
                return 1;
            else if (one.Pick < two.Pick)
                return -1;
            else if (one.Pick > two.Pick)
                return 1;
            else if (one.Time < two.Time)
                return -1;
            else if (one.Time > two.Time)
                return 1;
            else
                return 0;
        }
    }
}