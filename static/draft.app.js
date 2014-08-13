define([
    'jquery',
    'underscore',
    'backbone',
    'static/DraftPicksView',
    'static/DraftQueueView',
    'static/ChatView',
    'Settings'
], function ($, _, Backbone, DraftPicksView, DraftQueueView, ChatView, Settings) {

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
    var chatsModel = new Chats();

    var picksView = new DraftPicksView({
        model: picksModel,
        el: $('#draft-board-holder'),
        DraftPicks: picksModel,
        Status: statusModel
    }).render();

    var queueView = new DraftQueueView({ model: picksModel, el: $('#draft-queue-holder'), QueueCache: statusModel })
        .render()
        .startPolling(Settings.MSPerStatusRefresh);

    var chatView = new ChatView({ model: chatsModel, el: $('#draft-chat-holder') })
        .render()
        .startPolling(Settings.MSPerChatRefresh);

    chatsModel.fetch();
    statusModel.fetch();
    picksModel.fetch();

    queueView.on('beforeShow', function() {
        $('#draft-queue-button').hide();
    });
    queueView.on('afterHide', function() {
        $('#draft-queue-button').show();
    });

    $('#draft-queue-button').on('click', function(evt) {
        evt.preventDefault();
        queueView.toggleVisibility(true);
    });

    $('body').on('keyup', function(evt) {
        if ((evt.which == 81 || evt.which == 113) && !queueView.isVisible) {
            queueView.toggleVisibility(true);
        } else if (evt.which == 27 && queueView.isVisible) {
            queueView.toggleVisibility(false);
        }
    });

});