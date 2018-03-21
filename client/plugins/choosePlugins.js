import { bowser } from 'meteor/flowkey:bowser';

Template.choosePlugins.onRendered(function(){
	var OS = getOS();

	//$('.affix').affix();
	
	$('.main-content').scrollspy({
		target: '.scrollspy',
		offset: 0
	});

	Session.set('userBrowser', bowser);
	Session.set('userOS', OS);

	// if (Meteor.user().joyrides.plugins){
	// 	Meteor.setTimeout(function(){
	// 		initPluginsJoyride();
	// 	}, 1000);
	// }
});

Template.choosePlugins.onDestroyed(function(){
	$(document).off('click', '.close-modal-tip');
});