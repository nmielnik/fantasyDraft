define([
    'jquery',
    'underscore',
    'backbone',
    'text!static/clock.template.html',
    'Settings'
], function ($, _, Backbone, template, Settings) {

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

    var ClockView = Backbone.View.extend({
        template: _.template(template),

        initialize: function () {
            this.model.on("change", this.render, this);
        },

        render: function () {
            var onClockPick = this.model.find(function (pick) { return pick.get("TimeLeft") && pick.get("TimeLeft") > 0 });
            this.$el.html(this.template({ settings: Settings, time: getTimeInfo(onClockPick ? onClockPick.get("TimeLeft") : 0) }));
            return this;
        }
    });

    return ClockView;
});