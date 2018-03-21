Meteor.methods({
	'saveProjectBrief': function(projectId, value){
		check(projectId, String);
		check(value, String);
		Projects.update(
			{
				_id: projectId
			},
			{
				$set: {
					'brief': value,
				}
			}
		);
	},
	'saveProjectStartDate': function(projectId, date){
		//console.log(projectId, date);
		Projects.update(
			{
				_id: projectId
			},
			{
				$set: {
					'startDate': date,
				}
			}
		);
	},
	'saveProjectEndDate': function(projectId, date){
		//console.log(projectId, date);
		Projects.update(
			{
				_id: projectId
			},
			{
				$set: {
					'endDate': date,
				}
			}
		);
	},
	'savePlannedTime': function(projectId, hours, newEndDate){
		check(projectId, String);
		check(hours, Number);
		var updateFields = {
			'plannedTime': hours
		};

		if(typeof newEndDate !== 'undefined'){ 
			updateFields['endDate'] = newEndDate; 
		}

		Projects.update(
			{
				_id: projectId
			},
			{
				$set: updateFields
			}
		);
	},
	'updateProject': function(projectId, updateData){
		check(projectId, String);
		var updateFields = {};

		if(typeof updateData.startDate !== 'undefined'){
			updateFields['startDate'] = updateData.startDate;
		}
		if(typeof updateData.endDate !== 'undefined'){
			updateFields['endDate'] = updateData.endDate;
		}

		console.log('I\'m inside method xD')

		Projects.update(
			{
				_id: projectId
			},
			{
				$set: updateFields
			}
		);
	},
	'project.checkDuplicateCode': function(codeName){
		var existingProject = Projects.findOne({
			type: { $exists: false },
			codeName: codeName,
			organization: Meteor.users.findOne({_id: this.userId}).profile.organization
		});
		
		if(typeof existingProject !== 'undefined')
			return true;
		
		return false;

	}
})