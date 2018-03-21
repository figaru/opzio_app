import { Tracker } from 'meteor/tracker';
import { gauge } from 'meteor/mstrlaw:charts';

Template.organizationBadges.onRendered(function(){
	var swiper = new Swiper('.swiper-container', {
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

	Tracker.autorun(function () {
		var deviceWidth = Session.get('deviceWidth');
		_setBadgesSize(swiper, deviceWidth);
	});
});