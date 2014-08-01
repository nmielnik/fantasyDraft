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
        })
    });

    var Chats = Backbone.Collection.extend({
        url: 'chat',
        model: Backbone.Model.extend({
            idAttribute: "Date"
        })
    });

    var picksModel = new DraftPicks();
    var picksView = new DraftPicksView({ model: picksModel, el: $('#draft-board-holder') })
        .render()
        .startPolling(Settings.MSPerRefresh);

    var clockView = new ClockView({ model: picksModel, el: $('#ui_tdClockHolder') }).render();

    var queueView = new DraftQueueView({ model: picksModel, el: $('#ui_tdDraftQueue') }).render();

    var chatView = new ChatView({ model: new Chats(), el: $('#ui_tdChatRoom') })
        .render()
        .startPolling(Settings.MSPerChatRefresh);
});