using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Http;
using FantasyDraftAPI.Models;
using FantasyDraftAPI.Services;

namespace FantasyDraftAPI.Controllers
{
    public class PauseController : ApiController
    {
        private BallersDraftObj dataSource;

        public PauseController()
        {
            this.dataSource = new BallersDraftObj();
        }

        public DraftStatusObj Get()
        {
            DraftUser user = DraftAuthentication.AuthenticateRequest(Request, 1);

            DraftStatusObj status = this.dataSource.GetDraftStatusObj();

            return status;
        }

        public DraftStatusObj Post(DraftStatusObj newStatus)
        {
            DraftUser user = DraftAuthentication.AuthenticateRequest(Request, 1);

            return this.dataSource.SetNextDraftStatusObj(newStatus);
        }
    }
}
