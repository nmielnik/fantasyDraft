using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FantasyDraftAPI.Models
{
    public class Converter
    {
        public static DraftMoveType ToDraftMoveType(int intVal)
        {
            DraftMoveType toRet;
            if (!Enum.TryParse(intVal.ToString(), out toRet))
            {
                toRet = DraftMoveType.Invalid;
            }
            return toRet;
        }

        public static DraftStatusType ToDraftStatusType(int intVal)
        {
            DraftStatusType toRet;
            if (!Enum.TryParse(intVal.ToString(), out toRet))
            {
                toRet = DraftStatusType.Invalid;
            }
            return toRet;
        }

        public static DraftActionType ToDraftActionType(int intVal)
        {
            DraftActionType toRet;
            if (!Enum.TryParse(intVal.ToString(), out toRet))
            {
                toRet = DraftActionType.Invalid;
            }
            return toRet;
        }

        public static UserActionType ToUserActionType(int intVal)
        {
            UserActionType toRet;
            if (!Enum.TryParse(intVal.ToString(), out toRet))
            {
                toRet = UserActionType.Unknown;
            }
            return toRet;
        }
    }
}