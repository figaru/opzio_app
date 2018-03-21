Meteor.publish('organizationProfile', function(){
	if(this.userId){
		var currentUser = Meteor.users.findOne({_id: this.userId});
		if(typeof currentUser !== 'undefined'){
			return OrganizationProfile.find({
				organization: currentUser.profile.organization
			},
			{
				fields:{
					admin: 0,
					ignoreParsingKeywords: 0
				}
			});
		}
	}
	else{
		return [];
	}
});