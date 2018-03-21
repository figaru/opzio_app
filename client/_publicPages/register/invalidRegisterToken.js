Template.invalidRegisterToken.onCreated(function(){
	count = 10;
	Session.set('counter', count);

	interval = Meteor.setInterval(function(){
		Session.set('counter', count--);
	}, 1000)
});

Template.invalidRegisterToken.onRendered(function(){
	$('.gn-menu-main').removeClass('expanded');

	Meteor.setTimeout(function(){
		Meteor.clearInterval(interval);
		window.location = 'https://opz.io';
	}, 10000);
});

Template.invalidRegisterToken.helpers({
	'counter': function(){
		return Session.get('counter');
	}
});

Template.invalidRegisterToken.onDestroyed(function(){
	Meteor.clearInterval(interval);
});