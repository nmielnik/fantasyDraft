define([
    'jquery',
    'underscore',
    'backbone',
    'text!static/picks.template.html',
    'static/PickView',
    'Settings',
    'OrderMap',
    'UserMap',
    'PlayerMap'
], function ($, _, Backbone, template, PickView, Settings, OrderMap, UserMap, PlayerMap) {

    var PickTypes = { Keeper: 1, OnClock: 2, Pick: 3 };

    var PicksView = Backbone.View.extend({
        template: _.template(template),

        initialize: function () {
            this.model.on("reset", this.onReset, this);
            this.model.on("add", this.onAdd, this);
            this.model.on("remove", this.onRemove, this);
        },

        onReset: function() {
            console.log('PicksView Reset');
            this.render();
        },

        onAdd: function() {
            console.log('PicksView Add');
            if (!this.addCount) {
                this.addCount = 0;
            }
            this.addCount++;
            if (this.addCount == 216) {
                this.render();
            }
        },

        onRemove: function() {
            console.log('PicksView Remove');
            this.render();
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
            this.$el.empty();
            var rounds = {};
            var self = this;
            this.model.forEach(function (currPick) {
                var round = currPick.get("Round");
                if (!rounds[round]) {
                    rounds[round] = $(self.template({ round: round })).appendTo(self.$el);
                }
                var pickView = new PickView({ model: currPick }).render();
                rounds[round].find('> div').last().before(pickView.$el);
            });

            return this;
        }
    });

    return PicksView;
});