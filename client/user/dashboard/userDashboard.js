Template.userDashboard.onRendered(function(){
	//Call joyride if user never saw/reset joyrides
	/*
	if(!Meteor.user().mainIntro.show){
		if (Meteor.user().joyrides.userDashboard){
			Meteor.setTimeout(function(){
				initUserDashboardJoyride();
			}, 500);
		}
	}
	*/

	Meteor.setTimeout(function(){
		checkForPlugins();
	}, 5000);

	/*######
		KEYBOARD EVENTS
	######*/
	$(document).on('keydown, keyup', function(e){
		e.preventDefault();
		var activeEl = $(document.activeElement);
		//console.log(e.keyCode)
		switch(e.keyCode){
			case 37: //Left Arrow - search
				/* Avoids changin period in case we're focusing and input */
				if(activeEl[0].nodeName === 'BODY'){ 
					var dateRange = Session.get('dateRange');
					goToPrevRange(dateRange);
				}
				break;
			case 39: //Right Arrow - search
				if(activeEl[0].nodeName === 'BODY'){ 
					var dateRange = Session.get('dateRange');
					goToNextRange(dateRange);
				}
				break;
		}
	});
	$(document).on('click', '#sendUserToSettings', function(e){
		e.preventDefault();
		//console.log('click next!')
		Router.go('userSettings', { userId: Meteor.userId() });
	})
});

Template.userDashboard.onDestroyed(function(){
	$(document).off('keydown, keyup');
});