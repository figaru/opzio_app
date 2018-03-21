Template.userSettings.onRendered(function(){
	initTooltips();

	//$('body').scrollspy({ target: '#sideNav', offset: 155 })
	
	if(Meteor.user().joyrides.userSettings){
		initUserSettingsJoyride();
	}
});

Template.userSettings.events({
	'blur #firstName': function(e){
		var reNames = new RegExp('^[A-Za-z\u00C0-\u017F\p{L}]+');
		var firstName = $(e.currentTarget).val();

		if(firstName != "" && firstName != " " && firstName.length > 0){
			if(!reNames.test(firstName)){
				
				$('#firstName').focus();
				
				toastr.error('Please insert a valid first name (letters and numbers).', 'Invalid form');
				
				return false;
			}
		}
		else{
			
			toastr.error('Please provide a first name.', 'Invalid form');
			
			$('#firstName').focus();
			
			return false;
		}

		var initialValue = $(e.currentTarget).attr('data-initialvalue');
		if(firstName !== initialValue){
			var user = Router.current().params.userId;
			Meteor.call('users.updateFirstName', firstName, user, function(err, data){
				if(!err){
					toastr.success('First name updated.')
				}
				else{
					toastr.error('There was an error updating your first name.');
				}
			})
		}
	},
	'blur #lastName': function(e){
		var reNames = new RegExp('^[A-Za-z\u00C0-\u017F\p{L}]+');
		var lastName = $(e.currentTarget).val();

		if(lastName != "" && lastName != " " && lastName.length > 0){
			if(!reNames.test(lastName)){
				
				$('#lastName').focus();
				
				toastr.error('Please insert a valid first name (letters and numbers).', 'Invalid form');
				
				return false;
			}
		}
		else{
			
			toastr.error('Please provide a first name.', 'Invalid form');
			
			$('#lastName').focus();
			
			return false;
		}

		var initialValue = $(e.currentTarget).attr('data-initialvalue');
		if(lastName !== initialValue){
			var user = Router.current().params.userId;
			Meteor.call('users.updateLirstName', lastName, user, function(err, data){
				if(!err){
					toastr.success('Last name updated.')
				}
				else{
					toastr.error('There was an error updating your last name.');
				}
			})
		}
	},
	'change .plugin-state-toggle': function(e){
		var plugin = $(e.currentTarget).closest('.pluginRow').attr('data-plugintype');
		var state = $(e.currentTarget).prop('checked');
		var user = Router.current().params.userId;

		Meteor.call('users.changePluginState', user, plugin, state, function(err, data){
			if(err){
				toastr.error('Error changing plugin state.')
				console.log(err);
			}
		})
	},
	//Change workable days
	'click .privacyDay': function(e){
		var el = $(e.currentTarget);
		var day = el.attr('data-value');
		var state = el.prop('checked');
		var user = Router.current().params.userId;

		Meteor.call('users.setWorkableDay', user, parseInt(day), state, function(err,data){
			if(err){
				console.log(err)
				toastr.error('Error changing plugin state.')
			}

		});
	},

	'click .trackingHour': function(e){
		e.preventDefault();
		var el = $(e.currentTarget);
		var hour = el.attr('data-value');
		var user = Template.instance().data.user;
		var type = el.attr('data-type');
		
		switch(type){
			case 'startHour':
				var endHour = $('#selectedEndHour').attr('data-value');
				if(typeof endHour !== 'undefined'){
					if(parseInt(hour) > parseInt(endHour)){
						toastr.error('Start hour must be before end hour.')
					}
					else{
						Meteor.call('users.updateWorkStartHour', user._id, parseInt(hour), function(err, data){
							if(err){
								toastr.error('There was an error updatign your work start hour');
							}
						});
					}
				}
				break;

			case 'endHour':
				var startHour = $('#selectedStartHour').attr('data-value');
				if(typeof startHour !== 'undefined'){
					if(parseInt(hour) < parseInt(startHour)){
						toastr.error('End hour must be after start hour.')
					}
					else{
						Meteor.call('users.updateWorkEndHour', user._id, parseInt(hour), function(err, data){
							if(err){
								console.log(err)
								toastr.error('There was an error updatign your work end hour');
							}
						});
					}
				}
				break;
		}


	},

	//##########
	//Notification options
	//##########
	'click .sendHourOption': function(e){
		e.preventDefault();
		var el = $(e.currentTarget);
		var notificationType = el.closest('.dropdown, .dropup').attr('data-type');

		var scheduledHour = moment().hour(parseInt(el.attr('data-value'))).minutes(0);

		Meteor.call('users.changeNotificationHour', notificationType, scheduledHour.toDate(), function(err, data){
			if(!err){
				toastr.success('Changed notification hour to ' + scheduledHour.format('HH:mm a'))
			}
			else{
				toastr.error('Error hour notification.')
				console.log(err);
			}
		});

	},
	'change .notification-toggle': function(e){
		var notificationType = $(e.currentTarget).closest('.notificationRow').attr('data-type');
		var label = $(e.currentTarget).closest('.notificationRow').attr('data-label');
		var state = $(e.currentTarget).prop('checked');

		Meteor.call('users.changeNotificationOption', notificationType, state, function(err, data){
			if(!err){
				if(state){
					toastr.success('You will receive the '+label+'.');
				}
				else{
					toastr.success('You will no longer receive the '+label+'.');
				}
			}
			else{
				toastr.error('Error deactivating '+label+'.')
				console.log(err);
			}
		});
	},
	'click .dailyFrequencyOption': function(e){
		e.preventDefault();
		var el = $(e.currentTarget);
		var value = parseInt(el.attr('data-value'));
		var notificationType = $(e.currentTarget).closest('.notificationRow').attr('data-type');

		Meteor.call('users.changeNotificationDailyIncludeWeekend', notificationType, value, function(err, data){
			if(!err){
				if(value === 0){
					toastr.success('You will only receive daily reports on week days.');
				}
				else{
					toastr.success('You will only receive daily every day including weekends.');
				}
			}
			else{
				toastr.error('Error setting send day.')
				console.log(err);
			}
		});
	},
	'click .weeklyFrequencyOption': function(e){
		e.preventDefault();
		var el = $(e.currentTarget);
		var value = el.attr('data-value');
		var notificationType = $(e.currentTarget).closest('.notificationRow').attr('data-type');

		Meteor.call('users.changeNotificationWeeklySendDay', notificationType, value, function(err, data){
			if(!err){
				toastr.success('You will receive weekly reports on '+value+'.');
			}
			else{
				toastr.error('Error setting send day.')
				console.log(err);
			}
		});
	},
});

