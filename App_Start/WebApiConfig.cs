using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace FantasyDraftAPI
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.Filters.Add(new FantasyDraftAPI.Filters.DraftExceptionFilter());

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
