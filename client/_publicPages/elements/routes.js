Router.route('/elements',{
	name: 'elements',
	controller: 'PublicController',
	action: function(){


		//TODO: change to go to user's prefered dashboard (allow to change in his settings)
		if(Meteor.user()){
			Router.go('userDashboard', {userId: Meteor.userId()}, { hash: 'dashboard' });
		}

		this.render();
		document.title = 'Elements - Opz.io';

		this.render('elements',{
			to: 'mainContentArea',
			data: function(){
				return {
					'canSetCustomRange': false,
				}
			}
		});
	},
});