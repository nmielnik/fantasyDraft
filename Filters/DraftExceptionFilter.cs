using System;
using System.Net;
using System.Net.Http;
using System.Web.Http.Filters;
using FantasyDraftAPI.Services;

namespace FantasyDraftAPI.Filters
{
    public class DraftExceptionFilter : ExceptionFilterAttribute, IExceptionFilter
    {
        public override void OnException(HttpActionExecutedContext actionExecutedContext)
        {
            if (actionExecutedContext.Exception is DraftAuthenticationException)
            {
                actionExecutedContext.Response = new HttpResponseMessage(HttpStatusCode.Unauthorized)
                {
                    Content = new StringContent("Unauthorized"),
                    ReasonPhrase = "Unauthorized"
                };
            }
            else if (actionExecutedContext.Exception is HttpStatusException)
            {
                HttpStatusException exc = (HttpStatusException)actionExecutedContext.Exception;
                actionExecutedContext.Response = new HttpResponseMessage(exc.Status)
                {
                    Content = new StringContent(exc.Message),
                    ReasonPhrase = exc.Message
                };
            }
            else if (actionExecutedContext.Exception != null)
            {
                Exception exc = actionExecutedContext.Exception;
                actionExecutedContext.Response = new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent(exc.Message),
                    ReasonPhrase = exc.Source + " : " + exc.GetType().ToString() + " : " + exc.Message
                };
            }
        }
    }
}