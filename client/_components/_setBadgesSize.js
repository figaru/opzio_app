//deviceWidth > 970
//deviceWidth >= 560 && deviceWidth <= 970

import { swiper } from 'meteor/nolimits4web:swiper';

//******
//Resizes the badges witdh and initiates/destroys slider depending on screen size
//******

_setBadgesSize = function(el, width){
	//Tablets/Desktop
	if(width >= 1200){
		el.params.slidesPerView = 4;
		el.params.slidesPerGroup = 4;

		//Disable scrolling, making as if it isn't a slider
		el.params.allowSwipeToPrev = false;
		el.params.allowSwipeToNext = false;
		//Ensure we go back to slide 0
		el.slideTo(0, 0);
	}
	//Medium mobile/tablets
	else if(width >= 650 && width < 1200){
		el.params.slidesPerView = 2;
		el.params.slidesPerGroup = 2;
		//Re-enable swipe events for slider 
		el.params.allowSwipeToPrev = true;
		el.params.allowSwipeToNext = true;
	}
	//Mobile
	else{
		el.params.slidesPerView = 1;
		el.params.slidesPerGroup = 1;
		//Re-enable swipe events for slider 
		el.params.allowSwipeToPrev = true;
		el.params.allowSwipeToNext = true;
	}
	//Finally call update on swiper to recalculate container width
	el.update();
}