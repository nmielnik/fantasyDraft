define([
    'jquery',
    'underscore',
    'backbone',
    'text!static/chat.template.html'
], function ($, _, Backbone, template) {
    var ChatView = Backbone.View.extend({

        events: {
            'submit form': 'onSubmit'
        },

        template: _.template(template),

        initialize: function () {
            this.model.on("reset", this.render, this);
            this.model.on("add", this.onAdd, this);
        },

        render: function () {
            this.$el.html(this.template({ data: this.model.toJSON() }));
            return this;
        },

        onAdd: function (model) {
            if (model && model.get("Username") && model.get("Text")) {
                var $chatRow = $('<div/>', { 'class': 'chatRow' });
                var username = model.get("Username");
                var className = "color" + username;
                $chatRow.append($('<span/>', { 'class': 'chatUser ' + className }).html(username + " "));
                $chatRow.append($('<span/>').html(model.get("Text")));

                var $chatroom = this.$('div.chatRoom');
                $chatroom.append($chatRow)
                    .scrollTop($chatroom[0].scrollHeight);
            }
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
                console.log("Chat Fetch Error");
                console.log(response.responseJSON);
            }
        },

        onSubmit: function (evt) {
            evt.preventDefault();
            var $textbox = this.$('input[type=text]');
            this.model.create({ text: $textbox.val() });
            $textbox.val("");
        }
    });

    return ChatView;
});