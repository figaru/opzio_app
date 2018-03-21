hasReachedProjectsLimit = function(){
	if(typeof this.userId !== 'undefined'){

		var user = Meteor.users.findOne({_id: this.userId });
		
		var projects = Projects.find({
			organization: user.profile.organization,
			type: {
				$nin: ['personal', 'unknown']
			}
		}).fetch();

		var orgProfile = OrganizationProfile.findOne({
			organization: user.profile.organization
		});

		if(projects.length === orgProfile.plan.projectCap){
			return true;
		}

		return false;
	}
}