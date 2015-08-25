define([
	'jquery',
	'underscore',
	'backbone',
	'text!static/pause.template.html'
], function ($, _, Backbone, template) {

    var PauseView = Backbone.View.extend({

        template: _.template(template),

        events: {
            'click input[type=button].pause': 'onPause',
            'click input[type=button].start': 'onStart'
        },

        initialize: function () {
            this.model.bind('change', this.render, this);
        },

        render: function () {
            var status = {
                status: this.model.get("Status"),
                time: this.model.get("Time"),
                statusText: this.model.get("Status") === 2 ? 'paused' : 'started'
            };
            this.$el.html(this.template({ status: status }));
        },

        onPause: function (evt) {
            this.model.save({ "Status": 2 }, {
                success: $.proxy(this.onSave, this),
                error: $.proxy(this.onSave, this)
            });
        },

        onStart: function (evt) {
            this.model.save({ "Status": 1 }, {
                success: $.proxy(this.onSave, this),
                error: $.proxy(this.onSave, this)
            });
        },

        onSave: function (data) {
            setTimeout(function () {
                this.model.fetch();
            }.bind(this), 1000);
        }
    });

    return PauseView;
});