Router.route('/team',{
	name: 'teamDashboard',
	controller: 'PrivateController',
	data: function(){
		return OrganizationProfile.findOne();
	},
	action: function(){
		params = this.getParams();
		hash = params.hash;
		
		var canViewMenu = true;
		var canViewListing = true;
		var canViewDateMenu = true;
		var canViewSettings = true;
		var canFitRange = false;

		Session.set('menuTitle', 'Team');
		
		this.render()

		switch(hash){
			case 'dashboard':
			default:
				document.title = 'Team Dashboard - Opz.io';
				Session.set('currentHash','dashboard');
				this.render('teamDashboard');
				break;

			case 'list':
				document.title = 'Team List - Opz.io';
				Session.set('currentHash','list');

				var canViewDateMenu = false;

				this.render('teamListing', {
					data: function(){
						return {
							'teamMember': Meteor.users.find().fetch()
						}
					}
				});
				break;
		}
		
		//Render menu with options
		this.render('actionsMenu',{
			to: 'secondaryMenuArea',
			data: function(){
				return {
					'canViewMenu': canViewMenu,
					'canViewListing': canViewListing,
					'canViewSettings': canViewSettings
				}
			}
		});

		//console.log(canViewMenu)

		this.render('dateRangeMenu',{
			to: 'dateRangeMenuArea',
			data: function(){
				return {
					'canViewDateMenu': canViewDateMenu,
					'canFitRange': canFitRange,
					'canSetCustomRange': false,
				}
			}
		});
	},
});