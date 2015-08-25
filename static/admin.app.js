define([
    'jquery',
    'underscore',
    'backbone',
    'static/PauseView'
], function ($, _, Backbone, PauseView) {

    var Pause = Backbone.Model.extend({
        defaults: function () {
            return {
                Status: 1,
                Time: new Date()
            };
        },
        url: 'pause',
        parse: function (data) {
            data.Time = new Date(parseInt(data.Time.substr(6)));
            return data;
        },
        toJSON: function () {
            var json = Backbone.Model.prototype.toJSON.call(this);
            json.Time = json.Time.toUTCString();
            return json;
        }
    });

    var pauseModel = new Pause();

    var pauseView = new PauseView({
        model: pauseModel,
        el: $('#admin-draft-status')
    }).render();

    pauseModel.fetch();
});