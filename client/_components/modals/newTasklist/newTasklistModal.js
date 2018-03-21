Template.newTasklistModal.events({
	//Prevent editin inputs (as they are text and not date type)
	'keypress #tasklistStartDate': function(e){
	    e.preventDefault();
	},
	'keypress #tasklistEndDate': function(e){
	    e.preventDefault();
	},

	'change #tasklistPlannedTime': function(e){
		e.preventDefault();

		if(e.target.value !== ''){ var newData = e.target.value; }
		else{
		    var newData = 0;
		    e.currentTarget.value = 0;
		}

		//Remove toasts if any
		$(document).find('#toast-container').remove();

		//Store for convenience
		var t = Template.instance();
		var submitBtn = $('#createNewTasklist');

		var projectId = $('#relatedProject').data('project');
		if(typeof projectId === 'string'){
			var project = Projects.findOne({_id:projectId});
		}

		var currentStartDate = $('#tasklistStartDate').attr('data-content');
		var currentEndDate = $('#tasklistEndDate').attr('data-content');

		//Convert input to total hours (planned time is saved in hours)
		var hours = parseStringToHours(newData);

		//Convert back to smart string
		var enhancedString = parseHoursToString(hours);

		e.target.value = enhancedString;
		$(e.target).attr('data-content', hours);

		//Build an obj with start/end date to pass to estimatedNewEndDate function
		var obj = {
			startDate: currentStartDate,
			endDate: currentEndDate,
		}

		var newDateRange = estimatedNewEndDate(hours, obj);
		//Store for convenience
		var newEndDate = newDateRange.newEndDate;

		//Convert to moment to format display in dialog
		currentEndDate = moment(currentEndDate)

		//Set some toast options (wait for user action and act accordingly)
		toastr.options.timeOut = 0;
		toastr.options.extendedTimeOut = 0;
		toastr.options.tapToDismiss = false;

		//Check if newEndDate is greater than project endDate
		console.log('#####################');
		if(typeof projectId === 'string'){
			if(moment(project.endDate).isBefore(newEndDate)){
				var afterProject = true;
			}
			else{
				var afterProject = false;
			}
		}
		else{
			console.log('no related project');
		}

		if(newDateRange.isBefore){
			
			submitBtn.attr('disabled', true);

			if(afterProject){
			    var body = ''
			                +'<p>The estimated end date <b>' + newEndDate.endOf('day').format("DD-MM-YYYY") + '</b> '
			                +'is ' + currentEndDate.to(newEndDate, true) +' ahead of the tasklist end date (' + currentEndDate.format("DD-MM-YYYY") + ') and ' + moment(project.endDate).to(newEndDate, true) + ' ahead of the project end date.'
			                +'<br>Do you wish to change to the estimated end date?</p>'
			                +'<div style="text-align:right;">'
			                +'<button type="button" id="pushTasklistAndProject" class="btn btn-primary">Change tasklist and project end date</button>'
			                +'<button type="button" id="pushTasklistOnly" class="btn btn-secondary">Change tasklist end date</button>'
			                +'<br>'
			                +'<button type="button" class="btn clear">Cancel</button>'
			                +'</div>';
			}
			else{
				var body = '<div>'
		                +'<p>The estimated end date <b>' + newEndDate.endOf('day').format("DD-MM-YYYY") + '</b> '
		                +'is ' + currentEndDate.to(newEndDate, true) +' ahead of your current end date (' + currentEndDate.format("DD-MM-YYYY") + ')'
		                +'<br>Do you wish to change to the estimated end date?</p>'
		                +'<button type="button" class="btn clear">Cancel</button>'
		                +'<button type="button" id="pushTasklistOnly" class="btn btn-primary pull-right">Yes</button></div>';
			}

		    var toast = toastr.warning(body, 'Change end date?');
		}

		
		//newEndDate is behind current date
		if(newDateRange.isAfter){
			
			submitBtn.attr('disabled', true);

			console.log('A. reset pushProjectDate to 0')
			t.$('#pushProjectDate').attr('data-value', 0);

		    var body = '<div>'
		                +'<p>The estimated end date <b>' + newEndDate.format("DD-MM-YYYY") + '</b> '
		                +'is ' + currentEndDate.from(newEndDate, true) +' behind your current end date (' + currentEndDate.format("DD-MM-YYYY") + ')'
		                +'<br>Do you wish to change to the estimated end date?</p>'
		                +'<button type="button" class="btn clear">Cancel</button>'
		                +'<button type="button" id="pushTasklistOnly" class="btn btn-primary pull-right">Yes</button></div>';

		    var toast = toastr.warning(body, 'Change end date?');
		}

		resetToastrOptions();

		//Finally, wait for user input before calling update method
		if(typeof toast !== 'undefined'){

		    if (toast.find('#pushTasklistAndProject').length) {
		        toast.delegate('#pushTasklistAndProject', 'click', function () {
		            console.log('pushTasklistAndProject')
		            
		            t.$('#pushProjectDate').attr('data-value', 1);
		            
		            //console.log(hours, newEndDate.toDate())
		            $('#tasklistEndDate').val( formatDate(newEndDate.toDate(), 'DD/MM/YYYY') );
		            $('#tasklistEndDate').attr('data-content', newEndDate.toDate());
		            $('#tasklistEndDate').attr('placeholder', formatDate(newEndDate.toDate(), 'DD/MM/YYYY') );
		            
		            //Set input value in hours
		            $(e.currentTarget).attr('data-content', hours);

		            toast.remove();
		            
		            initTasklistDatepickers(moment(currentStartDate).toDate(), newEndDate.toDate())
		            
		            submitBtn.attr('disabled', false);

		        });
		    }

		    if (toast.find('#pushTasklistOnly').length) {
		        toast.delegate('#pushTasklistOnly', 'click', function () {
		            console.log('pushTasklistOnly')
		            console.log(hours, newEndDate.toDate())
		            $('#tasklistEndDate').val( formatDate(newEndDate.toDate(), 'DD/MM/YYYY') );
		            $('#tasklistEndDate').attr('data-content', newEndDate.toDate());
		            $('#tasklistEndDate').attr('placeholder', formatDate(newEndDate.toDate(), 'DD/MM/YYYY') );
		            
		            toast.remove();

		            //Set input value in hours
		            $(e.currentTarget).attr('data-content', hours);

		            initTasklistDatepickers(moment(currentStartDate).toDate(), newEndDate.toDate())
		            
		            submitBtn.attr('disabled', false);

		        });
		    }

		    if (toast.find('.clear').length) {
		        toast.delegate('.clear', 'click', function () {
		            toast.remove();
		            submitBtn.attr('disabled', false);
		        });
		    }
		}

		//if(e.currentTarget.getAttribute('data-content') != hours){
		    //Check when is the possible end date (depending on estimation)
		    //estimateEndDateAndUpdateProject(project, hours);
		//};
	},

	'click .modal-primary-action': function(e){
		e.preventDefault();

		if($(e.currentTarget).is(':disabled')){
			return;
		}


		//--- Validate form ---
		var form = Template.instance().$('#newTasklistForm');
		var modal = form.closest('.modal');

		//Flag used to set whether we want to create a new tasklist or just update
		var updateTasklist = false;
		var existingTasklistId = form.attr('data-tasklist');
		if(typeof existingTasklistId !== 'undefined' && existingTasklistId !== ''){
			updateTasklist = true;
		}

		//Validate form fields
		var failedFields = false;

		//Remove error classes
		form.find('.error').removeClass('error');

		//Name input
		var tasklistNameInput = form.find('#tasklistName');

		if(tasklistNameInput.val().length === 0 || tasklistNameInput.val() === ' '){
			failedFields = true;
			tasklistNameInput.addClass('error');
		}

		//Related Project Input
		var relatedProject = form.find('#relatedProject').attr('data-project');

		// Date inputs
		var startDateInput = form.find('#tasklistStartDate');
		var endDateInput = form.find('#tasklistEndDate');

		var tmpInput = startDateInput.attr('data-content');
        var startDate = moment(tmpInput)

        tmpInput = endDateInput.attr('data-content');
        var endDate = moment(tmpInput);

        if(!startDate.isValid()){
        	failedFields = true;
        	startDateInput.addClass('error');
        }
        if(!endDate.isValid()){
        	failedFields = true;
        	endDateInput.addClass('error');
        }

		//Planned time
		var plannedTime = form.find('#tasklistPlannedTime').attr('data-content')
		//console.log('plannedTime: ' + plannedTime)
		if(typeof plannedTime === 'undefined' || typeof parseInt(plannedTime) !== 'number'){
			failedFields = true;
			form.find('#tasklistPlannedTime').addClass('error');
		}

		//State
		var stateEl = modal.find('.tasklistState');
		var stateText = stateEl.attr('data-state');
		var stateVal = stateEl.attr('data-value');

		console.log(stateVal, stateText)

		if(typeof stateVal === 'undefined' || typeof parseInt(stateVal) !== 'number'){
			failedFields = true;
			stateEl.addClass('error');
			toastr.warning('Please set a state.', 'Invalid fields');
		}

		//Priority
		var priorityEl = modal.find('#tasklistPriority');
		var priorityText = priorityEl.attr('data-priority');
		var priorityVal = priorityEl.attr('data-value');

		if(typeof priorityVal === 'undefined' || typeof parseInt(priorityVal) !== 'number'){
			failedFields = true;
			priorityEl.addClass('error');
			toastr.warning('Please set a priority.', 'Invalid fields');
		}

		//Finally, dispatch updates if no fields failed
		if(failedFields){
			toastr.error('Please correct the fields with errors', 'Invalid fields');
		}
		else{
			//Check if we want to also update project end date
			var updateProject = form.find('#pushProjectDate').data('value');
			if(parseInt(updateProject) === 1){
				console.log('Update project end date')
			}

			//Either update or create a new tasklist
			if(updateTasklist){
				console.log('Update tasklist ' + existingTasklistId)
				
				var newData = {
					name: tasklistNameInput.val(),
					startDate: startDate.toDate(),
					endDate: endDate.toDate(),
					plannedTime: parseInt(plannedTime),
					priority: parseInt(priorityVal),
					priorityText: priorityText,
					state: parseInt(stateVal),
					stateText: stateText,
					//project: relatedProject,
				}

				Meteor.call('updateTasklist', existingTasklistId, newData, function(err, data){
					if(!err){
						
						toastr.success('Tasklist updated.');
						
						modal.closeModal();
						//Reset priority
						priorityEl.removeClass('very-high high normal low very-low').addClass('normal');
						priorityEl.find('.submenu-title').html('<i class="fa normal"></i> Normal');
						priorityEl.attr('data-priority', 'normal');
						priorityEl.attr('data-value', 0);
						//Reset state
						stateEl.removeClass('to-do doing done paused').addClass('to-do');
						stateEl.find('.submenu-title').html('<i class="fa to-do"></i> To do');
						stateEl.attr('data-state', 'to-do');
						stateEl.attr('data-value', 0);

						form[0].reset();
					}
					else{
						console.log(err)
						toastr.error(err.message, 'Error updating tasklist.')	
					}
				})
			}
			else{
				console.log('Create tasklist')
				var newData = {
					name: tasklistNameInput.val(),
					startDate: startDate.toDate(),
					endDate: endDate.toDate(),
					plannedTime: parseInt(plannedTime),
					priority: parseInt(priorityVal),
					priorityText: priorityText,
					state: parseInt(stateVal),
					stateText: stateText,
					project: relatedProject,
				}

				console.log('Save new tasklist')
				Meteor.call('createNewTasklist', newData, function(err, data){
					if(!err){
						var modal = form.closest('.modal');
						toastr.success('New tasklist inserted.');
						
						modal.closeModal();
						//Reset priority
						priorityEl.removeClass('very-high high normal low very-low').addClass('normal');
						priorityEl.find('.submenu-title').html('<i class="fa normal"></i> Normal');
						priorityEl.attr('data-priority', 'normal');
						priorityEl.attr('data-value', 0);
						
						//Reset state
						stateEl.removeClass('to-do doing done paused').addClass('to-do');
						stateEl.find('.submenu-title').html('<i class="fa to-do"></i> To do');
						stateEl.attr('data-state', 'to-do');
						stateEl.attr('data-value', 0);
						form[0].reset();
					}
					else{
						console.log(err)
						toastr.error(err.message, 'Error inserting tasklist.')	
					}
				});
			}
		}

	}
})

