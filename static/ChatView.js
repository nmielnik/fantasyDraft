define([
    'jquery',
    'underscore',
    'backbone',
    'text!static/chat.template.html',
    'text!static/chatrow.template.html',
    'CurrentUser'
], function ($, _, Backbone, template, chatrowTemplate, CurrentUser) {
    var ChatView = Backbone.View.extend({

        events: {
            'submit form': 'onSubmit',
            'click #close-chat-button': 'onClose'
        },

        template: _.template(template),
        rowtemplate: _.template(chatrowTemplate),

        polling: false,
        isVisible: false,

        initialize: function () {
            this.model.on("reset", this.render, this);
            this.model.on("add", this.onAdd, this);
        },

        toggleVisibility: function(show) {
            if (show != this.isVisible) {
                if (show) {
                    this.trigger('beforeShow');
                    this.$el.removeClass('hidden');
                } else {
                    this.$el.addClass('hidden');
                    setTimeout(_.bind(function() {
                        this.trigger('afterHide');
                    }, this), 250);
                }
                this.isVisible = show;
            }
        },

        onClose: function(evt) {
            evt.preventDefault();
            var self = this;
            this.toggleVisibility(false);
        },

        render: function () {
            this.$el.html(this.template({ data: this.model.toJSON() }));
            var self = this;
            this.model.forEach(function(model) {
                self.addChatRow(model);
            });
            return this;
        },

        addChatRow: function(model) {
            var $chatroom = this.$('div.chat-room');
            var $chatRow = $('<div/>', { 'class': 'chat-row first' });
            var index = model.collection.indexOf(model);
            if (index > 0) {
                var prevModel = model.collection.at(index - 1);
                if (prevModel.get("Username") == model.get("Username")) {
                    $chatRow.removeClass('first');
                }
            }
            $chatRow.html(this.rowtemplate(model.attributes));
            $chatroom.append($chatRow);
            if (($chatroom.scrollTop() + $chatroom.height() + 400) >= $chatroom[0].scrollHeight) {
                $chatroom.scrollTop($chatroom[0].scrollHeight);
            }

            if (this.polling && model.get("Username") != CurrentUser.Username) {
                var $snackBar = $('<div/>', { 'class': 'snack-bar' }).html(this.rowtemplate(model.attributes));
                var $snackBars = $('.snack-bars');
                if ($snackBars.children().length > 0) {
                    $snackBars.children().first().before($snackBar);
                } else {
                    $snackBars.append($snackBar);
                }
                setTimeout(function() {
                    $snackBar.addClass('hidden');
                    setTimeout(function() {
                        $snackBar.remove();
                    }, 1750);
                }, 3000);
            }
            return $chatRow;
        },

        onAdd: function (model) {
            if (model && model.get("Username") && model.get("Text")) {
                this.addChatRow(model);
            }
        },

        startPolling: function (interval) {
            var self = this;
            setInterval(function () {
                self.polling = true;
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