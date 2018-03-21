Meteor.methods({
	'createNewTasklist': function(newData){
		check(newData.name, String);
		check(newData.startDate, Date);
		check(newData.endDate, Date);
		check(newData.plannedTime, Number);
		check(newData.priority, Number);
		check(newData.priorityText, String);


		console.log('create new tasklist')

		var insertPipeline = {
			'createDate': moment().utc().toDate(),
			'name': newData.name,
			'private': false,
			'startDate': newData.startDate,
			'endDate': newData.endDate,
			'plannedTime': newData.plannedTime,
			'priority': newData.priority,
			'priorityText': newData.priorityText,
			'state': newData.state,
			'stateText': newData.stateText,
		};

		if(typeof newData.project === 'string'){
			
			var project = Projects.findOne({_id: newData.project});
			if(typeof project !== 'undefined'){
				var taskCount = parseInt(Tasklists.find({ project: project._id }).fetch().length + 1);

				insertPipeline['project'] = project._id;
				insertPipeline['projectCodeName'] = project.codeName;
				insertPipeline['taskNumber'] = taskCount;
			}
		}
		else{
			console.log('tasklist with undefined project')
		}

		if(this.userId){
			var user = Meteor.users.findOne({_id: this.userId });
			var organization = user.profile.organization;

			insertPipeline['owner'] = this.userId;
			insertPipeline['organization'] = organization;

			Tasklists.insert(insertPipeline);
		}
	},
	'updateTasklist': function(tasklistId, newData){
		check(tasklistId, String);

		console.log('tasklist modal update')

		var updatePipeline = {
			updateDate: moment().utc().toDate(),
			lastUpdateUser: this.userId
		}

		if(newData.name){
			updatePipeline['name'] = newData.name;
		}
		if(newData.startDate){
			updatePipeline['startDate'] = newData.startDate;
			console.log('start: ' + newData.startDate)
		}
		if(newData.endDate){
			updatePipeline['endDate'] = newData.endDate;
			console.log('end: ' + newData.endDate)
		}
		if(newData.plannedTime){
			updatePipeline['plannedTime'] = newData.plannedTime;
		}
		if(newData.priority){
			updatePipeline['priority'] = newData.priority;
		}
		if(newData.priorityText){
			updatePipeline['priorityText'] = newData.priorityText;
		}
		if(newData.state){
			updatePipeline['state'] = newData.state;
		}
		if(newData.stateText){
			updatePipeline['stateText'] = newData.stateText;
		}
		if(newData.project){
			updatePipeline['project'] = newData.project;
		}

		Tasklists.update({
			_id: tasklistId
		},
		{
			$set: updatePipeline
		});
	},
	'updateTasklistRange': function(item){
		check(item.group, String);
		
		var updatePipeline = {
			updateDate: moment().utc().toDate(),
			lastUpdateUser: this.userId
		}

		console.log('tasklist range update')

		if(item.updateStart){
			updatePipeline['startDate'] = item.start;
			console.log('start: ' + item.start )
		}
		if(item.updateEnd){
			updatePipeline['endDate'] = item.end;
			console.log('end: ' + item.end )
		}
		


		Tasklists.update({
			_id: item.group
		},
		{
			$set: updatePipeline
		});
	}
})