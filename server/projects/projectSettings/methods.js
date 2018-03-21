Meteor.methods({
	//Goals
	'project.updateGoal': function(projectId, goalType, goalPeriod, goalValue){
		check(projectId, String);
		check(goalType, String);
		check(goalPeriod, String);
		check(goalValue, Number);

		console.log(projectId, goalType, goalPeriod, goalValue)
		
		//calculate values for each period
		if(goalPeriod === 'daily'){
			var dailyValue = goalValue;
			var weeklyValue = Math.round(goalValue*5);
			var monthlyValue = Math.round(goalValue*21);
		}
		else if(goalPeriod === 'weekly'){
			var dailyValue = Math.round(goalValue/5);
			var weeklyValue = goalValue;
			var monthlyValue = Math.round(goalValue*4.2);
		}
		else if(goalPeriod === 'monthly'){
			var dailyValue = Math.round(goalValue/21);
			var weeklyValue = Math.round(goalValue/4.2);
			var monthlyValue = goalValue;
		}

		Projects.update({
			_id: projectId,
			'goals.type': goalType
		},{
			$set:{
				'goals.$.period': goalPeriod,
				'goals.$.dailyValue': dailyValue,
				'goals.$.weeklyValue': weeklyValue,
				'goals.$.monthlyValue': monthlyValue,
			}
		});

		console.log('-----------');
		
	},
	'updateCategorizationOption': function(projectId, value){
		check(value, Boolean);
		Projects.update(
			{
				_id: projectId
			},
			{
				$set: {
					'useForCategorization': value,
				}
			}
		);
	},
	//Keywords
	'updateProjectMatchKeywords': function(projectId, keyword, updateType){
		console.log('updateProjectMatchKeywords ' + keyword)
		switch(updateType){
			case 'push':
				Projects.update({
					_id: projectId
				},
				{
					$addToSet:{
						matchingWords: keyword
					}
				});
				break;

			case 'pop':
				Projects.update({
					_id: projectId
				},
				{
					$pull:{
						matchingWords: keyword
					}
				});
				break;
		}
	},
	'updateProjectExcludeKeywords': function(projectId, keyword, updateType){
		console.log('updateProjectExcludeKeywords ' + keyword)
		switch(updateType){
			case 'push':
				Projects.update({
					_id: projectId
				},
				{
					$addToSet:{
						excludingWords: keyword
					}
				});
				break;

			case 'pop':
				Projects.update({
					_id: projectId
				},
				{
					$pull:{
						excludingWords: keyword
					}
				});
				break;
		}
	},

	//Visibility
	'updateProjectVisibility': function(project, visibility){
		if(isAdmin(this.userId) || project.owner.indexOf(this.userId) > -1){
			console.log('can update visibility');

			Projects.update({
				_id: project._id
			},{
				$set:{
					visibility: visibility
				}
			});
		}
	},

	//Hierarchy
	'updateProjectHierarchy': function(currentProject, targetProjects, hierarchyType){
		check(currentProject, String);
		check(hierarchyType, String);

		console.log(currentProject, targetProjects, hierarchyType)

		if(typeof targetProjects !== 'string' && typeof targetProjects !== 'object'){
			throw new Meteor.Error(500, 'Error 500', 'System error updating log project!');
		}

		switch(hierarchyType){
			case 'null':

				var currentProjectObj = Projects.findOne({
					_id: currentProject
				});

				//Change hierarchy if current project is child of others
				if(currentProjectObj.hierarchy.type === 'child'){
					Projects.update({
						_id: currentProject
					},
					{
						$set:{ hierarchy: null }
					});

					var existingParentProject = Projects.findOne({
						'hierarchy.type': 'parent',
						'hierarchy.projects':{ $in: [currentProject] }
					});

					pullFromProjectsHierarchy(existingParentProject._id, currentProject);

				}
				else if(currentProjectObj.hierarchy.type === 'parent'){

				}
				else{
					throw new Meteor.Error(500, 'Error 500', 'Unset project hierarchy! [set as null]');
				}

				console.log('set '+ currentProject +' hierarchy as null');
				
				break;

			case 'child':
				console.log('set ' + currentProject + ' as child of ' + targetProjects);

				var existingParentProject = Projects.findOne({
					'hierarchy.type': 'parent',
					'hierarchy.projects':{
						$in: [currentProject]
					}
				});

				//Remove parenthood of any previous parent
				if(typeof existingParentProject !== 'undefined'){
					console.log('existingParentProject:')
					console.log(existingParentProject.name);

					pullFromProjectsHierarchy(existingParentProject._id, currentProject)

				}

				//Update NEW PARENT. If is child, override. If is parent, addToSet new project
				var newParent = Projects.findOne({
					_id: targetProjects
				});

				if(newParent.hierarchy !== null){
					//Set newParent hierarchy as parent.
					//Remove any child relation it may have
					if(newParent.hierarchy.type === 'child'){
						console.log('override newParent to be parent of new child')
						Projects.update({ _id: newParent._id, },
						{
							$set:{
								'hierarchy':{
									'type': 'parent',
									'projects': [currentProject]
								}
							}
						});

						//Remove child relation
						Projects.update({
							'hierarchy.type': 'child',
							'hierarchy.projects':{
								$in: [newParent._id]
							}
						});

					}
					else{
						console.log('addd new childs to existing parent')
						Projects.update({
							_id: newParent._id,
						},{
							$addToSet:{
								'hierarchy.projects': currentProject
							}
						});
					}
				}
				//
				else{
					console.log('addd new childs to new parent')
					Projects.update({
						_id: targetProjects
					},{
						$set:{
							'hierarchy':{
								'type': 'parent',
								'projects': [currentProject]
							}
						}
					});
				}

				//Finally, update CURRENT PROJECT as CHILD
				Projects.update({
					_id: currentProject
				},
				{
					$set:{
						hierarchy:{
							type: 'child',
							projects: [targetProjects]
						}
					}
				});

				break;

			case 'parent':
				console.log('set ' + currentProject + ' as parent of ' + targetProjects);

				var currentProjectObj = Projects.findOne({
					_id: currentProject
				});

				//Override current hierarchy
				if(currentProjectObj.hierarchy !== null){
					if(currentProjectObj.hierarchy.type === 'parent'){
						console.log('override existing parenthood');

						//First, unset parent projects from currentProject if necessary
						var existingParentProject = Projects.findOne({
							'hierarchy.type': 'parent',
							'hierarchy.projects':{
								$in: [currentProject]
							}
						});

						if(typeof existingParentProject !== 'undefined'){
							pullFromProjectsHierarchy(existingParentProject._id, currentProject);
						}

						//Second, unset parent projects from targetProjects
						existingParentProject = Projects.find({
							'hierarchy.type': 'parent',
							'hierarchy.projects':{
								$in: targetProjects
							}
						});

						if(typeof existingParentProject !== 'undefined' && existingParentProject.length > 0){
							if(existingParentProject.length > 1){
								for(var i=0; i<existingParentProject.length; i++){
									for(var j=0; j<targetProjects.length; j++){
										console.log('remove ' + targetProjects[j] + ' from ' + existingParentProject[i]);
									}	
								}
							}
							//pullFromProjectsHierarchy(existingParentProject._id, currentProject);
						}

						return;


						//Finally, update currentProject with as parent of new targetProjects
						Projects.update({
							_id: currentProject,
						},{
							$addToSet: {
								'hierarchy.projects': {
									$each: targetProjects
								}
							}
						});

					}
					else{
						console.log('convert child to parent');
					}
				}
				//Set current hierarchy
				else{

				}

				break;
		}
	}
});

pullFromProjectsHierarchy = function(projectId, projectToPull){
	Projects.update({
		_id: projectId
	},
	{
		$pull:{
			'hierarchy.projects':{
			    $in: [projectToPull]
			}
		}
	});
	var existingParentProject = Projects.findOne({
		_id: projectId
	});
	//Reset hierarchy as null if projects array is empty
	if(existingParentProject.hierarchy.projects.length === 0){
		Projects.update({
			_id: existingParentProject._id
		},
		{
			$set:{ 'hierarchy': null }
		});
	}
}