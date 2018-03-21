Meteor.publish('signups', function(){
	//console.log('publish users for ' + this.userId)
	if(this.userId){
		var organization = Meteor.users.findOne({_id: this.userId}).profile.organization;
		
		return Signups.find({
			organization: organization
		},{
			sort:{
				resentDate: -1,
				revoked: 1,
			}
		});

	}
	else{
		return [];
	}
});