using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FantasyDraftAPI.Models;
using FantasyDraftAPI.Services;

namespace FantasyDraftAPI.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        [HttpGet]
        public ActionResult Index()
        {
            DraftViewModel model = null;
            try {
                DraftUser user = DraftAuthentication.AuthenticateRequest(HttpContext.Request);
                model = new DraftViewModel(user);
            } catch (DraftAuthenticationException) 
            {
                return RedirectToAction("Index", "Login");
            }

            return View(model);
        }
    }
}
