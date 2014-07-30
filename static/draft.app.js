define([
    'jquery',
    'underscore',
    'backbone',
    'text!clock.template.html',
    'text!chat.template.html',
    'text!draftpicks.template.html',
    'text!draftqueue.template.html',
    'Settings',
    'UserMap',
    'OrderMap',
    'CurrentUser',
    'PlayerMap'
], function ($, _, Backbone, clockTemplate, chatTemplate, draftPicksTemplate, draftQueueTemplate, Settings, UserMap, OrderMap, CurrentUser, PlayerMap) {

    var PickTypes = { Keeper: 1, OnClock: 2, Pick: 3 };

    var getTimeInfo = function (total) {
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

    var DraftQueueView = Backbone.View.extend({
        template: _.template(draftQueueTemplate),

        events: {
            'click input[type=button].default': 'onSubmit',
            'keyup input.search': 'onSearch',
            'click a.result': 'onResultClick',
            'click input[type=button].remove': 'onRemove'
        },

        searchCache: [],

        initialize: function() {
            this.model.on('change reset add remove', this.filterQueue, this);
        },

        filterQueue: function() {
            var queuedPlayers = [];
            this.$('select > option').each(function (idx) {
                var $option = $(this);
                queuedPlayers[parseInt($option.prop('value'))] = $option;
            });
            this.$('div.searchResults a').each(function (idx) {
                var $result = $(this);
                var $toRemove = $result.closest('div');
                var playerId = parseInt($result.data('player-id'));
                if (queuedPlayers[playerId])
                    queuedPlayers[playerId] = queuedPlayers[playerId].add($toRemove);
                else
                    queuedPlayers[playerId] = $toRemove;
            });

            this.model.forEach(function (model) {
                var playerId = model.get("Player");
                if (playerId && PlayerMap[playerId]) {
                    if (queuedPlayers[playerId]) {
                        queuedPlayers[playerId].remove();
                        delete queuedPlayers[playerId];
                    }
                    PlayerMap[playerId].Picked = true;
                }
            });
        },

        onSubmit: function (evt) {
            evt.preventDefault();

            var plyrId = this.$('select').val();
            if (plyrId) {
                this.model.create({ Player: parseInt(plyrId) }, { success: $.proxy(this.submitSuccess, this), error: $.proxy(this.submitError, this)});
            } else {
                this.showPickMessage("Add a player to your queue, select them, and then click 'Draft'");
            }
        },

        submitSuccess: function(model, response, options) {
            this.showPickMessage("The player was picked successfully");
        },

        submitError: function (model, response, options) {
            if (response && response.responseJSON) {
                var responseData = response.responseJSON;
                if (responseData.Status == 401) {
                    window.location.replace("../login");
                } else {
                    console.log("Pick Submit Error")
                    console.log(responseData);
                    this.showPickMessage(responseData.Message);
                }
            }
        },

        showPickMessage: function(message) {
            this.$('td.message').html(message);
        },

        onSearch: function (evt) {
            var $results = this.$('div.searchResults');
            var $search = this.$('input.search');
            var text = $search.val().toLowerCase();
            if (text.length > 2 && text !== $search.data('previous')) {
                $search.data('previous', text);
                $results.empty();
                if (!this.searchCache[text]) {
                    var matchedIds = [];
                    _.each(PlayerMap, function (val, key) {
                        if (PlayerMap[key] &&
                            (PlayerMap[key].Name.toLowerCase().indexOf(text) != -1 ||
                             PlayerMap[key].TeamInfo.toLowerCase().indexOf(text) != -1)) {
                            matchedIds.push(key);
                        }
                    });
                    this.searchCache[text] = matchedIds;
                }
                if (this.searchCache[text]) {
                    _.each(this.searchCache[text], function (playerId) {
                        var player = PlayerMap[playerId];
                        if (!player.Picked) {
                            var $link = $('<a/>', { href: '', 'class': 'result' })
                                .html(player.Name + ' - ' + player.TeamInfo)
                                .data('player-id', playerId);
                            $results.append($('<div/>').append($link));
                        }
                    });
                }
            } else if (text !== $search.data('previous')) {
                $results.empty();
            }
        },

        onResultClick: function (evt) {
            evt.preventDefault();
            var playerId = parseInt($(evt.target).data('player-id'));
            var $queue = this.$('select');
            var $option = $queue.find('option[value=' + playerId + ']');
            if ($option.length == 0) {
                $queue.append($('<option/>', { 'value': playerId }).html(PlayerMap[playerId].SearchName));
            }
        },

        onRemove: function(evt) {
            evt.preventDefault();
            var $option = this.$('select').find(':selected');
            if ($option.length > 0) {
                $option.remove();
            }
        },

        render: function () {
            this.$el.html(this.template());
            return this;
        }
    });

    var DraftPick = Backbone.Model.extend({
        idAttribute: "TotalPick"
    });

    var DraftPicks = Backbone.Collection.extend({
        url: 'picks',
        model: DraftPick
    });

    var DraftPicksView = Backbone.View.extend({
        template: _.template(draftPicksTemplate),

        initialize: function () {
            this.model.on("change reset add remove", this.render, this);
        },

        startPolling: function (interval) {
            var self = this;
            setInterval(function () {
                self.model.fetch({ error: $.proxy(self.fetchError, self) });
            }, interval);
            return this;
        },

        fetchError: function (model, response, options) {
            if (response && response.responseJSON && response.responseJSON.Status == 401) {
                window.location.replace("../login");
            } else {
                console.log("Picks Fetch Error");
                console.log(response.responseJSON);
            }
        },

        render: function () {
            var pickMap = {};
            var lastOnClock = null;
            this.model.forEach(function (currPick) {
                var pickData = { className: "draftEmpty" };
                if (currPick.get("Team") != OrderMap[currPick.get("Pick")]) {
                    pickData.override = { team: UserMap[currPick.get("Team")].Name.toUpperCase() };
                }
                if (currPick.get("Type") == PickTypes.OnClock) {
                    if (pickData.override) {
                        pickData.override.text = ["(" + pickData.override.team + ")"];
                    }
                    pickData.text = ["On The Clock"];
                } else if (currPick.get("Player") && PlayerMap[currPick.get("Player")]) {
                    if (pickData.override) {
                        pickData.override.text = ["(" + pickData.override.team + ")"];
                    }
                    pickData.text = [PlayerMap[currPick.get("Player")].Name, PlayerMap[currPick.get("Player")].TeamInfo];
                } else if (pickData.override) {
                    pickData.override.text = ["Traded To:", pickData.override.team];
                }

                switch (currPick.get("Type")) {
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

                pickNumber = ((currPick.get("Round") - 1) * Settings.Teams) + currPick.get("Pick");
                if (currPick.get("TimeLeft")) {
                    var timeInfo = getTimeInfo(currPick.get("TimeLeft"));
                    pickData.text = [timeInfo.minutes + ":" + timeInfo.seconds];
                }
                pickMap[pickNumber] = pickData;
            });

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

    var ClockView = Backbone.View.extend({
        template: _.template(clockTemplate),

        initialize: function () {
            this.model.on("change", this.render, this);
        },

        render: function () {
            var onClockPick = this.model.find(function (pick) { return pick.get("TimeLeft") && pick.get("TimeLeft") > 0 });
            this.$el.html(this.template({ settings: Settings, time: getTimeInfo(onClockPick ? onClockPick.get("TimeLeft") : 0) }));
            return this;
        }
    });

    var Chat = Backbone.Model.extend({
        idAttribute: "Date"
    });

    var Chats = Backbone.Collection.extend({
        url: 'chat',
        model: Chat
    });

    var ChatView = Backbone.View.extend({

        events: {
            'submit form': 'onSubmit'
        },

        template: _.template(chatTemplate),

        initialize: function () {
            this.model.on("reset", this.render, this);
            this.model.on("add", this.onAdd, this);
        },

        render: function () {
            this.$el.html(this.template({ data: this.model.toJSON() }));
            return this;
        },

        onAdd: function (model) {
            if (model && model.get("Username") && model.get("Text")) {
                var $chatRow = $('<div/>', { 'class': 'chatRow' });
                var username = model.get("Username");
                var className = "color" + username;
                $chatRow.append($('<span/>', { 'class': 'chatUser ' + className }).html(username + " "));
                $chatRow.append($('<span/>').html(model.get("Text")));

                var $chatroom = this.$('div.chatRoom');
                $chatroom.append($chatRow)
                    .scrollTop($chatroom[0].scrollHeight);
            }
        },

        startPolling: function(interval) {
            var self = this;
            setInterval(function () {
                self.model.fetch({ error: $.proxy(self.fetchError, self) });
            }, interval);
            return this;
        },

        fetchError: function(model, response, options) {
            if (response && response.responseJSON && response.responseJSON.Status == 401) {
                window.location.replace("../login");
            } else {
                console.log("Chat Fetch Error");
                console.log(response.responseJSON);
            }
        },

        onSubmit: function (evt) {
            evt.preventDefault();
            var $textbox = this.$('input[type=text]');
            this.model.create({ text: $textbox.val() });
            $textbox.val("");
        }
    });

    var picksModel = new DraftPicks();
    var picksView = new DraftPicksView({ model: picksModel, el: $('#draft-board-holder') })
        .render()
        .startPolling(1000);

    var clockView = new ClockView({ model: picksModel, el: $('#ui_tdClockHolder') }).render();

    var queueView = new DraftQueueView({ model: picksModel, el: $('#ui_tdDraftQueue') }).render();

    var chatView = new ChatView({ model:  new Chats(), el: $('#ui_tdChatRoom') })
        .render()
        .startPolling(2000);
});