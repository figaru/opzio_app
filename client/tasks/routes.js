Router.route('/tasks',{
	name: 'tasksDashboard',
	controller: 'PrivateController',
	waitOn: function(){
		
		params = this.getParams();
		hash = params.hash;

		return [
			Meteor.subscribe('users'),
			Meteor.subscribe('projects'),
			Meteor.subscribe('tasklists'),
			Meteor.subscribe('organizationProfile'),
		];
	},
	data: function(){
		return OrganizationProfile.findOne();
	},
	action: function(){
		var canViewMenu = false;
		var canFitRange = false;

		Session.set('menuTitle', 'Tasks');
		
		this.render()

		switch(hash){
			case 'dashboard':
			default:
				document.title = 'Tasks Dashboard - Opz.io';
				Session.set('currentHash','dashboard');
				//this.render('tasksDashboard');
				break;

			case 'timeline':
				document.title = 'Projects Timeline - Opz.io';
				Session.set('currentHash','timeline');
				canFitRange = true;
				//this.render('projectsTimeline');
				break;
		}
		
		//Render menu with options
		this.render('actionsMenu',{
			to: 'secondaryMenuArea',
			data: function(){
				return {
					'canViewMenu': true,
					'canViewSettings': true
				}
			}
		});

		//console.log(canViewMenu)

		this.render('dateRangeMenu',{
			to: 'dateRangeMenuArea',
			data: function(){
				return {
					'canViewMenu': canViewMenu,
					'canFitRange': canFitRange,
					'canSetCustomRange': false,
				}
			}
		});
	},
});