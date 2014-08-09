define([
    'jquery',
    'underscore',
    'backbone',
    'text!static/drafthead.template.html',
    'Settings',
    'UserMap',
    'OrderMap',
    'CurrentUser'
], function ($, _, Backbone, template, Settings, UserMap, OrderMap, CurrentUser) {

    var DraftHeadView = Backbone.View.extend({
        template: _.template(template),

        initialize: function () {
            this.model.on('change:ActiveUsers', this.update, this);
        },

        update: function () {
            var activeUsers = this.getStatusMap();
            this.$('.draft-square.logo').each(function (idx) {
                var $el = $(this).removeClass('current').removeClass('online');
                var userId = parseInt($el.data('user-id'), 10);
                if (userId == CurrentUser.ID) {
                    $el.addClass('current');
                } else if (activeUsers[userId]) {
                    $el.addClass('online');
                }
            });
        },

        getStatusMap: function () {
            var statusMap = {};
            var activeUsers = this.model.get('ActiveUsers');
            for (var i = 0; activeUsers && i < activeUsers.length; i++) {
                statusMap[activeUsers[i]] = true;
            }
            return statusMap;
        },

        render: function () {
            var data = {
                settings: Settings,
                users: UserMap,
                orders: OrderMap,
                currentUser: CurrentUser,
                activeUsers: this.getStatusMap()
            }
            this.$el.html(this.template(data));

            return this;
        }
    });

    return DraftHeadView;
});