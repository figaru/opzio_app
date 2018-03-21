
Template.userListing.helpers({
	'users': function(){
		//console.log(Router.current().params.projectId)
		var project = Projects.findOne({
			_id: Router.current().params.projectId
		});

		//console.log(project)

		return project.team;
	}
});

Template.userListItem.onRendered(function(e){

	var userId = Template.instance().data.user;
	var projectId = Router.current().params.projectId;

	var totalTimeEl = Template.instance().$('.userTotalTime');
	var validatedTimeEl = Template.instance().$('.userValidatedTime');
	var unknownTimeEl = Template.instance().$('.userUnknownTime');

	
	Meteor.call('getUserTotalTime', userId, projectId, function(err, data){
		if(!err){
			if(data.length > 0){
				totalTimeEl.html(getStringFromEpoch(data[0].totalTime))
				validatedTimeEl.html(getStringFromEpoch(data[0].validatedTime))
				unknownTimeEl.html(getStringFromEpoch(data[0].unknownTime))
			}
			else{
				totalTimeEl.html('N/A')
				validatedTimeEl.html('N/A')
				unknownTimeEl.html('N/A')	
			}
		}
	});
	
});