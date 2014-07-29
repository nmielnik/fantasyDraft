define([
    'jquery',
    'underscore',
    'backbone',
    'text!draftboard.template.html',
    'text!chat.template.html',
    'Settings',
    'UserMap',
    'OrderMap',
    'CurrentUser',
    'PlayerMap'
], function ($, _, Backbone, draftBoardTemplate, chatTemplate, Settings, UserMap, OrderMap, CurrentUser, PlayerMap) {

    var PickTypes = { Keeper: 1, OnClock: 2, Pick: 3 };

    var getTimeInfo = function (total) {
        var minutes = "00";
        var seconds = "00";
        if (total > -1) {
            minutes = Math.floor(total / 60);
            seconds = total - (60 * minutes);

            seconds = (seconds < 10) ? "0" + seconds : seconds + "";
            minutes = minutes + "";
        }
        return {
            total: total,
            minutes: minutes,
            seconds: seconds
        };
    }

    var DraftStatus = Backbone.Model.extend({
        url: "../picks",

        defaults: {
            TimeLeft: -1
        }
    });

    var DraftBoardView = Backbone.View.extend({
        template: _.template(draftBoardTemplate),

        initialize: function () {
            this.model.on("change", this.render, this);
        },

        render: function () {
            var pickMap = {};
            var lastOnClock = null;
            var picks = this.model.get("DraftPicks") || [];
            picks = picks.concat(this.model.get("OnTheClock") || []);
            if (picks && picks.length) {
                for (var i = 0; i < picks.length; i++) {
                    var currPick = picks[i];

                    var pickData = { className: "draftEmpty" };
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
                            lastOnClock = pickData;
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

                    pickNumber = ((currPick.Round - 1) * Settings.Teams) + currPick.Pick;
                    pickMap[pickNumber] = pickData;
                }
            }

            if (lastOnClock) {
                var timeInfo = getTimeInfo(this.model.get("TimeLeft"));
                lastOnClock.text = [timeInfo.minutes + ":" + timeInfo.seconds];
            }

            var data = {
                settings: Settings,
                users: UserMap,
                orders: OrderMap,
                currentUser: CurrentUser,
                activeUsers: this.model.get("ActiveUsers"),
                pickMap: pickMap
            }
            this.$el.html(this.template(data));
            return this;
        }
    });

    var ClockView = Backbone.View.extend({
        initialize: function () {
            this.model.on("change:TimeLeft", this.render, this);
        },

        render: function () {
            var time = getTimeInfo(this.model.get("TimeLeft"));
            this.$el.empty()
                .toggleClass('clockRed', time.total < Settings.ClockWarn)
                .text(time.minutes + ":" + time.seconds);
            return this;
        }
    });

    var ChatLineModel = Backbone.Model.extend({
        idAttribute: "Date"
    });

    var ChatModel = Backbone.Collection.extend({
        url: '../chat',
        model: ChatLineModel
    });

    var ChatView = Backbone.View.extend({

        template: _.template(chatTemplate),

        initialize: function () {
            this.model.on("reset", this.render, this);
            this.model.on("remove", this.render, this );
            this.model.on("add", this.render, this);
            $('#chat-form').on('submit', $.proxy(this.onSubmit, this));
        },

        render: function () {
            this.$el.html(this.template({ data: this.model.toJSON() }));
            this.$el.scrollTop(this.$el[0].scrollHeight);
            console.log("Chat Render");
        },

        onSubmit: function (evt) {
            evt.preventDefault();
            this.model.create({ text: $('#ui_tbChat').val() });
            $('#ui_tbChat').val("");
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
        }
    }

    var model = new DraftStatus();
    var view = new DraftBoardView({ model: model }).render();
    $('#draft-board-holder').empty().append(view.$el);

    var clockView = new ClockView({ model: model, el: $('#ui_tdClock') }).render();

    var chatModel = new ChatModel();
    var chatView = new ChatView({ model: chatModel, el: $('#ui_divChatRoom') }).render();

    model.fetch();
    chatModel.fetch();

    setInterval(function () {
        model.fetch();
        chatModel.fetch();
    }, 2000);
});