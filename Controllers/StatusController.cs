using System.Web.Http;
using FantasyDraftAPI.Models;
using FantasyDraftAPI.Services;

namespace FantasyDraftAPI.Controllers
{
    public class StatusController : ApiController
    {
        private BallersDraftObj dataSource;

        public StatusController()
        {
            this.dataSource = new BallersDraftObj();
        }

        public UserStatusObj Post(UserStatusObj next)
        {
            DraftUser user = DraftAuthentication.AuthenticateRequest(Request);
            
            UserStatusObj toRet = this.dataSource.UpdateStatus(next);

            return toRet;
        }

        public UserStatusObj Get()
        {
            DraftUser user = DraftAuthentication.AuthenticateRequest(Request);
            
            UserStatusObj toRet = dataSource.GetStatus(user.ID);

            return toRet;
        }
    }
}
