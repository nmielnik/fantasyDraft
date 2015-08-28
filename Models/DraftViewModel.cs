using System;
using System.Collections.Generic;
using FantasyDraftAPI.Services;

namespace FantasyDraftAPI.Models
{
    public class DraftViewModel
    {
        public DraftViewModel(DraftUser user)
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

        protected BallersDraftObj DraftObj
        {
            get
            {
                if (_DraftObj == null)
                    _DraftObj = new BallersDraftObj();
                return _DraftObj;
            }
        }
        private BallersDraftObj _DraftObj;

        public DraftSettings Settings
        {
            get
            {
                return BallersDraftObj.Settings;
            }
        }

        public Dictionary<String, PlayerObj> PlayerMap
        {
            get
            {
                if (_PlayerMap == null)
                {
                    _PlayerMap = DraftObj.GetPlayerMap();
                }
                return _PlayerMap;
            }
        }
        private Dictionary<String, PlayerObj> _PlayerMap = null;

        public Dictionary<String, UserObj> UserMap
        {
            get
            {
                if (_UserMap == null)
                {
                    _UserMap = new Dictionary<String, UserObj>();
                    foreach (UserObj next in AllUsers)
                    {
                        _UserMap[next.UserID.ToString()] = next;
                    }
                }
                return _UserMap;
            }
        }
        private Dictionary<String, UserObj> _UserMap = null;

        public Dictionary<String, int> OrderMap
        {
            get
            {
                if (_OrderMap == null)
                {
                    _OrderMap = new Dictionary<String, int>();
                    foreach (UserObj nextUser in AllUsers)
                    {
                        _OrderMap[nextUser.Order.ToString()] = nextUser.UserID;
                    }
                }
                return _OrderMap;
            }
        }
        private Dictionary<String, int> _OrderMap;

        public List<UserObj> AllUsers
        {
            get
            {
                if (_AllUsers == null)
                    _AllUsers = DraftObj.QueryUsers();
                return _AllUsers;
            }
        }
        private List<UserObj> _AllUsers;
    }
}