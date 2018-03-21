Meteor.publish('users', function(){
	//console.log('publish users for ' + this.userId)
	if(this.userId){
		var organization = Meteor.users.findOne({_id: this.userId}).profile.organization;
		var options = {};
		var matchQuery = {
			'active': true,
			'profile.organization': organization
		};

		if(!isAdmin(this.userId)){
			options['fields'] = {
				'resume': 0,
				'totalTime': 0,
				'projects': 0,
				'profile.token': 0,
				'roles': 0,
				'services': 0,
				'emails': 0,
				'requests': 0,
				'total': 0,
				'createdAt': 0,
			}
		}


		return Meteor.users.find(matchQuery, options);
	}
	else{
		return [];
	}
});