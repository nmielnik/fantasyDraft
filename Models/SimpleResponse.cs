using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FantasyDraftAPI.Models
{
    /// <summary>
    /// Summary description for SimpleResponse
    /// </summary>
    public class SimpleResponse
    {
        public int Status { get; set; }
        public String Message { get; set; }

        public SimpleResponse()
        {
            Status = 200;
            Message = "";
        }
    }
}