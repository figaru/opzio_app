Router.route('/projects/:section?',{
	name: 'projectsDashboard',
	controller: 'PrivateController',
	waitOn: function(){
		return Meteor.subscribe('tasklists');
	},
	data: function(){
		return OrganizationProfile.findOne();
	},
	action: function(){
		params = this.getParams();
		hash = params.hash;
		section = params.section;
		
		var canViewMenu = true;
		var canViewListing = true;
		var canViewDateMenu = true;
		var canViewSettings = true;
		var canFitRange = false;

		if(typeof section === 'undefined'){
			Router.go('projectsDashboard', { section: 'dashboard'});
		}
		
		this.render()

		//Remove active class from swiper menu
		$('.swiper-slide').removeClass('active');

		switch(section){
			case 'dashboard':
			default:
				document.title = 'Projects Dashboard - Opz.io';
				Session.set('menuTitle', 'Projects > Dashboard');
				$('.menu-swiper .swiper-slide[data-section="dashboard"]').addClass('active');
				this.render('projectsDashboard');
				break;

			case 'list':
				document.title = 'Projects List - Opz.io';
				$('.menu-swiper .swiper-slide[data-section="list"]').addClass('active');
				Session.set('menuTitle', 'Projects > List');

				var canViewDateMenu = false;

				this.render('projectListStandalone', {
					data: function(){
						return {
							'allProjects': true,
							'projects': Projects.find().fetch()
						}
					}
				});
				break;

			case 'timeline':
				document.title = 'Projects Timeline - Opz.io';
				Session.set('menuTitle', 'Projects > Timeline');
				$('.menu-swiper .swiper-slide[data-section="timeline"]').addClass('active');
				canFitRange = true;
				this.render('projectsTimeline');
				break;
		}
		
		//Render menu with options
		this.render('projectsMenu',{
			to: 'actionsMenuArea',
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
				Session.set('canViewDateMenu', canViewDateMenu);
				return {
					'canViewDateMenu': canViewDateMenu,
					'canFitRange': canFitRange,
					'canSetCustomRange': false,
				}
			}
		});
	},
});