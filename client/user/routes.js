Router.route('/user/:userId/:section?/:option?',{
	name: 'userDashboard',
	controller: 'PrivateController',
	waitOn: function(){
		params = this.getParams();
		userId = params.userId;
		section = params.section;
		option = params.option;
		
		if(section === 'calendar'){
			if(typeof Router.current().params.query.start !== 'undefined' && typeof Router.current().params.query.end !== 'undefined'){
				var dateRange = {
					'startDate': Router.current().params.query.start,
					'endDate': Router.current().params.query.end,
					'range': 'day',
				    'verbosePeriod': 'Day',
				    'altVerbosePeriod': 'Daily',
				}
				Session.set('dateRange', dateRange);
			}
			return [
				Meteor.subscribe('lastTouchedProjects')
			];
		}
	},
	action: function(){
		hash = params.hash;

		//If no section specified redirect to dashboard
		if(typeof section === 'undefined'){
			Router.go('userDashboard', {userId: Meteor.userId(), section: 'calendar'});
		}

		var canViewMenu = true;
		var canViewDateMenu = true;
		var canViewSettings = false;
		var canViewTimesheet = false;
		var canFitRange = false;
		var singleDatePicker = false;
		var canSetCustomRange = false;

		//In case user reloads the page with the #close hash (because of joyride)
		//if(hash === 'close'){ window.location.hash = 'dashboard'; }

		//Check if is current user or is root user to allow for timesheet & settings access
		if(userId === Meteor.userId() || isRoot(Meteor.userId())){
			canViewTimesheet = true;
			canViewSettings = true;
		}

		//console.log('section ' + section)

		//Render base layout
		this.render(); 

		//Remove active class from swiper menu
		$('.swiper-slide').removeClass('active');
		
		switch(section){
			case 'dashboard':
			default:
				$('.menu-swiper .swiper-slide[data-section="dashboard"]').addClass('active');

				this.render('userDashboard',{
					data: function(){
						
						var userName = getUserShortName(userId);
						
						document.title = userName + ' Dashboard - Opz.io';
						
						Session.set('menuTitle', '<span class="hidden-sm-down">'+userName + ' > </span>Dashboard');
						
						return {
							'tasklists': Tasklists.find({
								user: userId
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

				this.render('userBadges',{
					to: 'badgesArea'
				});

				break;
			
			case 'profile':

				$('.menu-swiper .swiper-slide[data-section="profile"]').addClass('active');

				canViewDateMenu = false;
				this.render('userProfile',{
					data: function(){
						var userName = getUserShortName(userId);
						document.title = userName + ' Profile - Opz.io';
						Session.set('menuTitle', userName + ' > Profile');
						Session.set('menuTitle', '<span class="hidden-sm-down">'+userName + ' > </span>Profile');
					}
				});
				break;

			
			case 'timeline':
				canFitRange = true;
				$('.menu-swiper .swiper-slide[data-section="timeline"]').addClass('active');
				this.render('userTimeline',{
					data: function(){
						var userName = getUserShortName(userId);
						Session.set('menuTitle', userName);
						document.title = userName + ' Timeline - Opz.io';
						Session.set('menuTitle', userName + ' > Timeline');
					}
				});
				break;
			

			case 'calendar':
				if(typeof Session.get('calendarDetail') === 'undefined') Session.set('calendarDetail', 'midLevelDetail');
				
				//singleDatePicker = true;
				canViewDateMenu = false;
				
				$('.menu-swiper .swiper-slide[data-section="calendar"]').addClass('active');
				
				this.render('userCalendar', {
					data: function(){
						var userName = getUserShortName(userId);
						document.title = userName + ' Calendar - Opz.io';
						Session.set('menuTitle', '<span class="hidden-sm-down">'+userName + ' > </span>My Activity');
					}
				});
				
				/*
				this.render('calendarHelpMenuButton',{
					to: 'helpMenuArea'
				});
				*/
				
				break;

			case 'settings':
				if(userId === Meteor.userId() || isRoot(Meteor.userId())){
					$('.menu-swiper .swiper-slide[data-section="settings"]').addClass('active');
					canViewDateMenu = false;
					this.render('userSettings',{
						data: function(){
							var userName = getUserShortName(userId);
							document.title = userName + ' Settings - Opz.io';
							Session.set('menuTitle', userName + ' > Settings');
							return {
								'user': Meteor.users.findOne({ _id:userId }),
							};
						}
					});
				}
				else{
					Router.go('userDashboard', {userId: Meteor.userId(), section: 'dashboard'});
				}
				break;
		}
		
		//console.log('canViewMenu: '+ canViewMenu + '\ncanViewDateMenu: '+ canViewDateMenu + '\ncanViewSettings: '+ canViewSettings + '\ncanFitRange: ' + canFitRange)

		//Render menu with options
		this.render('userMenu',{
			to: 'actionsMenuArea',
			data: function(){
				return {
					'canViewMenu': canViewMenu,
					'canViewSettings': canViewSettings,
					'canViewTimesheet': canViewTimesheet
				}
			}
		});

		//console.log('canViewDateMenu ' + canViewDateMenu)
		//console.log('singleDatePicker ' + singleDatePicker)
		//console.log('canFitRange ' + canFitRange)
		//console.log('canSetCustomRange ' + canSetCustomRange)
		//console.log('----------------------------------------')

		this.render('dateRangeMenu',{
			to: 'dateRangeMenuArea',
			data: function(){
				Session.set('canViewDateMenu', canViewDateMenu);
				return {
					'canViewDateMenu': canViewDateMenu,
					'singleDatePicker': singleDatePicker,
					'canFitRange': canFitRange,
					'canSetCustomRange': canSetCustomRange,
				}
			}
		});
	},
});