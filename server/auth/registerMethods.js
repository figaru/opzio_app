Meteor.methods({
	//For teams, free account
	'auth.registerUserAndOrganization': function(firstName, lastName, email, password, organization, planType, userDate){
		console.log('register User and Organization ' + firstName +' '+ lastName +' '+ email +' '+  organization);

		check(firstName, String);
		check(lastName, String);
		check(email, String);
		check(password, String);
		check(organization, String);
		check(planType, String);


		if(planType !== 'single' && planType !== 'lite' && planType !== 'medium' && planType !== 'large'){
			throw new Meteor.Error(500, 'Invalid plan type.');
		}

		//Create new organization
		var newOrgId = createOrganization(organization);
		var orgProfile = createOrganizationProfile(newOrgId, planType);

		var userId = Accounts.createUser({
			email: email, 
			password : password,
			active: false,
			profile: {
				'token': generateGuid(),
				'firstName':firstName,
				'lastName': lastName,
				'organization': newOrgId,
				'hasTracker': false,
			},
		});

		//Set user as active
		Meteor.users.update({ _id: userId },
		{
			$set:{
				active:true,
				trackers: [],
				mainIntro:{
					show: true,
					completed: false,
					installPlugins: false,
					createProjects: false,
					inviteTeam: false,
				},
				//Whether or not to display joyrides for the several dashboards/interfaces
				joyrides: {
					userDashboard: true,
					userSettings: true,
					plugins: true,
					timesheet: true,
					projectCreation: true,
				},
				workableWeekDays: [ 1, 2, 3, 4, 5 ],
			    workStartHour: 9,
			    workEndHour: 18,
			    workableHours: [ 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ],
			    baseHourRate: 0,
			    notificationOptions: [ 
					{
						name: "userDailyReportOptions",
						label: "Daily Report",
						userEditable: true,
						active: true,
						sendEmail: true,
						includeWeekends: false,
						scheduledHour: userDate
					}, 
					{
						name: "userWeeklyReportOptions",
						label: "Weekly Report",
						userEditable: true,
						active: true,
						sendEmail: true,
						sendDay: "friday",
						scheduledHour: userDate
					}, 
					{
						name: "userMonthlyReportOptions",
						label: "Monthly Report",
						userEditable: true,
						active: true,
						sendEmail: true,
						scheduledHour: userDate
					}
				]
			}
		});

		var userObj = Meteor.users.findOne({_id: userId });

		//Create initial domain rules for new organization 
		//Meteor.call('users.createDefaultDomainRules', userObj);

		//Create user's personal project
		Meteor.call('users.createUserPersonalProject', userId, newOrgId);

		//Send verification email
		Meteor.defer(function(){
			Accounts.sendVerificationEmail(userId);
		});

		//Perform remote call to initiate user queues
		apiWorker.call('user.initUserQueues', userId, function(err, data){
			if(err){
				console.log('REMOTE ERR: Error initiating queues for user ' + userId);
			}
			else{
				console.log('REMOTE OK: Created queues for user ' + userId);
			}
		});

		//Check methods in server/permissions
		//Meteor.call('checkOrSetSystemAdmin', userId);

		Meteor.call('addUserToRole', userId, 'admin');

		//Create a new collection for the user's disclaimers dismissed states
		//Meteor.call('createDisclaimerProfile', userId);

		//Set newly created user as admin for newly created organization
		Meteor.call('setOrganizationAdmin', userId, newOrgId);

		//Set newly created user as admin for newly created organization
		Meteor.call('setProfileAdmin', userId, newOrgId);

		//Create a default project for the organization (fetches unknown time sources)
		Meteor.call('createDefaultProject', userId, newOrgId);

		//Update system user metric
		//Meteor.call('s_addUser');

		Meteor.defer(function(){
			try{
				Email.send({
					to: 'lawbraun.almeida@gmail.com',
					from: 'info@opz.io',
					subject: 'New Registration',
					html: 'A user REGISTERED on '+ moment().format('DD @ HH:mm') +' with the email ' + email
				});
			}
			catch(err){
				console.log('ERR: error sending admin register email!')
			}
		});
		console.log('registered ' + email);
		return newOrgId;

	},
	'checkForExistingEmail': function(email){
		check(email, String);
		var user = Meteor.users.findOne({
			'active': true,
			'emails.address': email
		});

		if(typeof user !== 'undefined'){
			return true;
		}
		else{
			return false;
		}
	},

	//For single, free account
	'auth.registerSingleUser': function(firstName, lastName, email, password, userDate){
		console.log('register single user ' + firstName +' '+ lastName +' '+ email);

		check(firstName, String);
		check(lastName, String);
		check(email, String);
		check(password, String);

		//For single user, organization is himself. If he upgrades to a team he will change his organization info
		var userOrgName = firstName + ' ' + lastName;
		//var newOrgId = createOrganization(userOrgName);
		//var orgProfile = createOrganizationProfile(newOrgId, 'single');

		var userId = Accounts.createUser({
			email: email, 
			password : password,
			active: false,
			profile: {
				'token': generateGuid(),
				'firstName':firstName,
				'lastName': lastName,
				'organization': undefined,
				'hasTracker': false,
			},
		});

		//Set user as active
		Meteor.users.update({ _id: userId },
		{
			$set:{
				active:true,
				trackers: [],
				mainIntro:{
					show: true,
					completed: false,
					installPlugins: false,
					createProjects: false,
					inviteTeam: false,
				},
				//Whether or not to display joyrides for the several dashboards/interfaces
				joyrides: {
					userDashboard: true,
					userSettings: true,
					plugins: true,
					timesheet: true,
					projectCreation: true,
				},
				workableWeekDays: [ 1, 2, 3, 4, 5 ],
			    workStartHour: 9,
			    workEndHour: 18,
			    workableHours: [ 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ],
			    baseHourRate: 0,
			    notificationOptions: [ 
					{
						name: "userDailyReportOptions",
						label: "Daily Report",
						userEditable: true,
						active: true,
						sendEmail: true,
						includeWeekends: false,
						scheduledHour: userDate,
						lastSendDate: 0,
					}, 
					{
						name: "userWeeklyReportOptions",
						label: "Weekly Report",
						userEditable: true,
						active: true,
						sendEmail: true,
						sendDay: "friday",
						scheduledHour: userDate,
						lastSendDate: 0,
					}, 
					{
						name: "userMonthlyReportOptions",
						label: "Monthly Report",
						userEditable: true,
						active: true,
						sendEmail: true,
						scheduledHour: userDate,
						lastSendDate: 0,
					}
				]
			}
		});

		var userObj = Meteor.users.findOne({_id: userId });

		//Create initial domain rules for new organization 
		//Meteor.call('users.createDefaultDomainRules', userObj);

		//Create user's personal project
		Meteor.call('users.createUserPersonalProject', userId, newOrgId);

		//Send verification email
		Meteor.defer(function(){
			Accounts.sendVerificationEmail(userId);
		});

		//Perform remote call to initiate user queues
		apiWorker.call('user.initUserQueues', userId, function(err, data){
			if(err){
				console.log('REMOTE ERR: Error initiating queues for user ' + userId);
			}
			else{
				console.log('REMOTE OK: Created queues for user ' + userId);
			}
		});

		//Check methods in server/permissions
		//Meteor.call('checkOrSetSystemAdmin', userId);

		Meteor.call('addUserToRole', userId, 'admin');

		//Create a new collection for the user's disclaimers dismissed states
		//Meteor.call('createDisclaimerProfile', userId);

		//Set newly created user as admin for newly created organization
		Meteor.call('setOrganizationAdmin', userId, newOrgId);

		//Set newly created user as admin for newly created organization
		Meteor.call('setProfileAdmin', userId, newOrgId);

		//Create a default project for the organization (fetches unknown time sources)
		Meteor.call('createDefaultProject', userId, newOrgId);

		//Update system user metric
		//Meteor.call('s_addUser');

		Meteor.defer(function(){
			try{
				Email.send({
					to: 'lawbraun.almeida@gmail.com',
					from: 'info@opz.io',
					subject: 'New Registration',
					html: 'User signed up on '+ moment().format('DD @ HH:mm') +'<br>Name: ' + firstName +' '+ lastName +'<br>Email: ' + email
				});
			}
			catch(err){
				console.log('ERR: error sending admin register email!')
			}
		});

		return userId;
	},

	//Registers a user who received an invite link
	'auth.registerInvitedUser': function(params){
		check(params.lastName, String);
		check(params.firstName, String);
		check(params.email, String);
		check(params.password, String);
		check(params.orgId, String);
		check(params.inviteToken, String);

		var signup = Signups.findOne({
			inviteToken: params.inviteToken
		});

		var role = signup.role;

		Signups.update({
			_id:signup._id
		},{
			$set:{
				used: true
			}
		});

		var userId = Accounts.createUser({
			email: params.email, 
			password : params.password,
			profile: {
				'token': generateGuid(),
				'firstName':params.firstName,
				'lastName': params.lastName,
				'organization': params.orgId,
				'hasTracker': false,
				'displayJoyride': true,
				'abortedJoyride': false,
			},
		});

		Meteor.users.update({ _id: userId },
		{
			$set:{
				active:true,
				trackers: [],
				//Whether or not to display joyrides for the several dashboards/interfaces
				joyrides: {
					userDashboard: true,
					userSettings: true,
					plugins: true,
					timesheet: true,
					projectCreation: true,
				},
				//Store main intro only to specify this user (invited users) won't see it (only first user ever sees it)
				mainIntro:{
					show: false,
					completed: true,
					installPlugins: false,
					createProjects: false,
					inviteTeam: false,
				},
				roles: [role],
				workableWeekDays: [ 1, 2, 3, 4, 5 ],
			    workStartHour: 9,
			    workEndHour: 18,
			    workableHours: [ 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ],
			    baseHourRate: 0,
				notificationOptions: [ 
					{
						name: "userDailyReportOptions",
						label: "Daily Report",
						userEditable: true,
						active: true,
						sendEmail: true,
						includeWeekends: false,
						scheduledHour: params.userDate,
						lastSendDate: 0,
					}, 
					{
						name: "userWeeklyReportOptions",
						label: "Weekly Report",
						userEditable: true,
						active: true,
						sendEmail: true,
						sendDay: "friday",
						scheduledHour: params.userDate,
						lastSendDate: 0,
					}, 
					{
						name: "userMonthlyReportOptions",
						label: "Monthly Report",
						userEditable: true,
						active: true,
						sendEmail: true,
						scheduledHour: params.userDate,
						lastSendDate: 0,
					}
				]
			}
		});

		//Set last updat time to organization profile
		OrganizationProfile.update({
			organization: params.orgId
		},{
			$set:{
				'updateDate': new Date()
			}
		});

		//Create user's personal project
		Meteor.call('users.createUserPersonalProject', userId, params.orgId);

		//Perform remote call to initiate user queues
		apiWorker.call('user.initUserQueues', userId, function(err, data){
			if(err){
				console.log('REMOTE ERR: Error initiating queues for user ' + userId);
			}
			else{
				console.log('REMOTE OK: Created queues for user ' + userId);
			}
		});

		//Send verification email
		/*
		Meteor.setTimeout(function() {
			Accounts.sendVerificationEmail(userId);
		}, 10 * 10000);
		*/

		return params.orgId;
	},
});