using System.Web;
using System.Web.Mvc;
using System.Web.Http.Filters;

namespace FantasyDraftAPI
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }

        public static void RegisterHttpFilters(HttpFilterCollection filters)
        {
            filters.Add(new FantasyDraftAPI.Filters.DraftExceptionFilter());
        }
    }
}