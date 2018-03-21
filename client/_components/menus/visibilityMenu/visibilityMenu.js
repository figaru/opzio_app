//Sets the current button values data to selected ones (used to later save)
Template.visibilityMenu.events({
	'click .menu-option a': function(e){
		e.preventDefault();

		var priorityMap = {
			'public': {
				label: 'Public',
				icon: 'fa-eye'
			},
			'internal': {
				label: 'Internal',
				icon: 'fa-low-vision'
			},
			'private': {
				label: 'Private',
				icon: 'fa-eye-slash'
			},
		}

		var optionEl = $(e.currentTarget).parent();
		var buttonEl = $(optionEl[0]).parent().prev();

		var currentVisibility = buttonEl.attr('data-visibility');
		var currentVisibilityVal = buttonEl.attr('data-value');

		var selectedVisibility = optionEl.attr('data-visibility');
		var selectedVisibilityVal = optionEl.attr('data-value');

		if(typeof currentVisibility !== 'undefined' && currentVisibilityVal !== 'undefined'){
			if(typeof selectedVisibility !== 'undefined' && selectedVisibilityVal !== 'undefined'){
				if(currentVisibility !== selectedVisibility){
					//Change data of current values to selected
					buttonEl.attr('data-visibility', selectedVisibility);
					buttonEl.attr('data-value', selectedVisibilityVal);
					buttonEl.find('.submenu-title').html('<i class="fa '+ priorityMap[selectedVisibility].icon +'"></i> '+ priorityMap[selectedVisibility].label );
				}
			}
		}
	}
});
