define([
    'jquery',
    'underscore',
    'backbone',
    'text!static/picks.template.html',
    'Settings',
    'OrderMap',
    'UserMap',
    'PlayerMap'
], function ($, _, Backbone, template, Settings, OrderMap, UserMap, PlayerMap) {

    var PickTypes = { Keeper: 1, OnClock: 2, Pick: 3 };

    var PicksView = Backbone.View.extend({
        template: _.template(template),

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
                window.location.replace("/Draft/login");
            } else {
                console.log("Picks Fetch Error");
                console.log(response.responseJSON);
            }
        },

        render: function () {
            var pickMap = {};
            var lastOnClock = null;
            var self = this;
            this.model.forEach(function (currPick) {
                var pickData = {};
                if (currPick.get("Team") != OrderMap[currPick.get("Pick")]) {
                    pickData.override = { team: UserMap[currPick.get("Team")].Username.toUpperCase() };
                }
                if (currPick.get("Type") == PickTypes.OnClock) {
                    if (pickData.override) {
                        pickData.override.text = ["(" + pickData.override.team + ")"];
                    }
                    pickData.text = ["On The Clock"];
                } else if (currPick.get("Player") && PlayerMap[currPick.get("Player")]) {
                    var player = PlayerMap[currPick.get("Player")];
                    if (pickData.override) {
                        pickData.override.text = ["(" + pickData.override.team + ")"];
                    }
                    pickData.text = [];
                    if (player.Name.length > 16) {
                        var parts = player.Name.split(" ");
                        var str = '';
                        var nextStr = str;
                        for (var i = 0; i < parts.length; i++) {
                            nextStr += (nextStr.length > 0 ? " " : "") + parts[i];
                            if (nextStr.length > 16) {
                                if (str.length > 0) {
                                    pickData.text.push(str);
                                    str = parts[i];
                                    nextStr = str;
                                } else {
                                    pickData.text.push(nextStr);
                                    str = nextStr = '';
                                }
                            } else {
                                str = nextStr;
                            }
                        }
                        if (str.length > 0) {
                            pickData.text.push(str);
                        }
                    } else {
                        pickData.text.push(player.Name)
                    }
                    pickData.text.push(player.TeamInfo);
                } else if (pickData.override) {
                    pickData.override.text = [];
                }

                var position = '';
                if (currPick.get("Player") && PlayerMap[currPick.get("Player")]) {
                    position = ' player-' + PlayerMap[currPick.get("Player")].Position;
                }
                switch (currPick.get("Type")) {
                    case PickTypes.Keeper:
                        pickData.className = "pick-keeper" + position; // draftPickKeeper
                        break;
                    case PickTypes.OnClock:
                        pickData.className = "pick-active"; // draftPickActive
                        lastOnClock = pickData;
                        break;
                    case PickTypes.Pick:
                        pickData.className = "pick-drafted" + position; // draftPick
                        break;
                    default:
                        if (pickData.override) {
                            if (pickData.override.team) {
                                pickData.className = "logo traded " + pickData.override.team.toLowerCase();
                            } else {
                                pickData.className = "pick-override" + position; // draftPickOverride
                            }
                        } else {
                            pickData.className = "pick-empty";
                        }
                        break;
                }

                pickNumber = ((currPick.get("Round") - 1) * Settings.TeamsPerDraft) + currPick.get("Pick");
                if (currPick.get("TimeLeft")) {
                    var timeInfo = self.model.getTimeInfo(currPick.get("TimeLeft"));
                    pickData.text = [timeInfo.minutes + ":" + timeInfo.seconds];
                    pickData.className += " pick-clock";
                }
                pickMap[pickNumber] = pickData;
            });

            var data = {
                settings: Settings,
                pickMap: pickMap
            }
            this.$el.html(this.template(data));

            return this;
        }
    });

    return PicksView;
});