Template.userMenu.onRendered(function(){
	//console.log('rendered userMenu')
	_initSwiperMenu();
	
	//Remove active class from swiper menu
	let section = Router.current().params.section;
	if(typeof section !== 'undefined'){
		let query = '.menu-swiper .swiper-slide[data-section="'+ section +'"]';
		$('.swiper-slide').removeClass('active');
		$(query).addClass('active');
	}
});

Template.userMenu.events({
	'click #userJoyride': function(e){
		e.preventDefault();
		var section = Router.current().params.section;

		var route = Router.current().route.getName();

		// if(route === 'userDashboard' && section === 'dashboard'){
		// 	//console.log('called user dashboard joyride')
		// 	initUserDashboardJoyride(true);
		// }
		// if(route === 'userSettings'){
		// 	initUserSettingsJoyride();
		// }
	}
});