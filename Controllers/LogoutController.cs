using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net;
using System.Net.Http;
using FantasyDraftAPI.Services;

namespace FantasyDraftAPI.Controllers
{
    public class LogoutController : Controller
    {
        //
        // GET: /Logout/

        [HttpGet]
        public ActionResult Index()
        {
            DraftAuthentication.Logout(HttpContext.Response);
            return RedirectToAction("Index", "Home");
        }

    }
}
