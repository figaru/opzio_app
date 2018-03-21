Router.route('/',{
	name: 'home',
	controller: 'PublicController',
	action: function(){


		//TODO: change to go to user's prefered dashboard (allow to change in his settings)
		if(Meteor.user()){
			Router.go('userDashboard', {userId: Meteor.userId()}, { hash: 'dashboard' });
		}

		this.render();
		document.title = 'Opz.io - Seamless project management';

		this.render('homepage',{
			to: 'mainContentArea',
			data: function(){
				return {
					'canSetCustomRange': false,
				}
			}
		});

		this.render('publicFooter', {
			to: 'footerArea',
			data: function(){
				return {
					'fixed': false,
					'simple': false
				}
			}
		});
	},
});