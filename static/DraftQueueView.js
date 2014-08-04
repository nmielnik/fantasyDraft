define([
    'jquery',
    'underscore',
    'backbone',
    'text!static/draftqueue.template.html',
    'PlayerMap'
], function ($, _, Backbone, template, PlayerMap) {

    var QueueView = Backbone.View.extend({

        initialize: function() {
            this.model.on('change', this.render, this);
        },

        render: function () {
            var $el = this.$el.empty();
            _.each(this.model.get("DraftQueue"), function (playerId) {
                $el.append($('<option/>', { 'value': playerId }).html(PlayerMap[playerId].SearchName));
            });
            return this;
        }
    });

    var DraftQueueView = Backbone.View.extend({
        template: _.template(template),

        events: {
            'click input[type=button].default': 'onSubmit',
            'keyup input.search': 'onSearch',
            'click a.result': 'onResultClick',
            'click input[type=button].remove': 'onRemove'
        },

        searchCache: [],

        initialize: function (options) {
            this.model.on('change reset add remove', this.filterQueue, this);
            this.QueueCache = options.QueueCache;
        },

        filterQueue: function () {
            var self = this;
            var queue = this.queueView.model.get("DraftQueue");
            var newQueue = queue;
            this.model.forEach(function (model) {
                var playerId = model.get("Player");
                if (playerId && PlayerMap[playerId]) {
                    self.$('div.searchResults a[data-player-id=' + playerId + ']').remove();
                    if (newQueue && newQueue.length > 0) {
                        newQueue = _.reject(newQueue, function (val) { return val == playerId; });
                    }
                    PlayerMap[playerId].Picked = true;
                }
            });
            if (newQueue && newQueue.length != queue.length) {
                this.stopPolling();
                this.queueView.model.save({ "DraftQueue": newQueue }, {
                    success: $.proxy(this.onQueueSave, this),
                    error: $.proxy(this.onQueueSave, this)
                });
            }
        },

        onSubmit: function (evt) {
            evt.preventDefault();

            var plyrId = this.$('select').val();
            if (plyrId) {
                this.model.create({ Player: parseInt(plyrId) }, { wait: true, success: $.proxy(this.submitSuccess, this), error: $.proxy(this.submitError, this) });
            } else {
                this.showPickMessage("Add a player to your queue, select them, and then click 'Draft'");
            }
        },

        submitSuccess: function (model, response, options) {
            this.showPickMessage("The player was picked successfully");
        },

        submitError: function (model, response, options) {
            if (response && response.responseJSON) {
                var responseData = response.responseJSON;
                if (responseData.Status == 401) {
                    window.location.replace("/Draft/login");
                } else {
                    console.log("Pick Submit Error")
                    console.log(responseData);
                    this.showPickMessage(responseData.Message);
                }
            }
        },

        showPickMessage: function (message) {
            this.$('td.message').html(message);
        },

        onSearch: function (evt) {
            var $results = this.$('div.searchResults');
            var $search = this.$('input.search');
            var text = $search.val().toLowerCase();
            if (text.length > 2 && text !== $search.data('previous')) {
                $search.data('previous', text);
                $results.empty();
                if (!this.searchCache[text]) {
                    var matchedIds = [];
                    _.each(PlayerMap, function (val, key) {
                        if (PlayerMap[key] &&
                            (PlayerMap[key].Name.toLowerCase().indexOf(text) != -1 ||
                             PlayerMap[key].TeamInfo.toLowerCase().indexOf(text) != -1)) {
                            matchedIds.push(key);
                        }
                    });
                    this.searchCache[text] = matchedIds;
                }
                if (this.searchCache[text]) {
                    _.each(this.searchCache[text], function (playerId) {
                        var player = PlayerMap[playerId];
                        if (!player.Picked) {
                            var $link = $('<a/>', { href: '', 'class': 'result' })
                                .html(player.Name + ' - ' + player.TeamInfo)
                                .attr('data-player-id', playerId);
                            $results.append($('<div/>').append($link));
                        }
                    });
                }
            } else if (text !== $search.data('previous')) {
                $results.empty();
            }
        },

        onResultClick: function (evt) {
            evt.preventDefault();
            var playerId = parseInt($(evt.target).attr('data-player-id'));
            var queue = this.queueView.model.get("DraftQueue");
            if (!_.contains(queue, playerId)) {
                this.stopPolling();
                queue.push(playerId);
                this.queueView.model.save({ "DraftQueue": queue}, {
                    success: $.proxy(this.onQueueSave, this),
                    error: $.proxy(this.onQueueSave, this)
                });
            }
        },

        onRemove: function (evt) {
            evt.preventDefault();
            var $option = this.$('select').find(':selected');
            var playerId = parseInt($option.prop('value'));
            var queue = this.queueView.model.get("DraftQueue");
            if (_.contains(queue, playerId)) {
                this.stopPolling();
                queue = _.reject(queue, function (val) { return val == playerId });
                this.queueView.model.save({ "DraftQueue": queue }, {
                    success: $.proxy(this.onQueueSave, this),
                    error: $.proxy(this.onQueueSave, this)
                });
            }
        },

        onQueueSave: function() {
            this.QueueCache.trigger('change');
            this.startPolling();
        },

        stopPolling: function() {
            if (this.timerId) {
                clearInterval(this.timerId);
            }
            return this;
        },

        startPolling: function (interval) {
            var self = this;
            this.interval = interval || this.interval;
            this.timerId = setInterval(function () {
                self.queueView.model.fetch();
            }, this.interval);
            return this;
        },

        render: function () {
            this.$el.html(this.template());
            this.queueView = new QueueView({ el: this.$('select'), model: this.QueueCache }).render();

            return this;
        }
    });

    return DraftQueueView;
});