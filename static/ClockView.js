define([
    'jquery',
    'underscore',
    'backbone',
    'text!static/clock.template.html',
    'Settings'
], function ($, _, Backbone, template, Settings) {

    var ClockView = Backbone.View.extend({
        template: _.template(template),

        initialize: function () {
            this.model.on("change reset add remove", this.render, this);
        },

        render: function () {
            var onClockPick = this.model.find(function (pick) { return pick.get("TimeLeft") && pick.get("TimeLeft") > 0 });
            this.$el.html(this.template({ settings: Settings, time: this.model.getTimeInfo(onClockPick ? onClockPick.get("TimeLeft") : 0) }));
            return this;
        }
    });

    return ClockView;
});