Template.userSettings.helpers({
	'initTooltips': function(){
		initTooltips();
	},

	//Privacy helpers
	'isSelectedWorkDay': function(day){
		var user = Template.instance().data.user;
		if(user.workableWeekDays.indexOf(day) >= 0){
			return true;
		}
		else{
			return false;
		}
	},

	'userWorkStartHour': function(){
		var startHour = Template.instance().data.user.workStartHour;

		switch(startHour){
			case 0:
				return '00:00';
				break;
			case 1:
				return '01:00';
				break;
			case 2:
				return '02:00';
				break;
			case 3:
				return '03:00';
				break;
			case 4:
				return '04:00';
				break;
			case 5:
				return '05:00';
				break;
			case 6:
				return '06:00';
				break;
			case 7:
				return '07:00';
				break;
			case 8:
				return '08:00';
				break;
			case 9:
				return '09:00';
				break;
			case 10:
				return '10:00';
				break;
			case 11:
				return '11:00';
				break;
			case 12:
				return '12:00';
				break;
			case 13:
				return '13:00';
				break;
			case 14:
				return '14:00';
				break;
			case 15:
				return '15:00';
				break;
			case 16:
				return '16:00';
				break;
			case 17:
				return '17:00';
				break;
			case 18:
				return '18:00';
				break;
			case 19:
				return '19:00';
				break;
			case 20:
				return '20:00';
				break;
			case 21:
				return '21:00';
				break;
			case 22:
				return '22:00';
				break;
			case 23:
				return '23:00';
				break;

			default:
				return 'Unset';
				break;
		}
	},
	'userWorkEndHour': function(){
		var endHour = Template.instance().data.user.workEndHour;
		switch(endHour){
			case 0:
				return '00:00';
				break;
			case 1:
				return '01:00';
				break;
			case 2:
				return '02:00';
				break;
			case 3:
				return '03:00';
				break;
			case 4:
				return '04:00';
				break;
			case 5:
				return '05:00';
				break;
			case 6:
				return '06:00';
				break;
			case 7:
				return '07:00';
				break;
			case 8:
				return '08:00';
				break;
			case 9:
				return '09:00';
				break;
			case 10:
				return '10:00';
				break;
			case 11:
				return '11:00';
				break;
			case 12:
				return '12:00';
				break;
			case 13:
				return '13:00';
				break;
			case 14:
				return '14:00';
				break;
			case 15:
				return '15:00';
				break;
			case 16:
				return '16:00';
				break;
			case 17:
				return '17:00';
				break;
			case 18:
				return '18:00';
				break;
			case 19:
				return '19:00';
				break;
			case 20:
				return '20:00';
				break;
			case 21:
				return '21:00';
				break;
			case 22:
				return '22:00';
				break;
			case 23:
				return '23:00';
				break;

			default:
				return 'Unset';
				break;
		}
	},

	//Notification helpers
	'notificationRow': function(option){
		if(option.active){

			var activeSwitchEl = '<div class="switch"><label>No <input class="notification-toggle" checked type="checkbox"/><span class="lever"></span> Yes</label></div>';
		}
		else{
			var activeSwitchEl = '<div class="switch"><label>No <input class="notification-toggle" type="checkbox"/><span class="lever"></span> Yes</label></div>';
		}

		var frequencyEl = frequencyDropdown(option);

		if(option.lastSendDate !== 0){
			var lastSent = moment(option.lastSendDate).format('DD/MM/YYYY HH:mm');
		}
		else{
			var lastSent = 'N/A';
		}

		return '<tr class="notificationRow" data-type="'+option.name+'" data-label="'+ option.label+'">\
					<th>'+ option.label +'</th>\
					<td>'+ lastSent +'</td>\
					<td>'+ frequencyEl +'</td>\
					<td>'+ sendHourDropdown(option.scheduledHour, option.name) +'</td>\
					<td>'+activeSwitchEl+'</td>\
				</tr>';
	}
});

