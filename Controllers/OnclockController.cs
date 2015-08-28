using System.Collections.Generic;
using System.Net;
using System.Web.Http;
using FantasyDraftAPI.Models;
using FantasyDraftAPI.Services;

namespace FantasyDraftAPI.Controllers
{
    public class OnclockController : ApiController
    {
        private BallersDraftObj dataSource;

        public OnclockController()
        {
            dataSource = new BallersDraftObj();
        }

        public List<DraftMoveObj> Get()
        {
            DraftUser user = DraftAuthentication.AuthenticateRequest(Request, 1);

            List<DraftMoveObj> onClock = dataSource.FindOnTheClock();

            return onClock;
        }

        public DraftMoveObj Delete()
        {
            DraftUser user = DraftAuthentication.AuthenticateRequest(Request, 1);

            DraftMoveObj toRet = dataSource.RemoveLastOnTheClock();

            if (toRet == null)
            {
                throw new HttpStatusException(HttpStatusCode.NotFound, "Unable to find pick to delete");
            }

            return toRet;
        }

        public DraftMoveObj Put(OnClockUpdateObj update)
        {
            DraftUser user = DraftAuthentication.AuthenticateRequest(Request, 1);

            DraftMoveObj toRet = dataSource.UpdateLastOnTheClock(update);

            if (toRet == null)
            {
                throw new HttpStatusException(HttpStatusCode.NotFound, "Unable to find pick to update");
            }

            return toRet;
        }
    }
}
