dragTasklistRange = function(item){
	var currentStartDate = moment(item.inititalStart);
	var newStartDate = moment(item.start);
	var currentEndDate = moment(item.inititalEnd);
	var newEndDate = moment(item.end);

	var updateItem = item;

	if(!currentStartDate.isSame(newStartDate)){
		updateItem['updateStart'] = true;
		
		if(currentStartDate.isBefore(newStartDate)){
			console.log('start date dragged forward')
		}
		if(currentStartDate.isAfter(newStartDate)){
			console.log('start date dragged back')
		}
	}

	if(!currentEndDate.isSame(newEndDate)){
		updateItem['updateEnd'] = true;

		if(currentEndDate.isBefore(newEndDate)){
			console.log('end date dragged forward')
		}
		if(currentEndDate.isAfter(newEndDate)){
			console.log('end date dragged back')
		}
	}

	Meteor.call('updateTasklistRange', updateItem, function(err, data){
		if(!err){
			toastr.info('Tasklist updated.')
		}
	});
}

updateTimelineItem = function(item){
	var modal = $('#newTasklistModal');
	var form = modal.find('#newTasklistForm');


	//--- Populate modal ---
	//Set tasklist code name
	modal.find('#tasklistCodeName').text(item.codeName);

	//--- Populate/reset form ---
	form.find('#tasklistName').val(item.name);
	//Remove error classes
	form.find('.error').removeClass('error');
	
	form.attr('data-tasklist', item.group);

	//Set start/end date
	initTasklistDatepickers(item.start, item.end);

	//Set planned time
	var smartString = parseHoursToString(item.plannedTime)
	form.find('#tasklistPlannedTime').val(smartString)
	form.find('#tasklistPlannedTime').attr('data-content',item.plannedTime);

	//Set priority
	var buttonEl = modal.find('#tasklistPriority');
	var priorityText = item.priorityText;
	var priority = item.priority;
	var priorityMap = {
		'very-high': 'Very high',
		'high': 'High',
		'normal': 'Normal',
		'low': 'Low',
		'very-low': 'Very low',
	}

	buttonEl.removeClass('very-high high normal low very-low');
	buttonEl.addClass(priorityText);
	buttonEl.find('.submenu-title').html('<i class="fa '+ item.priorityText  +'"></i> ' + priorityMap[item.priorityText]);
	buttonEl.attr('data-priority', priorityText);
	buttonEl.attr('data-value', priority);

	//Set state
	var buttonEl = modal.find('.tasklistState');
	var stateText = item.stateText;
	var state = item.state;
	var stateMap = {
		'to-do': 'To do',
		'doing': 'Doing',
		'done': 'Done',
		'paused': 'Paused',
	}

	buttonEl.removeClass('to-do doing done paused');
	buttonEl.addClass(stateText);
	buttonEl.find('.submenu-title').html('<i class="fa '+ item.stateText  +'"></i> ' + stateMap[item.stateText]);
	buttonEl.attr('data-state', stateText);
	buttonEl.attr('data-value', state);

	//Hide create button and display update
	modal.find('#createNewTasklist').hide();
	modal.find('#updateTasklist').show();

	//Finally, open modal
	modal.openModal();
	modal.find('form').find('input')[0].focus();
}