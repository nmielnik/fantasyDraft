define([
    'jquery',
    'underscore',
    'backbone',
    'text!static/teaminfo.template.html',
    'text!static/draftedplayercol.template.html',
    'PlayerMap',
    'UserMap',
    'Settings'
], function ($, _, Backbone, teamInfoTemplate, playerColTemplate, PlayerMap, UserMap, Settings) {

    var DraftedPlayerColView = Backbone.View.extend({
        tagName: 'div',
        className: 'pos-col',

        template: _.template(playerColTemplate),

        render: function () {
            this.$el.empty();
            this.$el.html(this.template({
                position: this.model.get('Position'),
                players: this.model.get('Players')
            }));
            return this;
        }
    });

    var TeamInfoView = Backbone.View.extend({
        tagName: 'div',
        className: 'team-info-holder',
        events: {
            'click a.close': 'handleClose'
        },

        template: _.template(teamInfoTemplate),

        handleClose: function (event) {
            event.preventDefault();
            this.hide();
        },

        hide: function () {
            this.$el.hide();
        },

        show: function () {
            this.$el.show();
        },

        render: function () {
            this.$el.empty();
            this.$el.html(this.template({
                team: this.model.get('Team')
            }));
            var positions = this.model.get('Positions');
            ['QB', 'RB', 'WR', 'TE'].forEach(function (pos) {
                var colView = new DraftedPlayerColView({
                    model: new Backbone.Model({
                        Position: pos,
                        Players: positions[pos] || []
                    })
                });
                this.$el.append(colView.render().$el);
            }, this);

            return this;
        }
    });

    return TeamInfoViews = Backbone.View.extend({

        initialize: function () {
            this.model.on('change reset add remove', this.onUpdate, this);
            this.views = {};
            this.updateTeamInfo();
            _.each(this.teamInfo, function (team, userId) {
                this.views[userId] = new TeamInfoView({
                    model: new Backbone.Model(this.teamInfo[userId])
                });
                this.$el.append(this.views[userId].render().$el);
            }, this);
        },

        onUpdate: function () {
            if (!this.addCount) {
                this.addCount = 0;
            }
            this.addCount++;
            if (this.addCount >= (Settings.TeamsPerDraft * Settings.RoundsPerDraft)) {
                this.render();
            }
        },

        hide: function () {
            _.each(this.views, function (view) {
                view.hide();
            });
        },

        showTeamInfo: function (teamId) {
            this.hide();
            if (this.views[teamId]) {
                this.views[teamId].show();
            }
        },

        render: function () {
            this.updateTeamInfo();
            _.each(this.teamInfo, function (info, userId) {
                this.views[userId].model = new Backbone.Model(info);
                this.views[userId].render();
            }, this);
        },

        updateTeamInfo: function () {
            this.teamInfo = {};
            _.each(UserMap, function (userInfo, userId) {
                this.teamInfo[userId] = {
                    Positions: {},
                    Team: userInfo
                };
                ['QB', 'RB', 'WR', 'TE'].forEach(function (pos) {
                    this.teamInfo[userId].Positions[pos] = [];
                }, this);
            }, this);
            this.model.forEach(function (currPick) {
                var teamId = currPick.get('Team');
                var playerId = currPick.get('Player');
                if (playerId) {
                    var player = PlayerMap[playerId];
                    if (!player) {
                        console.error('COULD NOT FIND PLAYER: ' + playerId);
                        return;
                    }
                    if (!this.teamInfo[teamId].Positions[player.Position]) {
                        this.teamInfo[teamId].Positions[player.Position] = [];
                    }
                    this.teamInfo[teamId].Positions[player.Position].push(Object.assign({}, player, {
                        PickInfo: {
                            Round: currPick.get('Round'),
                            Pick: currPick.get('Pick'),
                            Type: currPick.get('Type'),
                            TotalPick: currPick.get('TotalPick')
                        }
                    }));
                }
            }, this);
        }
    });

    return TeamInfoViews;
});