Template.projectVisibility.onRendered(function(){
	var project = Template.instance().data.project;

	switch(project.visibility){
		//Private
		case 0:
			$('#visibility0').attr('checked', true);
			break;
		//Internal
		case 1:
			$('#visibility1').attr('checked', true);
			break;
		//Public
		case 2:
			$('#visibility2').attr('checked', true);
			break;

		default:
			console.log('Unknown visibility option!')
			break;
	}
});

Template.projectVisibility.events({
	'click input[name="visibility-group"]': function(e){
		var project = Template.instance().data.project;

		switch(e.currentTarget.id){
			case 'visibility0':
				Meteor.call('updateProjectVisibility', project, 0, function(err, data){

				})
				break;

			case 'visibility1':
				Meteor.call('updateProjectVisibility', project, 1, function(err, data){

				})
				break;

			case 'visibility2':
				Meteor.call('updateProjectVisibility', project, 2, function(err, data){

				})
				break;

			default:
				console.log('Unknown visibility action!')
				break;
		}
	}
})