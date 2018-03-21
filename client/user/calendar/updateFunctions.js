updateLogClassification = function(target, element, droppedEl){
	if(target.attr('data-currentproject') !== droppedEl.attr('data-project')){
		
		var updateData = {
			logId: target.attr('id'),
			project: droppedEl.attr('data-project'),
		}

		Meteor.call('updateLogProject', updateData, function(err, data){
			if(!err){
				updateDayBadges(target);
				updatePeriodBadges();

				//badge badge-outline-default selectedProject 

				var selectedProject = Projects.findOne({ _id: droppedEl.attr('data-project') });
				
				element.attr('data-currentproject', selectedProject._id);
				
				if(target.hasClass('fc-list-item')){
					if(selectedProject.name === 'Personal'){
						var projectBadge = '<span class="badge badge-outline-default selectedProject mt-1 mr-2 pull-left miw-5 hidden-xs-down"><i class="fa fa-user"></i>&nbsp; '+ selectedProject.name +'</span>';
					}
					else{
						var projectBadge = '<span class="badge badge-outline-primary selectedProject mt-1 mr-2 pull-left miw-5 hidden-xs-down"><i class="fa fa-briefcase"></i>&nbsp; '+ selectedProject.name +'</span>';
					}
				}
				else{
					if(selectedProject.name === 'Personal'){
						var projectBadge = '<span class="badge badge-primary selectedProject"><i class="fa fa-user"></i>&nbsp; '+ selectedProject.name +'</span>';
					}
					else{
						var projectBadge = '<span class="badge badge-primary selectedProject"><i class="fa fa-briefcase"></i>&nbsp; '+ selectedProject.name +'</span>';
					}
				}

				element.find('.selectedProject').replaceWith(projectBadge);
			}
		})
	}
	//If selected project is the same as assumed by sistem, simply update validation
	else{
		Meteor.call('userLogs.updateValidation', target.attr('id'), true, function(err, data){
			//Update element content & attributes
			if(!err){
				updateDayBadges(target);
				updatePeriodBadges();

				var element = $('#'+target.attr('id'));
				element.attr('data-validated', true);
				if(target.hasClass('fc-list-item')){
					element.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action btn btn-sm" title="You\'ve validated this activity"><i class="fa fa-check-circle-o eventAction"></i></span>');
				}
				else{
					element.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action" title="You\'ve validated this activity"><i class="fa fa-check-circle-o eventAction"></i></span>');
				}
			}
		});
	}
}

updateLogValidation = function(target, element){
	Meteor.call('userLogs.updateValidation', target.attr('id'), true, function(err, data){
		//Update element content & attributes
		if(!err){
			updateDayBadges(target);
			updatePeriodBadges();
			
			var element = $('#'+target.attr('id'));
			element.attr('data-validated', true);
			//element.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action" title="You\'ve validated this activity"><i class="fa fa-check-circle-o eventAction"></i></span>');
		}
	});
}

updateLogPrivacy = function(target, element, privacy){
	Meteor.call('userLogs.updatePrivacy', target.attr('id'), privacy, function(err, data){
		//Update element content & attributes
		if(!err){
			updateDayBadges(target);
			updatePeriodBadges();
			
			var element = $('#'+target.attr('id'));
			element.attr('data-private', true);
			//element.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action" title="You\'ve validated this activity"><i class="fa fa-check-circle-o eventAction"></i></span>');
		}
	});
}

deleteLog = function(target, element){
	recalculateTotals(target);

	//Set element totaltime to 0 as updateDayBadges then increments that time
	target.attr('data-totaltime', 0);
	
	updateDayBadges(target);
	updatePeriodBadges();
	Meteor.call('userLogs.remove', target.attr('id'), function(err, data){
		//Update element content & attributes
	});
}