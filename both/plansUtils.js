hasCompletedMainIntro = function(){
	if(typeof Meteor.user() !== 'undefined'){
		var user = Meteor.user();

		if(user.mainIntro.installPlugins && user.mainIntro.createProjects){
			
			var orgProfile = OrganizationProfile.findOne({ organization: user.profile.organization });
			
			if(typeof orgProfile !== 'undefined'){
				if(orgProfile.plan.type === 'single'){
					//If is single user, we don't care about inviting other users, therefore set completed as true
					Meteor.call('users.completedMainIntro', function(err, data){
						if(!err){
							Session.set('completedMainIntro', true);
						}
					});
				}
				else{
					//Check if user invited any team member
					if(user.mainIntro.inviteTeam){
						Meteor.call('users.completedMainIntro', function(err, data){
							if(!err){
								Session.set('completedMainIntro', true);
							}
						});
					}
					else{
					}

				}
			}
		}
	}
};

isFreePlan = function(){
	if(typeof Meteor.user() !== 'undefined'){
		var organization = Meteor.user().profile.organization;
		var orgProfile = OrganizationProfile.findOne({
			organization: organization
		});
		
		if(typeof orgProfile !== 'undefined'){
			if(orgProfile.plan.type === 'single'){
				return true;
			}

			return false;
		}
		else{
			return false;
		}
	}
};

hasInstalledPlugins = function(){
	if(typeof Meteor.user() !== 'undefined'){
		if(Meteor.user().profile.hasTracker){
			return true
		}
		return false;
	}
	return false;
}