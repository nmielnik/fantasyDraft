define([
	'jquery',
	'underscore',
	'backbone',
	'text!static/adminonclock.template.html'
], function ($, _, Backbone, template) {

    var AdminOnClockView = Backbone.View.extend({

        template: _.template(template),

        events: {
            'click input[type=button].delete': 'onDelete',
            'click input[type=button].update': 'onUpdate'
        },

        initialize: function () {
            
        },

        render: function () {
            this.$el.html(this.template({}));
        },

        onUpdate: function (evt) {
            var seconds = parseInt(this.$('input[type=text].seconds').val());
            if (!isNaN(seconds) && seconds > -1) {
                $.ajax({
                    url: 'api/onclock',
                    type: 'PUT',
                    dataType: 'json',
                    data: {
                        SecondsLeft: seconds
                    },
                    success: function (data) {
                        var update = new Date(data.Time);
                        var secondsAgo = (Date.now() - update.getTime()) / 1000;
                        $('#admin-last-update-status')
                            .removeClass('error')
                            .addClass('success')
                            .html('Updated pick: Round ' + data.Round + ' Pick ' + data.Pick + ' to start ' + secondsAgo + ' seconds ago');
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        $('#admin-last-update-status')
                            .removeClass('success')
                            .addClass('error')
                            .html('<span class="info">' + textStatus.toUpperCase() + ' (' + xhr.status + '): </span>' + errorThrown);
                    }
                });
            }
        },

        onDelete: function (evt) {
            $.ajax({
                url: 'api/onclock',
                type: 'DELETE',
                dataType: 'json',
                success: function (data) {
                    $('#admin-last-delete-status')
                        .removeClass('error')
                        .addClass('success')
                        .html('Removed pick: Round ' + data.Round + ' Pick ' + data.Pick);
                    // data: {"SeasonID":9,"Time":"2015-08-26T23:07:35.823","Round":1,"Pick":2,"UserID":8,"PlayerID":null,"Type":2,"TypeInt":2,"IsNotPicked":true,"IsPicked":false,"IsEmpty":false,"Index":{"Round":1,"Pick":2}}
                },
                error: function (xhr, textStatus, errorThrown) {
                    $('#admin-last-delete-status')
                        .removeClass('success')
                        .addClass('error')
                        .html('<span class="info">' + textStatus.toUpperCase() + ' (' + xhr.status + '): </span>' + errorThrown);
                }
            });
        }
    });

    return AdminOnClockView;
});