frequencyDropdown = function(option){
	var el;

	switch(option.name){
		case 'userDailyReportOptions':
			if(option.includeWeekends){
				var label = 'Week days &amp; weekends';
			}
			else{
				var label = 'Week days only';
			}

			el = '<div class="dropup" >\
			  <button class="btn btn-primary dropdown-toggle no-caret" type="button" id="frequency_'+ option.name +'" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">\
			  	<span class="submenu-title frequencyOption daily">'+ label +'</span>\
			    <i class="fa fa-angle-down"></i>\
			  </button>\
			  <ul class="dropdown-menu mh-30 overflow-y-scroll" aria-labelledby="frequency_'+ option.name +'">\
				<li><a class="dropdown-item menu-option dailyFrequencyOption" data-value="0" href="#">Week days only</a></li>\
				<li><a class="dropdown-item menu-option dailyFrequencyOption" data-value="1" href="#">Week days &amp; weekends</a></li>\
			  </ul>\
			</div>';
			break;
		
		case 'userWeeklyReportOptions':
			el = '<div class="dropup" >\
			  <button class="btn btn-primary dropdown-toggle no-caret" type="button" id="frequency_'+ option.name +'" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">\
			  	<span class="submenu-title frequencyOption weekly">Every '+ capitalizeFirstLetter(option.sendDay) +'s</span>\
			    <i class="fa fa-angle-down"></i>\
			  </button>\
			  <ul class="dropdown-menu mh-40 overflow-y-scroll" aria-labelledby="frequency_'+ option.name +'">\
				<li><a class="dropdown-item menu-option weeklyFrequencyOption" data-value="monday" href="#">Monday</a></li>\
				<li><a class="dropdown-item menu-option weeklyFrequencyOption" data-value="tuesday" href="#">Tuesday</a></li>\
				<li><a class="dropdown-item menu-option weeklyFrequencyOption" data-value="wednesday" href="#">Wednesday</a></li>\
				<li><a class="dropdown-item menu-option weeklyFrequencyOption" data-value="thursday" href="#">Thursday</a></li>\
				<li><a class="dropdown-item menu-option weeklyFrequencyOption" data-value="friday" href="#">Friday</a></li>\
				<li><a class="dropdown-item menu-option weeklyFrequencyOption" data-value="saturday" href="#">Saturday</a></li>\
				<li><a class="dropdown-item menu-option weeklyFrequencyOption" data-value="sunday" href="#">Sunday</a></li>\
			  </ul>\
			</div>';
			break;
		
		case 'userMonthlyReportOptions':
			el = '<button class="btn btn-primary" disabled>End of each month</button>';
			break;
	}

	return el;
}

