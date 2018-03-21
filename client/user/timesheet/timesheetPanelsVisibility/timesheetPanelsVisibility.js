Template.timesheetPanelsVisibility.events({
	'click .toggleValid': function(e, t){
		e.preventDefault();
		console.log('yey!')
		var $validLogs = t.$('tr[data-validated=true]');
		
		if(e.currentTarget.getAttribute('data-action') === 'hide'){
			//$(e.currentTarget).attr('data-action', 'show').html('<i class="fa fa-eye"></i> Show Valid');
			console.log('show')
			toggleValidVisibility('hide');
		}
		else{
			//$(e.currentTarget).attr('data-action', 'hide').html('<i class="fa fa-eye-slash"></i> Hide Valid')
			console.log('hide')
			toggleValidVisibility('display');
		}

		Meteor.setTimeout(function(){
			reloadMasonry();
		},100);
	},

	'click .panelsAction': function(e, t){
		var $panels = t.$('.panel');

		var collapsed = Session.get('panelsCollapsed');

		if(typeof collapsed === 'undefined' || collapsed === true){
			Session.set('panelsCollapsed', false);
			_.each($panels, function(el, k){
				$(el).addClass('collapsed');
			});
		}
		else{
			Session.set('panelsCollapsed', true);
			_.each($panels, function(el, k){
				$(el).removeClass('collapsed');
			});
		}

		Meteor.setTimeout(function(){
			reloadMasonry();
		},100);
	}
});

//Switches the visibility of individual logs
toggleValidVisibility = function(visibility){
	var $validLogs = $(document).find('tr[data-validated=true]');
	
	switch(visibility){
		case 'hide':
			Session.set('hideValid', true);
			_.each($validLogs, function(el, k){
				$(el).hide().addClass('hidden');
			});
			break;

		case 'display':
		default:
			Session.set('hideValid', false);
			_.each($validLogs, function(el, k){
				$(el).show().removeClass('hidden');
			});
			break;
	}
}