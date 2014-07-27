define([
    'jquery',
    'underscore',
    'backbone',
    'text!draftboard.template.html',
    'Settings',
    'UserMap',
    'OrderMap',
    'CurrentUser',
    'PlayerMap'
], function ($, _, Backbone, draftBoardTemplate, Settings, UserMap, OrderMap, CurrentUser, PlayerMap) {

    var PickTypes = { Keeper: 1, OnClock: 2, Pick: 3 };

    var DraftBoardView = Backbone.View.extend({
        template: _.template(draftBoardTemplate),

        render: function (picks) {
            var pickMap = {};
            var pickData = null;
            if (picks && picks.length) {
                for (var i = 0; i < picks.length; i++) {
                    var currPick = picks[i];

                    pickData = { className: "draftEmpty" };
                    if (currPick.Team != OrderMap[currPick.Pick]) {
                        pickData.override = { team: UserMap[currPick.Team].Name.toUpperCase() };
                    }
                    if (currPick.Type == PickTypes.OnClock) {
                        if (pickData.override) {
                            pickData.override.text = ["(" + pickData.override.team + ")"];
                        }
                        pickData.text = ["On The Clock"];
                    } else if (currPick.Player && PlayerMap[currPick.Player]) {
                        if (pickData.override) {
                            pickData.override.text = ["(" + pickData.override.team + ")"];
                        }
                        pickData.text = [PlayerMap[currPick.Player].Name, PlayerMap[currPick.Player].TeamInfo];
                        PlayerMap[currPick.Player].Picked = true;
                        // TODO: removeFromQueue(oPick.Player);
                    } else if (pickData.override) {
                        pickData.override.text = ["Traded To:", pickData.override.team];
                    }

                    switch (currPick.Type) {
                        case PickTypes.Keeper:
                            pickData.className = "draftPickKeeper";
                            break;
                        case PickTypes.OnClock:
                            pickData.className = "draftPickActive";
                            break;
                        case PickTypes.Pick:
                            pickData.className = "draftPick";
                            break;
                        default:
                            if (pickData.override) {
                                pickData.className = "draftPickOverride";
                            }
                            break;
                    }

                    pickMap[i + 1] = pickData;
                }
            }

            var data = {
                settings: Settings,
                users: UserMap,
                orders: OrderMap,
                currentUser: CurrentUser,
                pickMap: pickMap
            }
            this.$el.html(this.template(data));
            return this;
        }
    });

    var updateClock = function (timeLeft) {
        var $clock = $('#ui_tdClock');
        $clock.data('amount', timeLeft);
        if (timeLeft > -1) {
            var minutes = Math.floor(timeLeft / 60);
            var seconds = timeLeft - (60 * minutes);
            $clock.toggleClass('clockRed', timeLeft < Settings.ClockWarn)
                .empty()
                .text(minutes + ":" + (seconds < 10 ? "0" : "") + seconds);

            /*if (sHeadText) {
                elClock.appendChild(CTXT(sHeadText));
                elClock.appendChild(CE('br'));
            }*/
        }
    }

    // PickTypes = { Keeper: 1, OnClock: 2, Pick: 3 }
    // updateDraftPicksUI(oData.DraftPicks, g_oDraftGrid, PlayerMap, ['draftCell draftEmpty', 'draftCell draftPickKeeper', 'draftCell draftPickActive', 'draftCell draftPick']);

    var view = new DraftBoardView().render();
    $('#draft-board-holder').empty().append(view.$el);

    $.ajax({ url: 'Status.aspx', dataType: 'json' }).then(function updateSuccess(data) {
        updateClock(data.TimeLeft);
        view.render(data.DraftPicks);
    }, function updateFailure(data) {
        debugger;
    });
});