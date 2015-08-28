using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FantasyDraftAPI.Models
{
    public class AdminViewModel
    {
        public AdminViewModel(DraftUser user)
        {
            _UserData = user;
        }

        public DraftUser UserData
        {
            get
            {
                return _UserData;
            }
        }
        private DraftUser _UserData;
    }
}