Router.route('/dashboard/:section?',{
	name: 'mainDashboard',
	controller: 'PrivateController',
	action: function(){
		params = this.getParams();
		section = params.section;
		hash = params.hash;

		//If no section specified redirect to dashboard
		if(typeof section === 'undefined'){
			Router.go('mainDashboard', { section: 'dashboard'});
		}

		var organization = OrganizationProfile.findOne({},{reactive:false});
		//Session.set('menuTitle', organization.name);

		var canViewMenu = true;
		var canViewDateMenu = true;
		var canViewSettings = true;
		var canFitRange = false;
		var canSetCustomRange = false;

		if(isRoot(Meteor.userId())){
			canSetCustomRange = true;	
		}
		
		//Set hash in case it's null or close (from joyride)
		if(hash === null || hash === 'close'){
			window.location.hash = 'dashboard';
			hash = 'dashboard';
		}
		
		this.render();

		//Remove active class from swiper menu
		$('.swiper-slide').removeClass('active');

		switch(section){
			case 'dashboard':
			default:
				$('.menu-swiper .swiper-slide[data-section="dashboard"]').addClass('active');
				document.title = organization.name + ' Dashboard - Opz.io';
				Session.set('menuTitle', organization.name + ' <span class="hidden-sm-down"> > Dashboard</span>');
				if(!isAdmin(Meteor.userId())){
					canViewMenu = false;
				}
				canViewDateMenu = true;
				
				this.render('organizationBadges',{
					to: 'badgesArea'
				});
				break;

			case 'profile':
				$('.menu-swiper .swiper-slide[data-section="profile"]').addClass('active');
				document.title = organization.name + ' Profile - Opz.io';
				Session.set('menuTitle', '<span class="hidden-sm-down">'+ organization.name + ' > </span>Profile');

				canViewDateMenu = false;
				
				this.render('organizationProfile');
				break;

			case 'team':
				$('.menu-swiper .swiper-slide[data-section="team"]').addClass('active');
				document.title = organization.name + ' Team - Opz.io';
				Session.set('menuTitle', '<span class="hidden-sm-down">'+ organization.name + ' > </span>Team');
				
				canFitRange = true;
				
				this.render('organizationTeam');
				break;

			case 'timeline':
				document.title = organization.name + ' Timeline - Opz.io';
				Session.set('menuTitle', '<span class="hidden-sm-down">'+ organization.name + ' > </span>Timeline');
				canFitRange = true;
				
				this.render('organizationTimeline');
				break;

			case 'settings':
				$('.menu-swiper .swiper-slide[data-section="settings"]').addClass('active');	
				document.title = organization.name + ' Settings - Opz.io';
				Session.set('menuTitle', '<span class="hidden-sm-down">'+ organization.name + ' > </span>Settings');
				
				canViewDateMenu = false;
				
				this.render('organizationSettings');
				break;
		}

		//console.log('canViewMenu: '+ canViewMenu + '\ncanViewDateMenu: '+ canViewDateMenu + '\ncanViewSettings: '+ canViewSettings + '\ncanFitRange: ' + canFitRange + '\ncanSetCustomRange: ' + canSetCustomRange)

		//Render menu with actions
		this.render('organizationMenu',{
			to: 'actionsMenuArea',
			data: function(){
				return {
					'canViewMenu': canViewMenu,
					'canViewSettings': canViewSettings,
				}
			}
		});

		this.render('dateRangeMenu',{
			to: 'dateRangeMenuArea',
			data: function(){
				Session.set('canViewDateMenu', canViewDateMenu);
				return {
					'canViewDateMenu': canViewDateMenu,
					'canFitRange': canFitRange,
					'canSetCustomRange': canSetCustomRange,
				}
			}
		});

	},
});