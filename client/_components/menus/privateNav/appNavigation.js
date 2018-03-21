Template.appNavigation.onRendered(function(){
	if(typeof Session.get('openMenu') === 'undefined'){
		Session.set('openMenu', false);
		//toggleMenu()
	}
});


Template.appNavigation.events({
	'click #open-button': function(e){
		toggleMenu();
	},
	'click #close-button': function(e){
		toggleMenu();
	},
	'click a:not(.dropdown-toggle)': function(e){
		if(Session.get('deviceWidth') < 768){
			Meteor.setTimeout(function(){
				toggleMenu();
			}, 200);
		}
	},
	'click #logout': function(e){
		e.preventDefault();
		var userName = Meteor.user().profile.firstName + ' ' + Meteor.user().profile.lastName
		apiWorker.call('timeline.addEvent', Meteor.userId(), 'user_logout', userName +' logged out', 'info');
		Meteor.logout();
		Router.go('home');
	},
});

toggleMenu = function() {
	let isOpen = Session.get('openMenu');
	if( isOpen ) {
		$('body').removeClass('show-menu')
	}
	else {
		$('body').addClass('show-menu')
	}
	Session.set('openMenu', !isOpen);
}