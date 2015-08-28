using System;
using System.Net;

namespace FantasyDraftAPI.Services
{
    public class HttpStatusException : Exception
    {
        public HttpStatusCode Status { get; set; }

        public HttpStatusException(HttpStatusCode status, String message) : this(status, message, null) { }

        public HttpStatusException(HttpStatusCode status, String message, Exception innerException)
            : base(message, innerException)
        {
            Status = status;
        }
    }
}