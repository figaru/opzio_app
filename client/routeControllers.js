//Global routes configuration
Router.configure({
	trackPageView: true,
	loadingTemplate: 'loader',
	notFoundTemplate: 'templateNotFound'
});

//Controller for authenticated, private routes
PrivateController = RouteController.extend({
  	layoutTemplate: 'privateBase',
  	yieldRegions: {
		'appNavigation': {to: 'menuArea'},
	},
	waitOn: function(){
		
		return [
			Meteor.subscribe('signups'),
			Meteor.subscribe('users'),
			Meteor.subscribe('projects'),
			Meteor.subscribe('organizationProfile'),
			Meteor.subscribe('domainCategories'),
		];
	}
});

//Controller for public routes
PublicController = RouteController.extend({
  	layoutTemplate: 'publicBase',
  	template: 'publicLayout',
  	yieldRegions: {
		'publicNav': {to: 'menuArea'},
		'publicFooter': {to: 'footerArea'},
	},
});

//Check for user login before action (for all routes)
Router.onBeforeAction(function()
	{
		//Always kill any existing joyride before proceeding to the route action
		//$(window).joyride('destroy');

		//Always remove any modal backdrop
		$(document).find('.modal-backdrop').remove();

		if (! Meteor.userId()) {
			if (Meteor.loggingIn()) { this.render(this.loadingTemplate); }
			else{
				if(Router.current().route.getName() === 'mainDashboard'){
					Router.go('home');
				}
				else{
					Router.go('login');
				}
			}
		}
		else{
			this.next(); 
		}
	}, 
	{
		//Add public routes (names) here (ex. 'homepage')
		except: [
			'home',
			'about',
			'plans',
			'terms',
			'solutionsList',
			'solutions',
			'elements',
			'publicPlugins',
			'faqs',
			//Login
			'login',
			'loginTmp',
			//Register
			'register',
			'finishRegister',
			'registerInvite',
			//Demo screen
			'requestDemo',
			'thankYou',
			//Password recovery
			'forgotPassword',
			'resetPassword',
		]
	}
);

Router.onAfterAction(function(){
	//Init event listners for input label Material animation
	Meteor.setTimeout(function(){
		new MaterialLabel();
	}, 100)
});
