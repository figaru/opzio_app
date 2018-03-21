Template.forTeams.onRendered(function(){

	$('body').css({'overflow-y':'auto'});

	Meteor.setTimeout(function(){
		console.log('remove class')
		$('.gn-menu-main').removeClass('expanded');
	}, 100);

	$('html, body').animate({
		scrollTop: 0
	}, 100);

	var height = $(window).height();
	$('.section.main').css({
		'height': (height*.9) + 'px',
		'background-image': 'url("../images/agencies.jpg")',
		'background-position': 'bottom center',
		'background-repeat': 'no-repeat',
		'-webkit-background-size': 'cover',
		'-moz-background-size': 'cover',
		'-o-background-size': 'cover',
		'background-size': 'cover',
		'margin': '50px 0 0'
	});

	Meteor.setTimeout(function(){
		drawPage();
	}, 1000);

	$(window).on('resize', function(){
		drawPage();
	});
});

Template.forTeams.onDestroyed(function(){
  $(window).off('resize');
});