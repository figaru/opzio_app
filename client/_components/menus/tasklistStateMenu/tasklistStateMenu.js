//Sets the current button values data to selected ones (used to later save)
Template.tasklistStateMenu.events({
	'click .menu-option.state': function(e){
		e.preventDefault();

		var priorityMap = {
			'to-do': 'To do',
			'doing': 'Doing',
			'done': 'Done',
			'paused': 'Paused',
		}

		var buttonEl = $(e.currentTarget).parent().prev();
		var optionEl = $(e.currentTarget);
		
		var currentState = buttonEl.attr('data-state');
		var currentStateVal = buttonEl.attr('data-value');

		var selectedState = optionEl.attr('data-state');
		var selectedStateVal = optionEl.attr('data-value');

		if(typeof currentState !== 'undefined' && currentStateVal !== 'undefined'){
			if(typeof selectedState !== 'undefined' && selectedStateVal !== 'undefined'){
				if(currentState !== selectedState){
					//Clear all classes from button
					buttonEl.removeClass('to-do doing done paused');

					//Change data of current values to selected
					buttonEl.attr('data-state', selectedState);
					buttonEl.attr('data-value', selectedStateVal);
					buttonEl.addClass(selectedState);
					buttonEl.find('.submenu-title').html('<i class="fa '+ selectedState +'"></i> '+ priorityMap[selectedState]);
				}
			}
		}


	}
})