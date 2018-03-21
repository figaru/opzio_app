//Sets the current button values data to selected ones (used to later save)
Template.projectStateMenu.events({
	'click .menu-option a': function(e){
		e.preventDefault();

		var priorityMap = {
			'initiate': 'Initiate',
			'plan': 'Planning',
			'execute': 'Executing',
			'maintain': 'Maintaining',
			'delivered': 'Delivered',
			'paused': 'Paused',
			'dropped': 'Dropped',
		}

		var optionEl = $(e.currentTarget).parent();
		var buttonEl = $(optionEl[0]).parent().prev();

		var currentState = buttonEl.attr('data-state');
		var currentStateVal = buttonEl.attr('data-value');

		var selectedState = optionEl.attr('data-state');
		var selectedStateVal = optionEl.attr('data-value');

		if(typeof currentState !== 'undefined' && currentStateVal !== 'undefined'){
			if(typeof selectedState !== 'undefined' && selectedStateVal !== 'undefined'){
				if(currentState !== selectedState){
					//Clear all classes from button
					buttonEl.removeClass('initiate plan execute maintaing delivered paused dropped');

					//Change data of current values to selected
					buttonEl.attr('data-state', selectedState);
					buttonEl.attr('data-value', selectedStateVal);
					buttonEl.addClass(selectedState);
					buttonEl.find('.submenu-title').html('<i class="fa '+ selectedState +'"></i> '+ priorityMap[selectedState]);
				}
			}
		}
	}
});
