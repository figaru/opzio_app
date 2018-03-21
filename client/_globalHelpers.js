import { Template } from 'meteor/templating';

var globalHelpers = {

	'menuTitle': function(){
		return Session.get('menuTitle');
	},

	'getVerbosePeriod': function(){
		return Session.get('dateRange').verbosePeriod;
	},

	/* TIME */
	'formatDate': function(dateObj, format){ return formatDate(dateObj, format); },
	'parseHoursToString': function(hours){ return parseHoursToString(hours); },
	'timeToDate': function(startDate, endDate, suffix){ return timeToDate(startDate, endDate, suffix); },
	'getStringFromEpoch': function(epochTime, hoursOnly){ return getStringFromEpoch(epochTime, hoursOnly); },

	/* PROJECTS */

	'getAllProjects': function(){
		return Projects.find({
			type: {
				$nin: ['personal', 'unknown']
			}
		}).fetch();
	},

	'getProjectNameRWD': function(projectName){ return getProjectNameRWD(projectName); },

	'getProjectFromID': function(projectId){ return getProjectFromID(projectId); },

	'getProjectDate': function(date){ return getProjectDate(date); },
	
	'hasDeliveryDate': function(project){
		if(typeof project.deliveryDate === 'undefined'){
			return false;
		}
		return true;
	},
	'getProjectDeliveryDate': function(project){
		if(typeof project.deliveryDate === 'undefined'){
			return 'N/A';
		}
		else{
			return formatDate(project.deliveryDate, 'DD/MM/YY');
		}
	},

	'getProjectPriority': function(project){
		var project = Projects.findOne({_id: project._id});
		var priorityMap = {
			'very-high': 'Very high',
			'high': 'High',
			'normal': 'Normal',
			'low': 'Low',
			'very-low': 'Very low',
		}

		if(isAdmin(this.userId)){
			var dropdown = '<div class="dropdown modal-control" title="Priority">'
								+'<button class="btn btn-outline-primary form-control dropdown-toggle no-caret priorityMenu '+ project.priority.type +'" type="button" data-priority="'+project.priority.type+'" data-value="'+ project.priority.val +'" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'
									+'<span class="submenu-title"><i class="fa '+ project.priority.type +'"></i> '+ priorityMap[project.priority.type] +'</span>'
									+'<i class="fa fa-angle-down dropdown-carret"></i>'
								+'</button>'
								+'<ul class="dropdown-menu pull-right">'
									+'<li>'
										+'<a href="#veryHigh" class="menu-option priority dropdown-item very-high" data-value="2" data-priority="very-high"><i class="fa fa-angle-double-up"></i> Very high</a>'
									+'</li>'
									+'<li>'
										+'<a href="#high" class="menu-option priority dropdown-item high" data-value="1" data-priority="high"><i class="fa fa-angle-up"></i> High</a>'
									+'</li>'
									+'<li>'
										+'<a href="#normal" class="menu-option priority dropdown-item normal" data-value="0" data-priority="normal"><i class="fa fa-minus"></i> Normal</a>'
									+'</li>'
									+'<li>'
										+'<a href="#low" class="menu-option priority dropdown-item low" data-value="-1" data-priority="low"><i class="fa fa-angle-down"></i> Low</a>'
									+'</li>'
									+'<li>'
										+'<a href="#veryLow" class="menu-option priority dropdown-item very-low" data-value="-2" data-priority="very-low"><i class="fa fa-angle-double-down"></i> Very Low</a>'
									+'</li>'
								+'</ul>'
							+'</div>';

			return dropdown;

		}
		else{
			return '<span class="btn no-hover '+ project.priority.type +'"><i class="fa '+ project.priority.type +'"></i> '+ priorityMap[project.priority.type] +'</span>';
		}
	},

	'getProjectState': function(project){
		var project = Projects.findOne({_id: project._id});
		var stateMap = {
			'initiate': 'Initiate',
			'plan': 'Planning',
			'execute': 'Executing',
			'maintain': 'Maintaining',
			'delivered': 'Delivered',
			'paused': 'Paused',
			'dropped': 'Dropped',
		}

		if(isAdmin(this.userId)){
			var dropdown = '<div class="dropdown modal-control" title="State">'
								+'<button class="btn btn-outline-primary form-control dropdown-toggle no-caret projectState '+ project.state.type +'" type="button" data-state="'+project.state.type+'" data-value="'+ project.state.val +'" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'
									+'<span class="submenu-title"><i class="fa '+ project.state.type +'"></i> '+ stateMap[project.state.type] +'</span>'
									+'<i class="fa fa-angle-down dropdown-carret"></i>'
								+'</button>'
								+'<ul class="dropdown-menu pull-right">'
									+'<li>'
										+'<a href="#initiate" class="menu-option dropdown-item state initiate" data-value="0" data-state="initiate"><i class="fa fa-circle-o"></i> Initiate</a>'
									+'</li>'
									+'<li>'
										+'<a href="#plan" class="menu-option dropdown-item state plan" data-value="1" data-state="plan"><i class="fa fa-flask"></i> Planning</a>'
									+'</li>'
									+'<li>'
										+'<a href="#execute" class="menu-option dropdown-item state execute" data-value="2" data-state="execute"><i class="fa fa-dot-circle-o"></i> Executing</a>'
									+'</li>'
									+'<li>'
										+'<a href="#maintain" class="menu-option dropdown-item state maintain" data-value="3" data-state="maintain"><i class="fa fa-circle"></i> Maintaining</a>'
									+'</li>'
									+'<li>'
										+'<a href="#delivered" class="menu-option dropdown-item state delivered" data-value="4" data-state="delivered"><i class="fa fa-check-circle"></i> Delivered</a>'
									+'</li>'
									+'<li>'
										+'<a href="#paused" class="menu-option dropdown-item state paused" data-value="5" data-state="paused"><i class="fa fa-circle-o-notch"></i> Paused</a>'
									+'</li>'
									+'<li>'
										+'<a href="#dropped" class="menu-option dropdown-item state dropped" data-value="6" data-state="dropped"><i class="fa fa-thumbs-down"></i> Dropped</a>'
									+'</li>'
								+'</ul>'
							+'</div>';

			return dropdown;

		}
		else{
			return '<span class="btn no-hover '+ project.state.type +'"><i class="fa '+ project.state.type +'"></i> '+ stateMap[project.state.type] +'</span>';
		}
	},

	'getProjectTeam': function(project){
		if(project.team.length > 0){
			var teamEl = [];
			_.each(project.team, function(user, key){
				teamEl.push('<a href=\"/user/'+ user.user +'#dashboard\">'+ getUserShortName(user.user)+'</a>');
			});
			teamEl = teamEl.join('');

			var response = "<i class='fa fa-info-cirle tooltipster' title=\'"+teamEl+"\'>" + project.team.length + "</i>";

			return response;
		}
		else{
			return '0';
		}
	},

	'currentProject': function(date){ return Session.get('currentProject'); },

	/* USERS */

	'userExists': function(userId){ 
		if(typeof Meteor.users.findOne({_id: userId}) !== 'undefined'){
			return true;
		}
		return false;
	},

	'getUserInitials': function(userId){ return getUserInitials(userId) },

	'getUserShortName': function(userId){ return getUserShortName(userId); },
	
	'getUserFullName': function(userId){ return getUserFullName(userId); },
	
	'isAdmin': function(userId){
		if(typeof userId !== 'undefined'){
			return isAdmin(userId);
		}
		else{
			return isAdmin(Meteor.userId());
		}
	},

	'getUserBaseHourRate': function(userId){
		return Meteor.users.findOne({_id:userId}).baseHourRate;
	},

	/* PLANS */

	'isFreePlan': function(){ return isFreePlan(); },

	'hasCreatedProjects': function(){ return hasCreatedProjects(); },

	'hasInvitedUsers': function(){
		hasCompletedMainIntro();
		if(Signups.find().fetch().length > 0){
			return true;
		}
		else{
			return false;
		}
	},

	'reachedProjectsLimit': function(){
		hasCompletedMainIntro();
		if(typeof Meteor.user() !== 'undefined'){
			
			var projects = Projects.find({
				type: {
					$nin: ['personal', 'unknown']
				}
			}).fetch();

			var orgProfile = OrganizationProfile.findOne({
				organization: Meteor.user().profile.organization
			});

			if(typeof orgProfile !== 'undefined'){
				if(projects.length === orgProfile.plan.projectCap){
					return true;
				}

				return false;
			}
			else{
				return false;
			}

		}
	},

	'reachedUsersLimit': function(){
		if(typeof Meteor.user() !== 'undefined'){
			
			var signups = Signups.find({
				organization: Meteor.user().profile.organization,
				revoked: false
			}).fetch();

			var orgProfile = OrganizationProfile.findOne({
				organization: Meteor.user().profile.organization
			});

			if(typeof orgProfile !== 'undefined'){
				if(signups.length === orgProfile.plan.usersCap){
					return true;
				}
				
				return false;
			}
			else{
				return false;
			}

		}
	},

	/* STRING */
	'truncString': function(s, n, r){ return truncString(s, n, r); },
	
	'capitalizeFirstLetter': function(s){ return capitalizeFirstLetter(s); },

	/* OTHERS */

	'getRandomColor': function(){ return getRandColor(); },
	'openMenu': function(){ return Session.get('openMenu'); }
}

_.each(globalHelpers, function(value, key){
	Template.registerHelper(key, value);
});