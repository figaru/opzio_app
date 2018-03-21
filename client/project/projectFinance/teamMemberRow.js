Template.teamMemberRow.helpers({
	'getTeamMemberHourRate': function(memberObj){
		if(typeof memberObj.hourRate !== 'undefined'){
			return memberObj.hourRate;
		}
		else{
			return Meteor.users.findOne({_id:memberObj.user}).baseHourRate;
		}
	}
});