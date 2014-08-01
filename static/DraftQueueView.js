define([
    'jquery',
    'underscore',
    'backbone',
    'text!static/draftqueue.template.html',
    'PlayerMap'
], function ($, _, Backbone, template, PlayerMap) {
    var DraftQueueView = Backbone.View.extend({
        template: _.template(template),

        events: {
            'click input[type=button].default': 'onSubmit',
            'keyup input.search': 'onSearch',
            'click a.result': 'onResultClick',
            'click input[type=button].remove': 'onRemove'
        },

        searchCache: [],

        initialize: function () {
            this.model.on('change reset add remove', this.filterQueue, this);
        },

        filterQueue: function () {
            var queuedPlayers = [];
            this.$('select > option').each(function (idx) {
                var $option = $(this);
                queuedPlayers[parseInt($option.prop('value'))] = $option;
            });
            this.$('div.searchResults a').each(function (idx) {
                var $result = $(this);
                var $toRemove = $result.closest('div');
                var playerId = parseInt($result.data('player-id'));
                if (queuedPlayers[playerId])
                    queuedPlayers[playerId] = queuedPlayers[playerId].add($toRemove);
                else
                    queuedPlayers[playerId] = $toRemove;
            });

            this.model.forEach(function (model) {
                var playerId = model.get("Player");
                if (playerId && PlayerMap[playerId]) {
                    if (queuedPlayers[playerId]) {
                        queuedPlayers[playerId].remove();
                        delete queuedPlayers[playerId];
                    }
                    PlayerMap[playerId].Picked = true;
                }
            });
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
                                .data('player-id', playerId);
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
            var playerId = parseInt($(evt.target).data('player-id'));
            var $queue = this.$('select');
            var $option = $queue.find('option[value=' + playerId + ']');
            if ($option.length == 0) {
                $queue.append($('<option/>', { 'value': playerId }).html(PlayerMap[playerId].SearchName));
            }
        },

        onRemove: function (evt) {
            evt.preventDefault();
            var $option = this.$('select').find(':selected');
            if ($option.length > 0) {
                $option.remove();
            }
        },

        render: function () {
            this.$el.html(this.template());
            return this;
        }
    });

    return DraftQueueView;
});