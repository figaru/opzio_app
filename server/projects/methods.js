Meteor.methods({
	//Util method to minify project names into a single code (done by minifyProjectName)
	'minifyProjectName': function(project){
		//console.log('minifyProjectName')
		this.unblock();
		var organization = Meteor.users.findOne({_id:this.userId}).profile.organization;

		var projectName = minifyProjectName(project, organization, false, 0);

		
		if(projectName.duplicate){
			while(projectName.duplicate && projectName.variationCount < 20){
				projectName = minifyProjectName(project, organization, true, projectName.variationCount)	
			}
		}
		
		return projectName;
	},
	'createNewProject': function(data){
		check(data.name, String);
		check(data.codeName, String);
		check(data.owner, [String]);
		check(data.team, [Object]);
		check(data.plannedTime, Number);
		check(data.priority, Number);
		check(data.priorityText, String);
		check(data.state, Number);
		check(data.stateText, String);
		check(data.visibility, Number);
		// check(data.applyHourValuePerTeam, Boolean);
		// check(data.useForCategorization, Boolean);
		if(typeof data.startDate !== 'undefined'){
			check(data.startDate, Date);
		}
		if(typeof data.endDate !== 'undefined'){
			check(data.endDate, Date);
		}

		var user = Meteor.users.findOne({_id:data.owner[0]});
		var organization = user.profile.organization;


		check(organization, String);

		var ownerId = data.owner[0];

		//Check for duplicates
		var existingProject = Projects.findOne({
			name: data.name
		});
		if(typeof existingProject !== 'undefined'){
			throw new Meteor.Error('duplicate', "A project with the same name already exists.");
		}

		var existingProject = Projects.findOne({
			codeName: data.codeName
		});
		if(typeof existingProject !== 'undefined'){
			throw new Meteor.Error('duplicate', "A project with the same code name already exists.");
		}

		var newProject = Projects.insert({
			//Info
			"name": data.name,
			"codeName" : data.codeName,
			"brief": data.brief,
			"organization": organization,
			"owner": data.owner,
			"team": data.team,
			"priority": {
			   "val": data.priority,
			   "type": data.priorityText
			},
			"state" : {
			   "val" : data.state,
			   "type" : data.stateText
			},
			"active": true,

			//Time & dates
			"plannedTime": data.plannedTime,
			"totalTime": 0,
			"createDate" : data.startDate,
			"deliveryDate": data.endDate,
			"systemCreateDate" : new Date(),

			//Updates
			"updateDate" : new Date(),
			"lastUser" : data.owner[0],
			"lastUsers" : {
				ownerId: new Date()
			},


			//Financially
			"hasSetupBudget": false,
			"budget": data.budget,
			"budgetType": data.budgetType,
			"hourValue": data.hourValue,
			"applyHourValuePerTeam": data.applyHourValuePerTeam,

			//Visibility
			"visibility": data.visibility,
			"visibility": data.visibility,
			
			//Categorization
			"useForCategorization" : data.useForCategorization,
			"gitName": data.gitName,
			"trained" : false,
			"classProbability" : [],
			"words" : [],
			"wordStats" : {
			   "totalWordCount" : 0,
			   "uniqueWordCount" : 0,
			   "documents" : 0
			},
			"goals": [
				{
					active: true,
					type: 'time',
					period: 'daily',
					dailyValue: 8, //Hours
					weeklyValue: 40,
					monthlyValue: 160,
				},
				{
					active: false,
					type: 'financial',
					period: 'daily',
					dailyValue: 100, //Currency
					weeklyValue: 500,
					monthlyValue: 2000,
				},
			],
			"matchingWords": data.matchWords,
			"excludingWords": data.excludeWords,
		});

		apiWorker.call('timeline.addEvent', Meteor.userId(), 'project_create', 'New project created', 'info', '"'+data.name+'" (id: ' + newProject+')');

		return newProject;
	},

	'projects.quickProjectCreate': function(data){
		
		this.unblock();

		if(hasReachedProjectsLimit()){
			console.log('reached project limit')
			return {
				'error': true,
				'reason': data.name +' couldn\'t be created, you\'ve reached your project limits.'
			}
		}

		check(data.name, String);
		check(data.startDate, Date);
		check(data.endDate, Date);
		check(data.owner, [String]);
		check(data.team, [Object]);
		check(data.plannedTime, Number);
		check(data.priority, Number);
		check(data.priorityText, String);
		check(data.state, Number);
		check(data.stateText, String);
		check(data.visibility, Number);
		check(data.budgetType, String);
		check(data.applyHourValuePerTeam, Boolean);
		check(data.useForCategorization, Boolean);

		var user = Meteor.users.findOne({_id:data.owner[0]});
		var organization = user.profile.organization;

		check(organization, String);

		var codeName = minifyProjectName(data.name, organization, false, 0);

		if(codeName.duplicate){
			while(codeName.duplicate && codeName.variationCount < 20){
				codeName = minifyProjectName(data.name, organization, true, codeName.variationCount)	
			}
		}

		console.log('create with codeName ' + codeName.codeName);

		var newProject = Projects.insert({
			//Info
			"name": data.name,
			"codeName" : codeName.codeName,
			"brief": data.brief,
			"organization": organization,
			"owner": data.owner,
			"team": data.team,
			"priority": {
			   "val": data.priority,
			   "type": data.priorityText
			},
			"state" : {
			   "val" : data.state,
			   "type" : data.stateText
			},

			//Time
			"plannedTime": data.plannedTime,
			"totalTime": 0,
			"createDate" : data.startDate,
			"deliveryDate": data.endDate,

			//Updates
			"updateDate" : new Date(),
			"lastUser" : data.owner[0],

			//Financially
			"hasSetupBudget": false,
			"budget": data.budget,
			"budgetType": data.budgetType,
			"hourValue": data.hourValue,
			"applyHourValuePerTeam": data.applyHourValuePerTeam,

			//Visibility
			"visibility": data.visibility,
			
			//Categorization
			"useForCategorization" : data.useForCategorization,
			"gitName": data.gitName,
			"trained" : false,
			"classProbability" : [],
			"words" : [],
			"wordStats" : {
			   "totalWordCount" : 0,
			   "uniqueWordCount" : 0,
			   "documents" : 0
			},
			"matchingWords": data.matchWords,
			"excludingWords": data.excludeWords,

			//Goals
			"goals": [
				{
					active: true,
					type: 'time',
					period: 'daily',
					dailyValue: 8, //Hours
					weeklyValue: 40,
					monthlyValue: 160,
				},
				{
					active: false,
					type: 'financial',
					period: 'daily',
					dailyValue: 100, //Currency
					weeklyValue: 500,
					monthlyValue: 2000,
				},
			],
		});

		console.log('created project ' + data.name + ' - ' + newProject)
	},

	'projects.updateProjectState': function(projectId, state){
		if(!this.userId){ return; }

		if(isAdmin(this.useId)){
			check(projectId, String);
			check(state, Number);

			var stateMap = {
				0: 'initiate',
				1: 'plan',
				2: 'execute',
				3: 'maintain',
				4: 'delivered',
				5: 'paused',
				6: 'dropped',
			};

			var stateObj = {
				"val" : state,
				"type" : stateMap[state]
			};
			
			Projects.update({
				_id: projectId
			},{
				$set:{
					state: stateObj
				}
			});
		}
	},
	'projects.updateProjectPriority': function(projectId, priority){
		if(!this.userId){ return; }

		if(isAdmin(this.useId)){
			check(projectId, String);
			check(priority, String);

			var priorityMap = {
				'2': 'very-high',
				'1': 'high',
				'0': 'normal',
				'-1': 'low',
				'-2': 'very-low',
			}

			var priorityObj = {
				"val" : parseInt(priority),
				"type" : priorityMap[priority]
			};
			
			Projects.update({
				_id: projectId
			},{
				$set:{
					priority: priorityObj
				}
			});
		}
	}
});