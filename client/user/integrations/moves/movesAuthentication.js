Template.movesAuthentication.onRendered(function(){
	var q = Router.current().params.query;
	console.log(q)
	if('error' in q){
		callToast('error', 'Unable to integrate with Moves', 'Response error');
	}
	else{
		Meteor.call('integrations.getMovesToken', q.code, function(err, data){
			//console.log('finished integration')
			if(!err){
				//console.log(data);
				Meteor.setTimeout(function(){
					callToast('success', 'Moves is now integrated. You\'ll be able to view your movements in Opz.io.');
				}, 1000);
				Router.go('userDashboard', {userId: Meteor.userId(), section:'settings'});
			}
		});
	}
});