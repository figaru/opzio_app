import { gauge } from 'meteor/mstrlaw:charts';

Template.userBadges.onRendered(function(){
	//Resizes the badges witdh

	var swiper = new Swiper('.badges-area', {
		loop: false,
		//Default desktop settings
		initialSlide: 0,
		slidesPerView: 'auto',
		slidesPerGroup: 1,
		spaceBetween: 15,
		grabCursor: false,
		pagination: '.swiper-pagination',
		paginationClickable: true,
	});

	_setBadgesSize(swiper, Session.get('deviceWidth'));

	//Tooltips
	$('.badgeTooltip').tooltipster({
		contentAsHTML: true,
		delay: 500,
		// interactive: true,
		// trigger: 'click'
	});

	$(window).on('resize', function(){
		//console.log('resize badges')
		_setBadgesSize(swiper, $(window).width());
	});

	Tracker.autorun(function () {
		var deviceWidth = Session.get('deviceWidth');
		_setBadgesSize(swiper, deviceWidth);
	});

});