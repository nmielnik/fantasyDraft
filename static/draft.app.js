define([
    'jquery',
    'underscore',
    'backbone',
    'static/DraftPicksView',
    'static/DraftQueueView',
    'static/ClockView',
    'static/ChatView',
    'Settings'
], function ($, _, Backbone, DraftPicksView, DraftQueueView, ClockView, ChatView, Settings) {

    var DraftPicks = Backbone.Collection.extend({
        url: 'picks',
        model: Backbone.Model.extend({
            idAttribute: "TotalPick"
        }),

        getTimeInfo: function (total) {
            var minutes = "00";
            var seconds = "00";
            if (total && total > -1) {
                minutes = Math.floor(total / 60);
                seconds = total - (60 * minutes);

                seconds = (seconds < 10) ? "0" + seconds : seconds + "";
                minutes = minutes + "";
            }
            return {
                total: total || 0,
                minutes: minutes,
                seconds: seconds
            };
        }
    });

    var Chats = Backbone.Collection.extend({
        url: 'chat',
        model: Backbone.Model.extend({
            idAttribute: "Date"
        })
    });

    var Status = Backbone.Model.extend({
        url: 'status'
    });

    var statusModel = new Status();
    var picksModel = new DraftPicks();

    var picksView = new DraftPicksView({
        model: picksModel,
        el: $('#draft-board-holder'),
        DraftPicks: picksModel,
        Status: statusModel
    }).render();

    var clockView = new ClockView({ model: picksModel, el: $('#ui_tdClockHolder') }).render();

    var queueView = new DraftQueueView({ model: picksModel, el: $('#ui_tdDraftQueue'), QueueCache: statusModel })
        .render()
        .startPolling(Settings.MSPerStatusRefresh);

    var chatView = new ChatView({ model: new Chats(), el: $('#ui_tdChatRoom') })
        .render()
        .startPolling(Settings.MSPerChatRefresh);

    statusModel.fetch();
    picksModel.fetch();
});