//Sets the current button values data to selected ones (used to later save)
Template.priorityMenu.events({
	'click .menu-option.priority': function(e){
		e.preventDefault();

		var priorityMap = {
			'very-high': 'Very high',
			'high': 'High',
			'normal': 'Normal',
			'low': 'Low',
			'very-low': 'Very low',
		}

		var buttonEl = $('.priorityMenu');
		var optionEl = $(e.currentTarget);
		
		var currentPriority = buttonEl.attr('data-priority');
		var currentPriorityVal = buttonEl.attr('data-value');

		var selectedPriority = optionEl.attr('data-priority');
		var selectedPriorityVal = optionEl.attr('data-value');

		if(typeof currentPriority !== 'undefined' && currentPriorityVal !== 'undefined'){
			if(typeof selectedPriority !== 'undefined' && selectedPriorityVal !== 'undefined'){
				if(currentPriority !== selectedPriority){
					//Clear all classes from button
					buttonEl.removeClass('very-high high normal low very-low');

					//Change data of current values to selected
					buttonEl.attr('data-priority', selectedPriority);
					buttonEl.attr('data-value', selectedPriorityVal);
					buttonEl.addClass(selectedPriority);
					buttonEl.find('.submenu-title').html('<i class="fa '+ selectedPriority +'"></i> '+ priorityMap[selectedPriority]);
				}
			}
		}


	}
})