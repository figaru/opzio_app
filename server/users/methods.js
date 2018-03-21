Meteor.methods({
	/**
		Utility function: used when user instance is created -> The user's "personal time" project
	**/
	'users.createUserPersonalProject': function(userId, orgId){
		if(userId && orgId){
			Projects.insert({
				'name' : 'Personal',
				'gitName' : '',
				'type' : 'personal',
				'totalTime' : 0,
				'plannedTime' : 0,
				'budget' : 0,
				'owner' : [ userId ],
				'team' : [ 
					{
						'user' : userId,
						'role' : 'owner'
					}
				],
				'visibility' : 0,
				'lastUser' : userId,
				'valuePerHour' : 0,
				'organization' : orgId,
				'useForCategorization' : true,
				'externalServices' : [],
				'createDate' : new Date(),
				'updateDate' : new Date(),
				'trained' : false,
				'classProbability' : [],
				'codeName' : 'PER',
				'state' : {
					'val' : 0,
					'type' : 'initiate'
				},
				'priority' : {
					'val' : 1,
					'type' : 'normal'
				}
			});
		}
	},
	/**
		Extends default domain rules from the system to the user
		// DEPRECATED!!!!
	**/
	'users.createDefaultDomainRules': function(user){
		//Get system domain rules (where org is null)
		var systemDomainRules = DomainRules.aggregate([
			{
				$match:{
					user: 'root',
					organization: 'system'
				}
			},
		]);

		var counter = 0;

		_.each(systemDomainRules, function(rule, key){
			counter +=1;
			_createDefaultUserDomainRule(user, rule)
		});
	},

	'users.dimsissMainIntro': function(){
		Meteor.users.update({
			_id: this.userId
		},
		{
			$set:{
				'mainIntro.show': false
			}
		});
	},
	'users.completedMainIntro': function(field){
		this.unblock();
		//Update a specific field from the intro (may not be completed yet)
		if(typeof field !== 'undefined'){
			
			switch(field){
				case 'installPlugins':
					Meteor.users.update({
						_id: this.userId
					},
					{
						$set:{
							'mainIntro.installPlugins': true
						}
					});
					break;

				case 'createProjects':
					Meteor.users.update({
						_id: this.userId
					},
					{
						$set:{
							'mainIntro.createProjects': true
						}
					});
					break;

				case 'inviteTeam':
					Meteor.users.update({
						_id: this.userId
					},
					{
						$set:{
							'mainIntro.inviteTeam': true
						}
					});
					break;

			}
		}
		//Hide mainIntro as it's completed
		else{
			Meteor.users.update({
				_id: this.userId
			},
			{
				$set:{
					//'mainIntro.show': false,
					'mainIntro.completed': true
				}
			});
		}
	},

	/*******
		User Settings Methods
	*******/
	//Update first name
	'users.updateFirstName': function(firstName, userId){
		if(!this.userId){ return; }

		check(firstName, String);
		check(userId, String);

		if(this.userId === userId){
			Meteor.users.update({
				_id: this.userId,
			},
			{
				$set:{
					'profile.firstName': firstName
				}
			})
		}

	},
	//Update last name
	'users.updateLastName': function(lastName, userId){
		if(!this.userId){ return; }

		check(lastName, String);
		check(userId, String);

		if(this.userId === userId){
			Meteor.users.update({
				_id: this.userId,
			},
			{
				$set:{
					'profile.lastName': lastName
				}
			})
		}
	},
	//Update trackable days of week
	'users.setWorkableDay': function(userId, day, push){
		if(!this.userId){ return; }

		check(userId, String);
		check(day, Number);
		check(push, Boolean);

		if(this.userId === userId){
			//Add to workable days
			if(push){
				var updatePipeline = {
					$addToSet:{
						workableWeekDays: day
					}
				}
			}
			//Pull from workable days
			else{
				var updatePipeline = {
					$pull:{
						workableWeekDays: day
					}
				}
			}
			
			Meteor.users.update({
				_id: userId
			},
			updatePipeline);
		}
	},
	//Update tracking start hour & workable hours array
	'users.updateWorkStartHour': function(userId, hour){
		if(!this.userId){ return; }
		check(userId, String);
		check(hour, Number);

		if(this.userId === userId){
			var user = Meteor.users.findOne({
				_id: userId
			});

			var hourDif = user.workEndHour - hour;
			var intialHour = hour;
			var workableHours = [ hour ];

			for(var i=0; i<hourDif; i++){
				intialHour += 1;
				workableHours.push(intialHour);
			}

			Meteor.users.update({
				_id: this.userId
			},{
				$set:{
					workStartHour: hour,
					workableHours: workableHours
				}
			});
		}
	},
	//Update tracking end hour & workable hours array
	'users.updateWorkEndHour': function(userId, hour){
		if(!this.userId){ return; }
		check(userId, String);
		check(hour, Number);

		if(this.userId === userId){
			var user = Meteor.users.findOne({
				_id: userId
			});

			var hourDif = hour - user.workStartHour;
			var intialHour = user.workStartHour;
			var workableHours = [ user.workStartHour ];

			for(var i=0; i<hourDif; i++){
				intialHour += 1;
				workableHours.push(intialHour);
			}

			Meteor.users.update({
				_id: this.userId
			},{
				$set:{
					workEndHour: hour,
					workableHours: workableHours
				}
			});
		}
	},
	//Update plugin active/inactive state
	'users.changePluginState': function(userId, tracker, state){
		if(!this.userId){ return; }

		try{
			check(tracker, String);
			check(userId, String);
			check(state, Boolean);


			if(this.userId === userId){
				Meteor.users.update({
					_id: this.userId,
					'trackers.tracker': tracker
				},
				{
					$set:{
						'trackers.$.active': state
					}
				});
			}
		}
		catch(err){
			if(!this.userId){ throw new Meteor.Error(500, err); }
		}
	},

	//User notifications
	'users.changeNotificationOption': function(notification, state){
		check(notification, String);
		check(state, Boolean);

		Meteor.users.update({
			_id: this.userId,
			'notificationOptions.name': notification
		},
		{
			$set:{
				'notificationOptions.$.active': state
			}
		});
	},
	'users.changeNotificationHour': function(notification, hour){
		check(notification, String);
		check(hour, Date);

		//var prev = moment(hour).subtract(25, 'hour');

		Meteor.users.update({
			_id: this.userId,
			'notificationOptions.name': notification
		},
		{
			$set:{
				'notificationOptions.$.scheduledHour': hour,
				//'notificationOptions.$.lastSendDate': prev.toDate()
			}
		});
	},
	'users.changeNotificationDailyIncludeWeekend': function(notification, includeWeekends){
		check(notification, String);
		check(includeWeekends, Number);

		if(includeWeekends === 0){
			var sendWeekends = false;
		}
		else{
			var sendWeekends = true;	
		}

		Meteor.users.update({
			_id: this.userId,
			'notificationOptions.name': notification
		},
		{
			$set:{
				'notificationOptions.$.includeWeekends': sendWeekends,
			}
		});
	},
	'users.changeNotificationWeeklySendDay': function(notification, day){
		check(notification, String);
		check(day, String);

		Meteor.users.update({
			_id: this.userId,
			'notificationOptions.name': notification
		},
		{
			$set:{
				'notificationOptions.$.sendDay': day,
			}
		});
	},
	/****
		JOYRIDE DISPLAY: set active/inactive the display of dashboard joyrides
	****/
	/*
		@ride (string): the name of the joyride
		@state (boolean): true to display, false to hide the joyride
		Ride names:
			joyrides.userDashboard
			joyrides.userSettings
			joyrides.plugins
			joyrides.timesheet
	*/
	'updateJoyride': function(ride, state){
		check(ride, String);
		check(state, Boolean);

		switch(ride){
			case 'userDashboard':
				Meteor.users.update({ _id: this.userId },{
					$set:{ 'joyrides.userDashboard': state }
				});
				break;
			case 'userSettings':
				Meteor.users.update({ _id: this.userId },{
					$set:{ 'joyrides.userSettings': state }
				});
				break;
			case 'plugins':
				Meteor.users.update({ _id: this.userId },{
					$set:{ 'joyrides.plugins': state }
				});
				break;
			case 'timesheet':
				Meteor.users.update({ _id: this.userId },{
					$set:{ 'joyrides.timesheet': state }
				});
			case 'projectCreation':
				Meteor.users.update({ _id: this.userId },{
					$set:{ 'joyrides.projectCreation': state }
				});
				break;
		}
	}
});