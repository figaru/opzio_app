//General project publish
Meteor.publish('projects', function(params){
	
	var query = {};
	var filters = {
		'sort':{ type: 1, 'updateDate': -1, },
		//'limit': 200,
	};

	var user = Meteor.users.findOne({_id:this.userId});

	//console.log(isAdmin(this.userId) === false)

	if(typeof(user) !== 'undefined'){

		query['organization'] = user.profile.organization;
		
		//Non admin users
		if(isAdmin(this.userId) === false){
			//console.log('limit projects!')
			var fields = {
				'budget':0, 
			}

			query['$or'] = [
				{ 'type': 'personal' },
				{ 'owner': {'$in': [this.userId] } },
				{ 'visibility': 2 },

				{ '$and': [
					{'visibility': 1 },
					{ 'team.user': this.userId }
				]},

				{ '$and': [
					{'visibility': 0 }, 
					{ 'team.user': this.userId }
				]}
			]
		}
		else{
			query['$or'] = [
				{ 'visibility': 1 },
				{ 'visibility': 2 },
				{ '$and': [
					{ 'visibility': 0 },
					{ 'team.user': this.userId }
				]},
				{ '$and': [
					{ 'owner': {'$in': [this.userId] } },
					{ 'type': 'personal' }
				]},
			]
		}
	}
	else{
		return [];
	}

	if(typeof fields !== 'undefined'){
		filters['fields'] = fields;
	}

	return Projects.find(query, filters);
});

Meteor.publish('lastTouchedProjects', function(){
	//var user = Meteor.users.findOne({_id:this.userId});
	return LastTouchedProject.find({
		user: this.userId
	},
	{
		limit: 100	
	});
})