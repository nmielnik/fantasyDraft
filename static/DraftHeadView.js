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
                statusMap[activeUsers[0]] = true;
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
        },

        startPolling: function (interval) {
            var self = this;
            setInterval(function () {
                self.model.fetch({ error: $.proxy(self.fetchError, self) });
            }, interval);
            return this;
        },

        fetchError: function (model, response, options) {
            if (response && response.responseJSON && response.responseJSON.Status == 401) {
                window.location.replace("/Draft/login");
            } else {
                console.log("Status Fetch Error");
                console.log(response.responseJSON);
            }
        }
    });

    return DraftHeadView;
});