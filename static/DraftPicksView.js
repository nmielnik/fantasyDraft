define([
    'jquery',
    'underscore',
    'backbone',
    'text!static/draftpicks.template.html',
    'static/PicksView',
    'static/DraftHeadView',
    'static/ClockView',
    'Settings'
], function ($, _, Backbone, template, PicksView, DraftHeadView, ClockView, Settings) {

    var DraftPicksView = Backbone.View.extend({
        template: _.template(template),

        events: {
            'click a.draft-square.logo': 'onDraftHeadClick'
        },

        initialize: function (options) {
            this.DraftPicks = options.DraftPicks;
            this.Status = options.Status;
            if (options.showTeamInfo) {
                this.showTeamInfo = options.showTeamInfo;
            }
        },

        onDraftHeadClick: function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (this.showTeamInfo) {
                this.showTeamInfo($(event.currentTarget).attr('data-user-id'));
            }
        },

        render: function () {
            this.$el.html(this.template({}));

            var picksView = new PicksView({ model: this.DraftPicks, el: this.$('.draft-picks') })
                .render()
                .startPolling(Settings.MSPerRefresh);

            var headView = new DraftHeadView({ model: this.Status, el: this.$('.team-column.first') }).render();

            var footView = new DraftHeadView({ model: this.Status, el: this.$('.team-column.last') }).render();

            var clockView = new ClockView({ model: this.DraftPicks, el: this.$('.clock-holder') }).render();

            return this;
        }
    });

    return DraftPicksView;
});