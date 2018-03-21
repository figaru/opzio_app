parallaxScript = function(){
	//Get background y position
	let basePercent = $('.solution-top-section').css('background-position-y');
	let fullHeight = $('.solution-top-section').height();
	let basePosition = 0;

	$(window).on('scroll', function(){

		//let newPos = basePosition - $(window).scrollTop();
		let newPos = (parseInt(basePercent.replace('%','')) - ($(window).scrollTop() / fullHeight * 10));

		//console.log(Math.round(basePercent + newPos))
		if(newPos > 0){
			$('.solution-top-section').css({'background-position-y': newPos+'%'})
		}
		
	});
}