//Sets the current button values data to selected ones (used to later save)
Template.userRoleMenu.events({
	'click .menu-option a': function(e){
		e.preventDefault();

		var rolesMap = {
			'admin': 'Administrator',
			'member': 'Member',
		}

		var optionEl = $(e.currentTarget).parent();
		var buttonEl = $(optionEl[0]).parent().prev();

		var currentRole = buttonEl.attr('data-role');
		var currentRoleVal = buttonEl.attr('data-value');

		var selectedRole = optionEl.attr('data-role');
		var selectedRoleVal = optionEl.attr('data-value');

		if(typeof currentRole !== 'undefined' && currentRoleVal !== 'undefined'){
			if(typeof selectedRole !== 'undefined' && selectedRoleVal !== 'undefined'){
				if(currentRole !== selectedRole){
					//Change data of current values to selected
					buttonEl.attr('data-role', selectedRole);
					buttonEl.attr('data-value', selectedRoleVal);
					buttonEl.addClass(selectedRole);
					buttonEl.find('.submenu-title').html('<i class="fa '+ selectedRole +'"></i> '+ rolesMap[selectedRole]);
				}
			}
		}
	}
});
