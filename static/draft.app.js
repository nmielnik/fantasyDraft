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
        url: 'api/picks',
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
        url: 'api/chat',
        model: Backbone.Model.extend({
            idAttribute: "Date"
        })
    });

    var Status = Backbone.Model.extend({
        url: 'api/status'
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

    $('#draft-buttons-holder').prop('on', true);

    function beforeShow() {
        $('#draft-buttons-holder').hide().prop('on', false);
    }

    function afterHide() {
        $('#draft-buttons-holder').show().prop('on', true);
    }

    queueView.on('beforeShow', beforeShow);
    chatView.on('beforeShow', beforeShow);
    queueView.on('afterHide', afterHide);
    chatView.on('afterHide', afterHide);

    $('#draft-queue-button').on('click', function(evt) {
        evt.preventDefault();
        queueView.toggleVisibility(true);
    });

    $('#draft-chat-button').on('click', function(evt) {
        evt.preventDefault();
        chatView.toggleVisibility(true);
    });

    $('body').on('keyup', function(evt) {
        if ($('#draft-buttons-holder').prop('on')) {
            if (evt.which == 81 || evt.which == 113) {
                queueView.toggleVisibility(true);
            } else if (evt.which == 67 || evt.which == 99) {
                chatView.toggleVisibility(true);
            }
        } else if (evt.which == 27) {
            queueView.toggleVisibility(false);
            chatView.toggleVisibility(false);
        }
    });

});