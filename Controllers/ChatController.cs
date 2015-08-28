using System;
using System.Collections.Generic;
using System.Web.Http;
using FantasyDraftAPI.Models;
using FantasyDraftAPI.Services;

namespace FantasyDraftAPI.Controllers
{
    public class ChatController : ApiController
    {
        private BallersDraftObj dataSource;

        public ChatController()
        {
            this.dataSource = new BallersDraftObj();
        }

        public List<ChatObj> Get()
        {
            DraftUser user = DraftAuthentication.AuthenticateRequest(Request);

            List<ChatObj> chatData = this.dataSource.GetChatData();

            return chatData;
        }

        public List<ChatObj> Post(ChatObj next)
        {
            DraftUser user = DraftAuthentication.AuthenticateRequest(Request);

            String text = next.Text;
            if (!String.IsNullOrWhiteSpace(text))
            {
                this.dataSource.SubmitChat(new ChatObj()
                {
                    Text = text.Trim(),
                    UserID = user.ID,
                    Date = DateTime.Now
                });
            }

            List<ChatObj> chatData = this.dataSource.GetChatData();

            return chatData;
        }
    }
}
