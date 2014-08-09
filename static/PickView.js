define([
	'jquery',
	'underscore',
	'backbone',
	'text!static/pick.template.html',
	'OrderMap',
	'UserMap',
	'PlayerMap'
], function($, _, Backbone, template, OrderMap, UserMap, PlayerMap) {

	var PickTypes = { Keeper: 1, OnClock: 2, Pick: 3 };

	var PickView = Backbone.View.extend({
		tagName: 'div',
		className: 'draft-square pick-empty',

		template: _.template(template),

		initialize: function() {
			this.model.bind('change', this.render, this);
		},

		render: function() {

			var classNames = ['draft-square'];
			var pickData = {};
			var currPick = this.model;
            if (currPick.get("Team") != OrderMap[currPick.get("Pick")]) {
                pickData.override = { team: UserMap[currPick.get("Team")].Username.toUpperCase() };
            }
            if (currPick.get("Type") == PickTypes.OnClock) {
                if (pickData.override) {
                    pickData.override.text = ["(" + pickData.override.team + ")"];
                }
                pickData.text = ["On The Clock"];
            } else if (currPick.get("Player") && PlayerMap[currPick.get("Player")]) {
                var player = PlayerMap[currPick.get("Player")];
                if (pickData.override) {
                    pickData.override.text = ["(" + pickData.override.team + ")"];
                }
                pickData.text = [];
                if (player.Name.length > 16) {
                    var parts = player.Name.split(" ");
                    var str = '';
                    var nextStr = str;
                    for (var i = 0; i < parts.length; i++) {
                        nextStr += (nextStr.length > 0 ? " " : "") + parts[i];
                        if (nextStr.length > 16) {
                            if (str.length > 0) {
                                pickData.text.push(str);
                                str = parts[i];
                                nextStr = str;
                            } else {
                                pickData.text.push(nextStr);
                                str = nextStr = '';
                            }
                        } else {
                            str = nextStr;
                        }
                    }
                    if (str.length > 0) {
                        pickData.text.push(str);
                    }
                } else {
                    pickData.text.push(player.Name)
                }
                pickData.text.push(player.TeamInfo);
            } else if (pickData.override) {
                pickData.override.text = [];
            }

            var position = '';
            if (currPick.get("Player") && PlayerMap[currPick.get("Player")]) {
                position = 'player-' + PlayerMap[currPick.get("Player")].Position;
            }

            switch (currPick.get("Type")) {
                case PickTypes.Keeper:
                	classNames.push('pick-keeper'); // draftPickKeeper
                	if (position) {
                		classNames.push(position);
                	}
                    break;
                case PickTypes.OnClock:
                	classNames.push('pick-active'); // draftPickActive
                	if (currPick.get("TimeLeft")) {
                		var timeInfo = this.model.collection.getTimeInfo(currPick.get("TimeLeft"));
                		pickData.text = [timeInfo.minutes + ":" + timeInfo.seconds];
                		classNames.push('pick-clock');
                	}
                    break;
                case PickTypes.Pick:
                	classNames.push('pick-drafted'); // draftPick
                	if (position) {
                		classNames.push(position);
                	}
                    break;
                default:
                    if (pickData.override) {
                        if (pickData.override.team) {
                            classNames.push('logo');
                            classNames.push('traded');
                            classNames.push(pickData.override.team.toLowerCase());
                        } else {
                        	classNames.push('pick-override'); // draftPickOverride
                        	if (position) {
                        		classNames.push(position);
                        	}
                        }
                    } else {
                        pickData.className = "pick-empty";
                        classNames.push('pick-empty');
                    }
                    break;
            }

            pickData.overrideLines = (pickData.override && pickData.override.text && pickData.override.text.length) || 0;
			pickData.totalLines = pickData.overrideLines + ((pickData.text && pickData.text.length) || 0);

            this.$el.removeClass()
            	.html(this.template({ pickData: pickData }))
            	.addClass(classNames.join(' '));

            return this;
            //pickNumber = ((currPick.get("Round") - 1) * Settings.TeamsPerDraft) + currPick.get("Pick");
            //pickMap[pickNumber] = pickData;
		}
	});

	return PickView;
});