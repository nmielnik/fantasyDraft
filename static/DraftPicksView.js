define([
    'jquery',
    'underscore',
    'backbone',
    'text!static/draftpicks.template.html',
    'static/PicksView',
    'static/DraftHeadView',
    'Settings'
], function ($, _, Backbone, template, PicksView, DraftHeadView, Settings) {

    var DraftPicksView = Backbone.View.extend({
        template: _.template(template),

        initialize: function (options) {
            this.DraftPicks = options.DraftPicks;
            this.Status = options.Status;
        },

        render: function () {
            this.$el.html(this.template({}));

            var picksView = new PicksView({ model: this.DraftPicks, el: this.$('.draft-picks') })
                .render()
                .startPolling(Settings.MSPerRefresh);

            var headView = new DraftHeadView({ model: this.Status, el: this.$('.team-column.first') }).render();

            var footView = new DraftHeadView({ model: this.Status, el: this.$('.team-column.last') }).render();

            return this;
        }
    });

    return DraftPicksView;
});