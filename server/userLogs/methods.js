Meteor.methods({
	'changeLogValidation': function(updateData){
		this.unblock();
		check(updateData.logId, String);
		check(updateData.valid, Boolean);
		updateData.user = this.userId;

		console.log('[LOGS] changeLogValidation for ' + this.userId)

		var logId = updateData.logId;
		var valid = updateData.valid;
		var private = updateData.private;
		var matchedProject = updateData.matchedProject;
		var userProject = updateData.userProject;

		//First update the userLog as we want
		//Then send it for training.
		//A) Only train if set as valid.

		var logObj = UserLogs.findOne({_id:logId});

		try{
			if(private === 'true'){
				updateData.private = true;
			}
			else{ updateData.private = false; }

			if(valid){
				//If user didn't change project (means system got it right) , set it the same a matchedProject
				//apiWorker then will perform update depending if these are the same or not
				if(userProject === null || typeof(userProject) === 'undefined'){
					//console.log('log hasnt been corrected -> set userProject same as system match');
					updateData.userProject = updateData.matchedProject;
				}
				else{
					//console.log('has userProject')
				}
			}
			else{
				//console.log('set log as Invalid')
			}

			/**
				PERFORM REMOTE CALL TO TRAIN CLASSIFIER WITH DATA
				Only train if userLog is not code
			**/
			if(logObj.type !== 'code'){
				//console.log('Performing remote call....')

				if(!logObj.usedForTraining){
					//console.log('REMOTE TRAINING!')
					apiWorker.call('trainProjectsRemoteCall', updateData, function(err, data){
						if(err){
							console.log('REMOTE: Error training log ' + updateData.logId + ' for user ' + this.userId);
						}
					});
				}

			}
			else{
				var project = Projects.findOne({
					_id: updateData.userProject
				});

				UserLogs.update({
					_id: logObj._id
				},{
					$set:{
						private: updateData.private,
						validated: valid,
						project:{
							_id: project._id,
							name: project.name,
							score: 1,
							matchType: 'user_choice',
						}
					}
				});
			}
		}
		catch(err){
			console.log('System error updating log project!')
			console.log(err)
			//throw new Meteor.Error(500, 'Error 500', 'System error updating log project!');
		}

		return valid;
	},
	//Updates the userLog and calls a remote (on opz_api) method to train Bayes classifier
	'updateLogProject': function(updateData){
		this.unblock();
		//console.log('------- In updateLogProject -------');

		console.log('[LOGS]  updateLogProject for ' + this.userId)

		check(updateData.logId, String);

		var log = UserLogs.findOne({
			_id: updateData.logId
		});

		if(this.userId !== log.user){
			if(isRoot(this.userId) === false){
				console.log('user has no authority to update log');
				return;
			}
		}
		//console.log('user can update log');

		var setPipeline = {};

		//console.log(updateData);

		//Understand which update types are within updateData and check if needs changes
		if('project' in updateData){
			//console.log('check to update project and validate');
			check(updateData.project, String);

			if(typeof log.project !== 'undefined'){
				if(log.project._id !== updateData.project){
					//console.log('Not the same project, change project and validate');

					//Store the project chosen by user
					var project = Projects.findOne({ _id: updateData.project });
					setPipeline['project'] = {
						_id: project._id,
						name: project.name,
						score: 1,
						matchType: 'user_choice',
					}

					//Stores the project the system matched bu was replaced by user validation
					setPipeline['electedProject'] = log.project;

					setPipeline['validated'] = true;
				}
				else{
					//console.log('Is same project, simply validate');
					setPipeline['validated'] = true;
				}
			}
			else{
				//console.log('Project hasn\'t even been matched, set project and validate');

				var project = Projects.findOne({ _id: updateData.project });
				setPipeline['project'] = {
					_id: project._id,
					name: project.name,
					score: 1,
					matchType: 'user_choice',
				}

				setPipeline['electedProject'] = null;

				setPipeline['validated'] = true;
			}

		}

		if('category' in updateData){
			//console.log('check to update category');
			check(updateData.category, String);

			if(typeof log.category !== 'undefined'){
				if(log.category._id !== updateData.category){
					//console.log('Not the same category, change it');
					
					var newCategory = DomainCategories.findOne({_id:updateData.category});
					
					setPipeline['category'] = {
						_id: newCategory._id,
						category: newCategory.category,
						value: newCategory.value,
						label: newCategory.label,
						private: newCategory.private 
					}

				}
			}
			else{
				//console.log('Category hasn\'t been set, set it and save');

				var newCategory = DomainCategories.findOne({_id:updateData.category});
				
				setPipeline['category'] = {
					_id: newCategory._id,
					category: newCategory.category,
					value: newCategory.value,
					label: newCategory.label,
					private: newCategory.private 
				}
			}
		}

		//Finally, update log with setPipeline
		UserLogs.update({
			_id: log._id
		},{
			$set: setPipeline
		});

		if('validated' in setPipeline){
			if(log.type !== 'code'){
				//console.log('Performing remote call for '+ log._id +'....');
				log = UserLogs.findOne({_id: log._id });

				try{
					apiWorker.call('trainProjectsRemoteCall', log);	
				}
				catch(err){
					throw new Meteor.Error(500, 'Error 500', 'System error calling remote training method!');
				}
				
			}
		}
		//console.log('-----------')
	},
	'userLogs.updateValidation': function(logId, validated){
		this.unblock();

		console.log('[LOGS] validations for ' + this.userId)

		check(logId, String);
		check(validated, Boolean);

		UserLogs.update({
			'_id': logId,
			user: this.userId
		},{
			$set:{
				'validated': validated
			}
		});
	},
	'userLogs.updatePrivacy': function(logId, private){
		this.unblock();

		console.log('[LOGS] updatePrivacy for ' + this.userId)

		console.log(private)

		check(logId, String);
		check(private, Boolean);

		UserLogs.update({
			'_id': logId,
			user: this.userId
		},{
			$set:{
				'private': private
			}
		});
	},
	'userLogs.remove': function(logId){
		check(logId, String);

		console.log('[LOGS] remove for ' + this.userId)

		var userLog = UserLogs.findOne({
			_id: logId
		});

		if(userLog.user === this.userId || isRoot(this.userId)){
			//Remove specific rules as well
			DomainRules.remove({
				user: this.userId,
				uri: userLog.uri,
			    domain: userLog.domain,
				default: false
			});

			UserLogs.remove({
				_id: logId
			});
		}
		else{
			throw new Meteor.Error(500, 'No permission to delete log.');
		}
	},
	//Updates every userLog with new hourRate (only for non-billed logs)
	'userLogs.updateBillingOption': function(project, applyHourValuePerTeam){
		check(project, Object);
		check(applyHourValuePerTeam, String);
		//Check if we want to apply a commong project hour rate to logs or
		//apply each team-member's individual hour rate to the logs

		//Get project again as hour rate may have changed
		var projectObj = Projects.findOne({_id: project._id });

		//	If apply single project rate for all team:
		//	1) Get and update hourRate of every non-billed userLog matching given project, regardless of user
		if(applyHourValuePerTeam === 'true'){
			console.log('same hour rate for all members of the project');
			
			UserLogs.update({
				billed: false,
				'project._id': project._id,
			},
			{
				$set:{
					hourRate: parseFloat(projectObj.hourValue)
				}
			},
			{
				multi: true
			});
		}
		//	A-> If hour rate per user:
		//	1) Iterate every team-member of the project
		//	2) Get and update hourRate of every non-billed userLog of current user for given project
		else{
			console.log('individual members hour rate');
			for(var i=0; i<projectObj.team.length; i++){
				//Get user to retrieve individual user hour rate
				var userObj = Meteor.users.findOne({ _id: projectObj.team[i].user });

				//Check if there's a specific hour rate setup for this user in this project
				if(typeof projectObj.team[i].hourRate !== 'undefined'){
					var userHourRate = projectObj.team[i].hourRate;
				}
				//Make sure user has an hour rate, otherwise keep project's hour rate
				else if(typeof userObj.baseHourRate !== 'undefined'){
					var userHourRate = userObj.baseHourRate;
				}
				else{
					var userHourRate = projectObj.hourValue;
				}

				//Update user logs
				UserLogs.update({
					user: userObj._id,
					'project._id': projectObj._id,
					billed: false,
				},
				{
					$set:{
						hourRate: parseFloat(userHourRate)
					}
				},
				{
					multi: true
				});

			}
		}
	}
});