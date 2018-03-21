Template.mainDashboard.onRendered(function(){
	initMasonry();
	
	initTooltips();
	
	var dateRange = Session.get('dateRange');

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
});

Template.mainDashboard.onDestroyed(function(){
	$(document).off('keydown, keyup');
});