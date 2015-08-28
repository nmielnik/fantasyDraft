define([
    'jquery',
    'underscore',
    'backbone',
    'static/AdminPauseView',
    'static/AdminOnClockView'
], function ($, _, Backbone, AdminPauseView, AdminOnClockView) {

    var Pause = Backbone.Model.extend({
        defaults: function () {
            return {
                Status: 1,
                Time: new Date()
            };
        },
        url: 'api/pause',
        parse: function (data) {
            data.Time = new Date(data.Time);
            return data;
        },
        toJSON: function () {
            var json = Backbone.Model.prototype.toJSON.call(this);
            json.Time = json.Time.toUTCString();
            return json;
        }
    });

    var pauseModel = new Pause();

    var pauseView = new AdminPauseView({
        model: pauseModel,
        el: $('#admin-draft-status')
    }).render();

    pauseModel.fetch();

    var onClockView = new AdminOnClockView({
        el: $('#admin-onclock')
    }).render();
});