sendHourDropdown = function(selectHour, name){
	return '<div class="dropup" data-type="'+ name +'">\
	  <button class="btn btn-primary dropdown-toggle no-caret" type="button" id="startHour_'+ name +'" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">\
	  	<span data-value="'+ moment(selectHour).hour() +'" class="submenu-title">'+ moment(selectHour).format('HH:mm') +'</span>\
	    <i class="fa fa-angle-down"></i>\
	  </button>\
	  <ul class="dropdown-menu mh-30 overflow-y-scroll" aria-labelledby="startHour_'+ name +'">\
		<li><a class="dropdown-item menu-option sendHourOption" data-value="0" href="#">00:00</a></li>\
		<li><a class="dropdown-item menu-option sendHourOption" data-value="1" href="#">01:00</a></li>\
		<li><a class="dropdown-item menu-option sendHourOption" data-value="2" href="#">02:00</a></li>\
		<li><a class="dropdown-item menu-option sendHourOption" data-value="3" href="#">03:00</a></li>\
		<li><a class="dropdown-item menu-option sendHourOption" data-value="4" href="#">04:00</a></li>\
		<li><a class="dropdown-item menu-option sendHourOption" data-value="5" href="#">05:00</a></li>\
		<li><a class="dropdown-item menu-option sendHourOption" data-value="6" href="#">06:00</a></li>\
		<li><a class="dropdown-item menu-option sendHourOption" data-value="7" href="#">07:00</a></li>\
		<li><a class="dropdown-item menu-option sendHourOption" data-value="8" href="#">08:00</a></li>\
		<li><a class="dropdown-item menu-option sendHourOption" data-value="9" href="#">09:00</a></li>\
		<li><a class="dropdown-item menu-option sendHourOption" data-value="10" href="#">10:00</a></li>\
		<li><a class="dropdown-item menu-option sendHourOption" data-value="11" href="#">11:00</a></li>\
		<li><a class="dropdown-item menu-option sendHourOption" data-value="12" href="#">12:00</a></li>\
		<li><a class="dropdown-item menu-option sendHourOption" data-value="13" href="#">13:00</a></li>\
		<li><a class="dropdown-item menu-option sendHourOption" data-value="14" href="#">14:00</a></li>\
		<li><a class="dropdown-item menu-option sendHourOption" data-value="15" href="#">15:00</a></li>\
		<li><a class="dropdown-item menu-option sendHourOption" data-value="16" href="#">16:00</a></li>\
		<li><a class="dropdown-item menu-option sendHourOption" data-value="17" href="#">17:00</a></li>\
		<li><a class="dropdown-item menu-option sendHourOption" data-value="18" href="#">18:00</a></li>\
		<li><a class="dropdown-item menu-option sendHourOption" data-value="19" href="#">19:00</a></li>\
		<li><a class="dropdown-item menu-option sendHourOption" data-value="20" href="#">20:00</a></li>\
		<li><a class="dropdown-item menu-option sendHourOption" data-value="21" href="#">21:00</a></li>\
		<li><a class="dropdown-item menu-option sendHourOption" data-value="22" href="#">22:00</a></li>\
		<li><a class="dropdown-item menu-option sendHourOption" data-value="23" href="#">23:00</a></li>\
	  </ul>\
	</div>';
}