Template.integrations.events({
	//Moves App
	'click #integrateMoves': function(){
		console.log('integrate with Moves')
		var url = 'https://api.moves-app.com/oauth/v1/authorize?response_type=code&client_id='+ Meteor.settings.public.moves.client_id +'&redirect_uri=http://localhost:3000/integrations/moves&scope=activity location';
		window.location = url;
	},
	'click #revokeMoves': function(){
		Meteor.call('integrations.revokeMoves', function(err, data){
			if(!err){
				callToast('success', 'You revoked Moves integration.');
			}
		})
	}
});

Template.integrations.helpers({
	'hasMoves': function(){
		var hasIntegration = Meteor.users.findOne({
			_id: Meteor.userId(),
			'trackers.tracker': 'moves',
		});

		if(typeof hasIntegration !== 'undefined'){
			return true;
		}

		return false;
	}
});