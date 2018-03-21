Template.publicNav.onRendered(function(){
	try{
		if(Router.current().route.getName() !== 'homepage'){
			$('.publicNav').addClass('expanded');
		}
	}
	catch(e){}
});

Template.publicNav.events({
	'click .collapse.show a:not(.dropdown-toggle)': function(){
		$('.navbar-toggler').click()
		$('.navbar-collapse').removeClass('show');
	}
});