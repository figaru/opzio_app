Router.route('/project/:projectId/:section?',{
	name: 'projectDashboard',
	controller: 'PrivateController',
	waitOn: function(){
		params = this.getParams();
		projectId = params.projectId;
		section = params.section;
		hash = params.hash;

		return [
			Meteor.subscribe('users'),
			Meteor.subscribe('projects'),
			Meteor.subscribe('tasklists', {
				'project': projectId
			}),
			Meteor.subscribe('organizationProfile'),
		];
	},

	action: function(){

		//If no section specified redirect to dashboard
		
		var project = Projects.findOne({ _id: projectId });
		
		if(typeof section === 'undefined'){
			Router.go('projectDashboard', {projectId: projectId, section: 'dashboard'});
		}

		var canViewMenu = true;
		var canFitRange = false;
		var canViewDateMenu = true;

		Session.set('currentProject', project);

		this.render(); //Render base layout

		//Remove active class from swiper menu
		$('.swiper-slide').removeClass('active');
		
		switch(section){
			case 'dashboard':
			default:
				document.title = project.name + ' Dashboard';
				$('.menu-swiper .swiper-slide[data-section="dashboard"]').addClass('active');
				Session.set('menuTitle', project.name + ' > Dashboard');

				this.render('projectBadges',{
					to: 'badgesArea'
				});

				this.render('projectDashboard',{
					data: function(){
						return {
							'tasklists': Tasklists.find({
								project:project._id
							},
							{ 
								sort:{ 
									startDate: -1,
									endDate: -1,
								},
								//limit: 5,
							}).fetch()
						};
					}
				});
				break;

			case 'profile':
				document.title = project.name + ' Info';
				$('.menu-swiper .swiper-slide[data-section="profile"]').addClass('active');
				Session.set('menuTitle', project.name + ' > Info');
				canViewDateMenu = false;

				this.render('projectInfo',{
					data: function(){
						return {
							'project': project,
						};
					}
				});
				break;

			case 'finance':
				document.title = project.name + ' Financial';
				$('.menu-swiper .swiper-slide[data-section="finance"]').addClass('active');
				Session.set('menuTitle', project.name + ' > Financial');
				var hasSetupBudget = Projects.findOne({_id:project._id}).hasSetupBudget;
				canViewDateMenu = false;

				this.render('projectFinance',{
					data: function(){
						return {
							'project': project,
							'hasSetupBudget': hasSetupBudget
						};
					}
				});
				break;

			case 'timeline':
				document.title = project.name + ' Timeline';
				$('.menu-swiper .swiper-slide[data-section="timeline"]').addClass('active');
				Session.set('menuTitle', project.name + ' > Timeline');
				canFitRange = true;
				this.render('projectTimeline');
				break;

			case 'settings':
				document.title = project.name + ' Settings';
				$('.menu-swiper .swiper-slide[data-section="settings"]').addClass('active');
				Session.set('menuTitle', project.name + ' > Settings');
				canViewMenu = false;

				this.render('projectSettings',{
					data: function(){
						return {
							'project': project,
							'useForCategorization': project.useForCategorization
						};
					}
				});
				break;
		}
		
		//Render menu with options
		this.render('projectMenu',{
			to: 'actionsMenuArea',
			data: function(){
				return {
					'canViewMenu': true,
					'projectId': projectId,
					'canViewSettings': true
				}
			}
		});

		//console.log(canViewMenu)

		this.render('dateRangeMenu',{
			to: 'dateRangeMenuArea',
			data: function(){
				Session.set('canViewDateMenu', canViewDateMenu);
				return {
					'canViewMenu': canViewMenu,
					'canViewDateMenu': canViewDateMenu,
					'canFitRange': canFitRange,
					'canSetCustomRange': false,
				}
			}
		});
	},
});