Template.newTasklistModal.onRendered(function(){

	initTooltips();

	//Datepicker events

	/*

	startDate.on('apply.daterangepicker', function(e, picker) {
	    
	    var target = e.currentTarget;
	    var newData = target.value;
	    var projectId = project._id;

	    //Build moment object from parsing input
	    var dateItems = newData.split('/');
	    var date = moment().date(parseInt(dateItems[0])).month(parseInt(dateItems[1]-1)).year(parseInt(dateItems[2])).startOf('day');


	    //Check if chosen date is not > than current end date
	    var endDate = $(document).find('#endDate').data('content')
	    if(date.isAfter(endDate)){
	        //FUTURE: Ask if user wants to push all project planing forward

	        toastr.options.timeOut = 8000;
	        toastr.error('Cannot set start date after current end date.');
	        console.log(target.getAttribute('placeholder'));
	        resetToastrOptions();

	    }
	    else{
	        if(target.getAttribute('data-content') != date.toDate()){
	            //target.innerHTML = '';
	            if(date.isValid()){
	                console.log('update project start date')
	                Meteor.call('saveProjectStartDate', projectId, date.utc().toDate(), function(err){
	                    if(!err){
	                        toastr.success('Set start date to <b> '+ date.format('DD-MM-YYYY') +'</b>');
	                    }
	                    else{
	                        toastr.error('Error setting date to <b> '+ date.format('DD-MM-YYYY') +'</b>');
	                    }
	                });
	            }
	            else{
	                toastr.error('Invalid date input.');
	            }
	        }
	    }

	});

	endDate.on('apply.daterangepicker', function(e, picker) {
	    
	    var target = e.currentTarget;
	    var newData = target.value;
	    var projectId = project._id;

	    //Build moment object
	    var dateItems = newData.split('-');
	    var date = moment().date(parseInt(dateItems[0])).month(parseInt(dateItems[1]-1)).year(parseInt(dateItems[2])).endOf('day');

	    if(target.getAttribute('data-content') != date.toDate()){
	        //target.innerHTML = '';
	        if(date.isValid()){

	            Meteor.call('saveProjectEndDate', projectId, date.utc().toDate(), function(err){
	                if(!err){
	                    toastr.success('Set delivery date to <b> '+ newData +'</b>, ' + moment().to(date));
	                }
	                else{
	                    toastr.error('Error setting date to <b> '+ newData +'</b>, ');
	                }
	            });
	        }
	        else{
	            toastr.error('Invalid date input.');
	        }
	    }
	});

	*/

})