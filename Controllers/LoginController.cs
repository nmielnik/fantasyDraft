using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FantasyDraftAPI.Models;
using FantasyDraftAPI.Services;

namespace FantasyDraftAPI.Controllers
{
    public class LoginController : Controller
    {
        //
        // GET: /Login/

        [HttpGet]
        public ActionResult Index()
        {
            try
            {
                DraftUser user = DraftAuthentication.AuthenticateRequest(HttpContext.Request);
                return RedirectToAction("Index", "Home");
            }
            catch (DraftAuthenticationException)
            {
                return View(new LoginUser());
            }
        }

        [HttpPost]
        public ActionResult Index(LoginUser loginUser)
        {
            try
            {
                DraftUser user = DraftAuthentication.AuthenticateCredentials(loginUser.Username, loginUser.Password, HttpContext.Response);
                return RedirectToAction("Index", "Home");
            }
            catch (DraftAuthenticationException exc)
            {
                LoginUser retry = new LoginUser() { Username = loginUser.Username };

                if (!String.IsNullOrWhiteSpace(exc.Username))
                {
                    retry.LoginMessage = exc.Username + " " + exc.Message + " " + exc.Expired.ToLongDateString() + " @ " + exc.Expired.ToLongTimeString();
                }
                else
                {
                    retry.LoginMessage = exc.Message;
                }
                retry.ErrorMessage = exc.Message;
                return View(retry);
            }
        }

    }
}
