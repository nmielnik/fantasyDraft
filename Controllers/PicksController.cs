using System;
using System.Collections.Generic;
using System.Net;
using System.Web.Http;
using FantasyDraftAPI.Models;
using FantasyDraftAPI.Services;

namespace FantasyDraftAPI.Controllers
{
    public class PicksController : ApiController
    {
        private BallersDraftObj dataSource;

        public PicksController()
        {
            this.dataSource = new BallersDraftObj();
        }

        public List<DraftPickStatusObj> Post(DraftPickStatusObj next)
        {
            DraftUser user = DraftAuthentication.AuthenticateRequest(Request);

            if (!next.Player.HasValue)
            {
                throw new HttpStatusException(HttpStatusCode.NotFound, "The player you entered is invalid or does not exists");
            }
            else
            {
                PickResult result = dataSource.SubmitPick(user.ID, next.Player.Value);
                if (result != PickResult.Success)
                {
                    switch (result)
                    {
                        case PickResult.AlreadyPicked:
                            throw new HttpStatusException(HttpStatusCode.MethodNotAllowed, "That player has already been chosen");
                        case PickResult.InvalidPlayer:
                            throw new HttpStatusException(HttpStatusCode.NotFound, "The player you entered is invalid or does not exist");
                        case PickResult.NotTurn:
                            throw new HttpStatusException(HttpStatusCode.Forbidden, "It's not your turn to pick");
                    }
                }
            }

            return GetDraftPicks();
        }

        public List<DraftPickStatusObj> Get()
        {
            return GetDraftPicks();
        }

        private List<DraftPickStatusObj> GetDraftPicks()
        {
            DraftUser user = DraftAuthentication.AuthenticateRequest(Request);

            List<DraftPickStatusObj> toRet = new List<DraftPickStatusObj>();

            List<DraftMoveObj> onTheClock = new List<DraftMoveObj>();
            Dictionary<QuickPick, DraftMoveObj> draftData = dataSource.QueryDraftData(out onTheClock);
            DraftPickStatusObj onClockPick = null;
            DraftMoveObj lastOnClockMoveObj = null;

            for (QuickPick index = new QuickPick(); index.Round <= BallersDraftObj.Settings.RoundsPerDraft; index.Round++)
            {
                for (index.Pick = 1; index.Pick <= BallersDraftObj.Settings.TeamsPerDraft; index.Pick++)
                {
                    DraftMoveObj nextMove = draftData[index];
                    toRet.Add(new DraftPickStatusObj(BallersDraftObj.Settings.TeamsPerDraft)
                    {
                        Round = nextMove.Round,
                        Pick = nextMove.Pick,
                        Team = nextMove.UserID,
                        Player = nextMove.PlayerID,
                        Type = nextMove.TypeInt
                    });
                }
            }
            foreach (DraftMoveObj currMove in onTheClock)
            {
                lastOnClockMoveObj = currMove;
                onClockPick = new DraftPickStatusObj(BallersDraftObj.Settings.TeamsPerDraft)
                {
                    Round = currMove.Round,
                    Pick = currMove.Pick,
                    Team = currMove.UserID,
                    Type = currMove.TypeInt
                };
                toRet[onClockPick.TotalPick - 1] = onClockPick;
            }

            if (lastOnClockMoveObj != null)
            {
                TimeSpan timeLeft = TimeSpan.FromSeconds(BallersDraftObj.Settings.SecondsPerPick) - (DateTime.Now - lastOnClockMoveObj.Time);
                if (timeLeft < TimeSpan.FromTicks(0))
                    timeLeft = TimeSpan.FromTicks(0);
                onClockPick.TimeLeft = (int)timeLeft.TotalSeconds;
            }

            return toRet;
        }
    }
}
