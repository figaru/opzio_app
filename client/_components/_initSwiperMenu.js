_initSwiperMenu = function(){
	console.log('init swiper');

	var swiper = new Swiper($('.menu-swiper'), {
	  freeMode: true,
	  allowSwipeToPrev: true,
	  allowSwipeToNext: true,
	  slidesPerView: 'auto',
	  freeMode: true,
	  freeModeSticky: true,
	  centeredSlides: true,
	  freeModeMomentum: false,
	  onTouchEnd: function(swiper, event){
	  	if(swiper.translate >= 0){
	  		swiper.setWrapperTranslate(0)
	  	}
	  },
	});

	swiper.setWrapperTranslate(0)

	Meteor.setTimeout(function(){
		resizeSlider(swiper);
	}, 500);
}

resizeSlider = function(swiper){
	// console.log('resize swiper')
	if($(document).width() >= 768){
		// console.log('A')
		// //console.log('resize to fixed slider')
		// swiper.slideTo(0, 500, true);
		// swiper.params.centeredSlides = false;
		// swiper.params.slidesOffsetBefore = 00;
		// swiper.params.allowSwipeToNext = false;
		// swiper.params.allowSwipeToPrev = false;
		// $('.menu-swiper .tab-item.active a').click();
		swiper.lockSwipeToNext()
		swiper.lockSwipeToPrev()
		var slides = $('.menu-swiper .tab-item');
		slides.off('click')
	}
	else{
		// console.log('B')

		var activeSlide = $('.swiper-slide.active');
		swiper.setWrapperTranslate(activeSlide.attr('data-left'))

		swiper.unlockSwipeToNext()
		swiper.unlockSwipeToPrev()

		var slides = $('.menu-swiper .tab-item');
		var slideIndex = 0;
		
		slides.each(function(k, el){
			var pos = $(el).position().left;
			if(slideIndex!=0){
				pos-=30;
			}
			// console.log(pos)
			$(el).attr({
				'data-left': pos,
				'data-right': pos+$(el).position().left+$(el).width(),
				//'data-index': slideIndex
			});

			slideIndex+=1;
			
			$(el).on('click', function(e){
				//swiper.slideTo(slideIndex, 300);
				$('.swiper-wrapper').css({
					'transform': 'translate3d(-'+ pos +'px, 0px, 0px)'
				});
			});
		});
	}
}