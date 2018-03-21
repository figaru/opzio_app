//General project publish
Meteor.publish('tasklists', function(params){
	
	var query = {};
	var filters = {
		//'sort':{ 'updatedOn': -1, }, 
	};

	var user = Meteor.users.findOne({_id:this.userId});

	if(typeof(user) !== 'undefined'){

		query['organization'] = user.profile.organization;
		
		if(typeof(params) !== 'undefined'){
			if('projectId' in params && params.projectId !== ''){
				check(params.projectId, String);
				query['project'] = params.projectId;
			}
			if('userId' in params && params.userId !== ''){
				query['$or'] = [
					{ 'team.user': params.userId },
					{ 'owner': {'$in': [params.userId] } },
				]
			}
		}

		/*
		if(!isAdmin(this.userId)){
			query['$or'] = [
				{ 'owner': {'$in': [this.userId] } },
				{ 'visibility': 1 },
				{ '$and': [{'visibility': 0, 'team.user': this.userId}]}
			]
		}
		*/
	}

	var tasklists = Tasklists.find(query, filters);

	//console.log(tasklists.count())

	return tasklists;
});