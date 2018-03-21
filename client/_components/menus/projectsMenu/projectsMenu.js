Template.projectsMenu.onRendered(function(){
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