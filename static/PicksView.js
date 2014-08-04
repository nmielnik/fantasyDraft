define([
    'jquery',
    'underscore',
    'backbone',
    'text!static/picks.template.html',
    'Settings',
    'OrderMap',
    'UserMap'
], function ($, _, Backbone, template, Settings, OrderMap, UserMap) {

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
                var pickData = { className: "draftEmpty" };
                if (currPick.get("Team") != OrderMap[currPick.get("Pick")]) {
                    pickData.override = { team: UserMap[currPick.get("Team")].Username.toUpperCase() };
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

                pickNumber = ((currPick.get("Round") - 1) * Settings.TeamsPerDraft) + currPick.get("Pick");
                if (currPick.get("TimeLeft")) {
                    var timeInfo = self.model.getTimeInfo(currPick.get("TimeLeft"));
                    pickData.text = [timeInfo.minutes + ":" + timeInfo.seconds];
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