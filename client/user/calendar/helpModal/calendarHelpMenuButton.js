Template.calendarHelpMenuButton.events({
	'click #helpModal': function(e){
		$('body').append('<div id="calendarHelpModal" class="calendarHelpModal modal fade text-center" tabindex="-1" role="dialog" aria-labelledby="calendarHelpModalLabel" aria-hidden="true">\
			<div class="modal-dialog text-left mw-70" role="document">\
				<div class="modal-content">\
					<div class="modal-body mih-50">\
						<div id="calendarHelpSwiper" class="swiper-container">\
						    <div class="swiper-wrapper">\
						        <div class="swiper-slide w-100 m-auto text-center">\
					        		<div class="player-overlay h-100 w-100" style="opacity:0;position:fixed;"></div>\
						        	<div class="py-5 px-2 content-wrapper">\
						        		<iframe src="" data-src="https://player.vimeo.com/video/71971431?autoplay=1&loop=1&title=0&byline=0&portrait=0&autopause=0" width="840" height="537" frameborder="0"></iframe>\
						        		<br />\
						        		<h5>My Activities</h5>\
						        		<p class="mt-3 font-weight-light">This calendar allows you to view and edit all your tracked activities.<br>You are the only one that can see this area.</p>\
						        	</div>\
						        </div>\
						        <div class="swiper-slide w-100 m-auto text-center">\
						        	<div class="player-overlay h-100 w-100" style="opacity:0;position:fixed;"></div>\
						        	<div class="py-5 px-2 content-wrapper">\
						        		<iframe src="" data-src="https://player.vimeo.com/video/71971431?autoplay=1&loop=1&title=0&byline=0&portrait=0&autopause=0" width="840" height="537" frameborder="0"></iframe>\
						        		<br />\
						        		<h5>Changing views</h5>\
						        		<p class="mt-3 font-weight-light">You can view your activities on a weekly basis or as a daily list.</p><p class="font-weight-light">Use <span class="btn-group" role="group" aria-label="Basic example"><button type="button" class="btn btn-sm btn-outline-primary"><i class="fa fa-angle-left"></i></button><button type="button" class="btn btn-sm btn-outline-primary">Week</button><button type="button" class="btn btn-sm btn-outline-primary">List</button><button type="button" class="btn btn-sm btn-outline-primary"><i class="fa fa-angle-right"></i></button></span> to change your current view and navigate between weeks &amp; days.</p>\
						        	</div>\
						        </div>\
						        <div class="swiper-slide w-100 m-auto text-center">\
		        	        		<div class="player-overlay h-100 w-100" style="opacity:0;position:fixed;"></div>\
		        		        	<div class="py-5 px-2 content-wrapper">\
		        		        		<iframe src="" data-src="https://player.vimeo.com/video/71971431?autoplay=1&loop=1&title=0&byline=0&portrait=0&autopause=0" width="840" height="537" frameborder="0"></iframe>\
		        		        		<br />\
		        		        		<h5>I\'m the last slide bro</h5>\
		        		        		<p class="mt-3 font-weight-light">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur hic, commodi, cumque quibusdam distinctio quasi sapiente repellendus tempore, quidem saepe itaque ducimus accusantium nulla voluptatem quis minima tenetur. Temporibus, asperiores.</p>\
		        		        	</div>\
						        </div>\
						    </div>\
						</div>\
						<div class="swiper-pagination"></div>\
				    	<div class="swiper-button-prev"></div>\
				    	<div class="swiper-button-next"></div>\
					</div>\
					<div class="modal-footer">\
						<button type="button" class="btn btn-primary" data-dismiss="modal">Got it</button>\
					</div>\
				</div>\
			</div>\
		</div>');
		
		Meteor.setTimeout(function(){
			$('#calendarHelpModal').modal('show',{
				keyboard: true,
				backdrop: 'static',
			});

		}, 1)

		//$('body').on 'shown.bs.modal', '#bootstrap-modal-element', ->
		$('#calendarHelpModal').on('shown.bs.modal', function (e) {
			var mySwiper = new Swiper('#calendarHelpSwiper', {
				speed: 400,
				slidesPerView: 1,
				centeredSlides: true,
				pagination: '.swiper-pagination',
				paginationType: 'progress',
				paginationClickable: true,
				nextButton: '.swiper-button-next',
				prevButton: '.swiper-button-prev',
				onInit: function(swiperEl){
					console.log('init!')
					lazyLoadVimeo();
				},
				onSlideChangeStart: function(swiperEl){
					console.log('change!')
					lazyLoadVimeo();
				}
			});
		});

		$('#calendarHelpModal').on('hidden.bs.modal', function (e) {
		  $('#calendarHelpModal').remove();
		})
	}
});

lazyLoadVimeo = function(){
	console.log('load video')
	// var slidePrev = $('.swiper-slide-prev');
	// var slideNext = $('.swiper-slide-next');

	// slidePrev.find('iframe').attr('src', '');
	// slideNext.find('iframe').attr('src', '');

	var currentSlide = $('.swiper-slide-active');

	var iFrame = currentSlide.find('iframe');
	if(iFrame.attr('src') === ''){
		var videoSource = iFrame.attr('data-src');
		iFrame.attr('src', videoSource);
	}
	//console.log(currentSlide)
}