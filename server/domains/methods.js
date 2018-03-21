Meteor.methods({
	'domains.getDomainRules': function(query){
		//console.log(query);
		this.unblock();

		var existingRules = DomainRules.aggregate([
		{
			$match:{
				'user': this.userId,
				$or:[
					{
						$and:[
							{'uri': query.uri},
							{'pageTitle': query.pageTitle}
						]
					},
					{
						$and:[
							{'domain': query.domain},
							{'default': true}
						]
					},
				]
			}
		},
		{
			$group:{
				_id: null,
				ids: {
					$addToSet: '$_id'
				}
			}
		}
		])[0];

		if(typeof existingRules !== 'undefined'){
			return DomainRules.find({
				_id:{
					$in: existingRules.ids
				}
			},
			{
				sort:{
					default: -1
				}
			}).fetch();
		}
		else{
			return [];
		}
	},
	'domains.getDefaultDomainRules': function(){
		var existingRules = DomainRules.find({
			'user': this.userId,
			'default': true
		}).fetch();

		return existingRules;

	},
	'domains.saveDomainRule': function(changeData){
		
		this.unblock();

		check(changeData['ruleId'], String);

		console.log(changeData);

		var currentRule = DomainRules.findOne({
			_id: changeData['ruleId'],
		});

		var updatePipeline = {};

		var currentClassifyRules = currentRule.classifyRules;

		//Check what updates to perform
		if(typeof changeData['matchRules'] !== 'undefined'){
			console.log('change matchRules');
			var currentMatchRules = currentRule.matchRules;

			console.log(changeData['matchRules'])

			//Set all match types to false
			currentMatchRules['exactMatch'] = false;
			currentMatchRules['fullUri'] = false;
			currentMatchRules['titleOnly'] = false;
			currentMatchRules['domainOnly'] = false;

			//Set the new matchType a true (only one can be set as true at any point)
			currentMatchRules[changeData['matchRules']] = true;

			updatePipeline['matchRules'] = currentMatchRules;
		}

		if(typeof changeData['categoryId'] !== 'undefined'){
			console.log('change category');
			
			updatePipeline['category'] = DomainCategories.findOne({ _id: changeData['categoryId'] });

			currentClassifyRules.setCategory = true;
		}

		if(typeof changeData['project'] !== 'undefined'){
			console.log('change project');

			if(changeData['project'] === 'auto' || changeData['project'] === null){
				console.log('project set to auto');
				currentClassifyRules.setProject = false;
				updatePipeline['project'] = null;
			}
			else{
				var projectObj = Projects.findOne({
					_id: changeData['project']
				});
				var project = {
					_id: projectObj._id,
					name: projectObj.name
				}

				currentClassifyRules.setProject = true;
				updatePipeline['project'] = project;
			}
		}
		else{
			currentClassifyRules.setProject = false;
		}

		if(typeof changeData['validated'] !== 'undefined'){
			console.log('change validation');
			currentClassifyRules.setValidated = true;
			if(changeData['validated'] === 'true'){
				updatePipeline['validated'] = true;
			}
			else{
				updatePipeline['validated'] = false;
			}
		}

		if(typeof changeData['privacy'] !== 'undefined'){
			console.log('change privacy');
			currentClassifyRules.setPrivacy = true;
			if(changeData['private'] === 'true'){
				updatePipeline['private'] = true;
			}
			else{
				updatePipeline['private'] = false;
			}
		}

		updatePipeline['classifyRules'] = currentClassifyRules;

		updatePipeline['updateDate'] = new Date();

		console.log('updatePipeline')
		console.log(updatePipeline)

		//Update according to updatePipeline
		DomainRules.update({
			_id: changeData['ruleId'],
		},{
			$set: updatePipeline
		});
	},
	'domains.updateDomainRule': function(ruleId, updateType, updateData){
		check(ruleId, String);
		check(updateType, String);

		console.log(ruleId, updateType, updateData)

		var currentRule = DomainRules.findOne({
			_id: ruleId
		});

		switch(updateType){
			case 'project':

				var classifyRules = currentRule.classifyRules;

				console.log(typeof updateData)

				if(updateData !== null && updateData !== 'null'){
					classifyRules['setProject'] = true;

					var project = Projects.findOne({
						_id: updateData
					});

					project = {
						_id: updateData,
						name: project.name
					};

				}
				else{
					classifyRules['setProject'] = false;
					var project = null;
				}

				DomainRules.update({
					_id: ruleId
				},{
					$set:{
						classifyRules: classifyRules,
						project: project
					}
				});

				break;

			case 'category':

				console.log('updating category')

				var classifyRules = currentRule.classifyRules;

				if(updateData !== null && updateData !== 'null'){
					classifyRules['setCategory'] = true;

					var category = DomainCategories.findOne({
						_id: updateData
					});

					category = {
						_id: category._id,
						label: category.label,
						category: category.category,
						value: category.value,
					};

					DomainRules.update({
						_id: ruleId
					},{
						$set:{
							classifyRules: classifyRules,
							category: category
						}
					});

				}

				return category;

				break;

			case 'privacy':
				var classifyRules = currentRule.classifyRules;
				classifyRules['setPrivacy'] = true;
				
				DomainRules.update({
					_id: ruleId
				},{
					$set:{
						classifyRules: classifyRules,
						private: updateData
					}
				});

				return updateData;

				break;

			case 'validation':

				var classifyRules = currentRule.classifyRules;
				classifyRules['setValidated'] = true;

				console.log('for ' + ruleId + ' set validation as ' + updateData)
				
				DomainRules.update({
					_id: ruleId
				},{
					$set:{
						classifyRules: classifyRules,
						validated: updateData
					}
				});

				break;

		}

	},
	'domains.createCustomRule': function(defaultRuleId, domain, pageTitle, uri){
		check(defaultRuleId, String);

		console.log('creating custom rule');

		var defaultRule = DomainRules.findOne({
			_id: defaultRuleId
		});

		var defaultCategory = DomainCategories.findOne({category:'other'});

		if(typeof defaultRule !== 'undefined'){
			var userObj = Meteor.users.findOne({
				_id: this.userId
			})
			var insertData = _createDefaultUserDomainRule(userObj, domain, pageTitle, uri, defaultCategory, false, defaultRule);
			
			//console.log(insertData)

			DomainCategories.insert(insertData);

			var existingRules = DomainRules.aggregate([
			{
				$match:{
					'user': this.userId,
					$or:[
						{
							$and:[
								{'uri': uri},
								{'pageTitle': pageTitle}
							]
						},
						{
							$and:[
								{'domain': domain},
								{'default': true}
							]
						},
					]
				}
			},
			{
				$group:{
					_id: null,
					ids: {
						$addToSet: '$_id'
					}
				}
			}
			])[0];

			if(typeof existingRules !== 'undefined'){
				return DomainRules.find({
					_id:{
						$in: existingRules.ids
					}
				},
				{
					sort:{
						default: -1
					}
				}).fetch();
			}
		}
	}
});