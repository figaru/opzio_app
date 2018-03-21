Template.privateBase.onRendered(function(){
	$('body').addClass('grey');
	$('body').prepend('<span class="section__overlay first hidden-xs-down">');

	//Below is from master
	Meteor.setTimeout(function(){
		try{
			Tawk_API.hideWidget();
		}
		catch(err){}
	}, 1500)

	if(typeof Session.get('groupOptions') === 'undefined'){
		Session.set('groupOptions', 'source');
	}

	$(window).on('resize', function(){
		Session.set('deviceWidth', $(window).width());
		Session.set('deviceHeight', $(window).height());
	})
});