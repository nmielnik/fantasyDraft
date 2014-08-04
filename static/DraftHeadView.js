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

        initialize: function() {
            this.model.on('change:ActiveUsers', this.render, this);
        },

        render: function () {

            var statusMap = {};
            var activeUsers = this.model.get('ActiveUsers');
            for (var i = 0; activeUsers && i < activeUsers.length; i++) {
                statusMap[activeUsers[i]] = true;
            }

            var data = {
                settings: Settings,
                users: UserMap,
                orders: OrderMap,
                currentUser: CurrentUser,
                activeUsers: statusMap
            }
            this.$el.html(this.template(data));
            return this;
        }
    });

    return DraftHeadView;
});