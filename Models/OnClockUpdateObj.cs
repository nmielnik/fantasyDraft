using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FantasyDraftAPI.Models
{
    public class OnClockUpdateObj
    {
        public int SecondsLeft { get; set; }

        public OnClockUpdateObj()
        {
            SecondsLeft = 0;
        }
    }
}