using System.Web;
using System.Web.Mvc;
using FantasyDraftAPI.Services;

namespace FantasyDraftAPI.Controllers
{
    public class LogoutController : Controller
    {
        [HttpGet]
        public ActionResult Index()
        {
            DraftAuthentication.Logout(HttpContext.Response);
            return RedirectToAction("Index", "Home");
        }

    }
}
