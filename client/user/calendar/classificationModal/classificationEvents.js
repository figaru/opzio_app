import interact from '/client/_compatibility/interactjs.min.js';

//Check if user wants to scroll up/down
$(document).on('mouseenter', '.scroller', function(e){
	var scrollInterval = setInterval(function(){
		var underneathElement = $(document.elementFromPoint(e.clientX, e.clientY));
		var currentScrollPos = $('.modal-options').scrollTop();

		if(underneathElement.hasClass('up')){
			if(currentScrollPos >=20) currentScrollPos -= 100;
			$('.modal-options').animate({
				scrollTop: currentScrollPos
			}, 100);
		}
		if(underneathElement.hasClass('down')){
			currentScrollPos += 100;
			$('.modal-options').animate({
				scrollTop: currentScrollPos
			}, 100);
		}
	}, 100);

	Session.set('scrollingEvent', scrollInterval);

});

/*
//Handle classification modal events
$(document).on('click touch', '.option', function(e){
	e.preventDefault();
	console.log('click an option')
	var droppedEl = $(e.currentTarget);
	var selectedLog = $('.fc-list-item.selectedActivity');
	var eventId = selectedLog.attr('id');
	var timeoutMs = 800;

	console.log(droppedEl)

	//Check if clicked global option or project
	if(droppedEl.hasClass('dropProject')){
		console.log('chose project');
		selectedLog.attr('data-validated', true);
		
		if(selectedLog.hasClass('fc-list-item')){
			selectedLog.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action btn btn-sm" title="You\'ve validated this activity"><i class="fa fa-check-circle-o eventAction"></i></span>');
		}
		else{
			selectedLog.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action" title="You\'ve validated this activity"><i class="fa fa-check-circle-o eventAction"></i></span>');
		}


		toastr.options.timeOut = 5000;
		toastr.options.extendedTimeOut = 1000;
		toastr.options.tapToDismiss = false;
		toastr.options.preventDuplicates = true;

		//Updates are actually performed uppon toast hide
		toastr.options.onHidden = function(){
			updateLogClassification(selectedLog, selectedLog, droppedEl);
		}

		if(selectedLog.attr('data-currentproject') !== droppedEl.attr('data-project')){
			var toastMsg = 'Changing project to '+ getProjectFromID(droppedEl.attr('data-project')) +'.';
		}
		else{
			var toastMsg = 'Validated activity.';
		}

		whitheldEvents[eventId] = toastr.info('<i class="fa fa-check-circle-o text-success"></i>&nbsp;&nbsp;'+ toastMsg +' <div class="toast-actions"><button class="toast-close-button close" type="button" aria-label="Close"><span aria-hidden="true">&times;</span></button><a href="#" class="btn btn-sm btn-link pull-right cancelWhitheldEvent">Undo</a></div>');

		resetToaster();

		//Clear timeout when user press cancel
		whitheldEvents[eventId].delegate('.cancelWhitheldEvent', 'click', function(){
			selectedLog.attr('data-validated', false);
			if(selectedLog.hasClass('fc-list-item')){
				selectedLog.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action btn btn-sm" title="You haven\'t validated this activity"><i class="fa fa-circle-o eventAction"></i></span>');
			}
			else{
				selectedLog.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action" title="You haven\'t validated this activity"><i class="fa fa-circle-o eventAction"></i></span>');
			}
			whitheldEvents[eventId].remove();
		});

		//Clear toastr on close
		whitheldEvents[eventId].delegate('.toast-close-button', 'click', function(e){
			whitheldEvents[eventId].remove()
			updateLogClassification(selectedLog, selectedLog, droppedEl);
		});
	}
	else{
		var attribute = droppedEl.attr('data-action');
		
		console.log('clicked ' + attribute)

		switch(attribute){
			case 'validate':
				selectedLog.attr('data-validated', true);
				if(selectedLog.hasClass('fc-list-item')){
					selectedLog.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action btn btn-sm" title="You\'ve validated this activity"><i class="fa fa-check-circle-o eventAction"></i></span>');
				}
				else{
					selectedLog.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action" title="You\'ve validated this activity"><i class="fa fa-check-circle-o eventAction"></i></span>');
				}

				toastr.options.timeOut = 5000;
				toastr.options.extendedTimeOut = 1000;
				toastr.options.tapToDismiss = false;
				toastr.options.preventDuplicates = true;

				//Updates are actually performed uppon toast hide
				toastr.options.onHidden = function(){
					updateLogValidation(selectedLog, selectedLog);
				}

				var toastMsg = 'Validating activity as '+ getProjectFromID(selectedLog.attr('data-currentproject')) +'.';

				whitheldEvents[eventId] = toastr.info('<i class="fa fa-check-circle-o text-success"></i>&nbsp;&nbsp;'+ toastMsg +' <div class="toast-actions"><button class="toast-close-button close" type="button" aria-label="Close"><span aria-hidden="true">&times;</span></button><a href="#" class="btn btn-sm btn-link pull-right cancelWhitheldEvent">Undo</a></div>');

				resetToaster();

				//Clear timeout when user press cancel
				whitheldEvents[eventId].delegate('.cancelWhitheldEvent', 'click', function(){
					selectedLog.attr('data-validated', false);
					if(selectedLog.hasClass('fc-list-item')){
						selectedLog.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action btn btn-sm" title="You haven\'t validated this activity"><i class="fa fa-circle-o eventAction"></i></span>');
					}
					else{
						selectedLog.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action" title="You haven\'t validated this activity"><i class="fa fa-circle-o eventAction"></i></span>');
					}
					whitheldEvents[eventId].remove();
				});

				//Clear toastr on close
				whitheldEvents[eventId].delegate('.toast-close-button', 'click', function(e){
					whitheldEvents[eventId].remove();
					updateLogValidation(selectedLog, selectedLog);
				});
				break;

			//## SET LOG AS PRIVATE
			case 'private':
				selectedLog.attr('data-private', true);

				if(selectedLog.hasClass('fc-list-item')){
					selectedLog.find('.changePrivacy').replaceWith('<span class="eventAction changePrivacy action btn btn-sm" title="Only you can see this activity"><i class="fa fa-low-vision eventAction"></i></span>');
				}
				else{
					selectedLog.find('.changePrivacy').replaceWith('<span class="eventAction changePrivacy action" title="Only you can see this activity"><i class="fa fa-low-vision eventAction"></i></span>');
				}

				toastr.options.timeOut = 5000;
				toastr.options.extendedTimeOut = 1000;
				toastr.options.tapToDismiss = false;
				toastr.options.preventDuplicates = true;

				//Updates are actually performed uppon toast hide
				toastr.options.onHidden = function(){
					updateLogPrivacy(selectedLog, selectedLog, true);
				}

				var toastMsg = 'Set activity as private.';

				whitheldEvents[eventId] = toastr.info('<i class="fa fa-low-vision"></i>&nbsp;&nbsp;'+ toastMsg +' <div class="toast-actions"><button class="toast-close-button close" type="button" aria-label="Close"><span aria-hidden="true">&times;</span></button><a href="#" class="btn btn-sm btn-link pull-right cancelWhitheldEvent">Undo</a></div>');

				resetToaster();

				//Clear timeout when user press cancel
				whitheldEvents[eventId].delegate('.cancelWhitheldEvent', 'click', function(){
					selectedLog.attr('data-private', false);
					if(selectedLog.hasClass('fc-list-item')){
						selectedLog.find('.changePrivacy').replaceWith('<span class="eventAction changePrivacy action btn btn-sm" title="This activity can be seen by others in your organization"><i class="fa fa-eye eventAction"></i></span>');
					}
					else{
						selectedLog.find('.changePrivacy').replaceWith('<span class="eventAction changePrivacy action" title="This activity can be seen by others in your organization"><i class="fa fa-eye eventAction"></i></span>');
					}
					whitheldEvents[eventId].remove();
				});

				//Clear toastr on close
				whitheldEvents[eventId].delegate('.toast-close-button', 'click', function(e){
					whitheldEvents[eventId].remove();
					updateLogPrivacy(selectedLog, selectedLog, true);
				});
				break;

			//## SET LOG AS PUBLIC
			case 'public':
				selectedLog.attr('data-private', false);

				if(selectedLog.hasClass('fc-list-item')){
					selectedLog.find('.changePrivacy').replaceWith('<span class="eventAction changePrivacy action btn btn-sm" title="This activity can be seen by others in your organization"><i class="fa fa-eye eventAction"></i></span>');
				}
				else{
					selectedLog.find('.changePrivacy').replaceWith('<span class="eventAction changePrivacy action" title="This activity can be seen by others in your organization"><i class="fa fa-eye eventAction"></i></span>');
				}

				toastr.options.timeOut = 5000;
				toastr.options.extendedTimeOut = 1000;
				toastr.options.tapToDismiss = false;
				toastr.options.preventDuplicates = true;

				//Updates are actually performed uppon toast hide
				toastr.options.onHidden = function(){
					updateLogPrivacy(selectedLog, selectedLog, false);
				}

				var toastMsg = 'Set activity as public.';

				whitheldEvents[eventId] = toastr.info('<i class="fa fa-eye"></i>&nbsp;&nbsp;'+ toastMsg +' <div class="toast-actions"><button class="toast-close-button close" type="button" aria-label="Close"><span aria-hidden="true">&times;</span></button><a href="#" class="btn btn-sm btn-link pull-right cancelWhitheldEvent">Undo</a></div>');

				resetToaster();

				//Clear timeout when user press cancel
				whitheldEvents[eventId].delegate('.cancelWhitheldEvent', 'click', function(){
					selectedLog.attr('data-private', true);
					if(selectedLog.hasClass('fc-list-item')){
						selectedLog.find('.changePrivacy').replaceWith('<span class="eventAction changePrivacy action btn btn-sm" title="Only you can see this activity"><i class="fa fa-low-vision eventAction"></i></span>');
					}
					else{
						selectedLog.find('.changePrivacy').replaceWith('<span class="eventAction changePrivacy action" title="Only you can see this activity"><i class="fa fa-low-vision eventAction"></i></span>');
					}
					whitheldEvents[eventId].remove();
				});

				//Clear toastr on close
				whitheldEvents[eventId].delegate('.toast-close-button', 'click', function(e){
					whitheldEvents[eventId].remove();
					updateLogPrivacy(selectedLog, selectedLog, false);
				});
				break;
			//## DELETE LOG
			case 'delete':
				if(selectedLog.hasClass('fc-list-item')){
					selectedLog.removeClass('forceEventVisibility').addClass('hidden');
				}
				else{
					selectedLog.addClass('hidden');	
				}

				toastr.options.timeOut = 10000;
				toastr.options.extendedTimeOut = 5000;
				toastr.options.tapToDismiss = false;
				toastr.options.preventDuplicates = true;

				//Updates are actually performed uppon toast hide
				toastr.options.onHidden = function(){
					deleteLog(selectedLog, selectedLog);
					selectedLog.remove();
				}

				var toastMsg = 'Deleted activity.';

				whitheldEvents[eventId] = toastr.info('<i class="fa fa-trash-o"></i>&nbsp;&nbsp;'+ toastMsg +' <div class="toast-actions"><button class="toast-close-button close" type="button" aria-label="Close"><span aria-hidden="true">&times;</span></button><a href="#" class="btn btn-sm btn-link pull-right cancelWhitheldEvent">Undo</a></div>');

				resetToaster();

				//Clear timeout when user press cancel
				whitheldEvents[eventId].delegate('.cancelWhitheldEvent', 'click', function(){
					if(selectedLog.hasClass('fc-list-item')){
						selectedLog.removeClass('hidden').addClass('forceEventVisibility');
					}
					else{
						selectedLog.removeClass('hidden');	
					}
					whitheldEvents[eventId].remove();
				});

				//Clear toastr on close
				whitheldEvents[eventId].delegate('.toast-close-button', 'click', function(e){
					
					whitheldEvents[eventId].remove();
					deleteLog(selectedLog, selectedLog);
					selectedLog.remove();

				});
				break;


			default:
			case 'cancel':
				timeoutMs = 1;
				break;
		}
	}

	selectedLog.removeClass('selectedActivity');
	
	$('.modal-options').scrollTop(0);
	
	Meteor.setTimeout(function(){
		$('#projectDropdownModal').removeClass('visible');
		$('#projectDropdownModal').find('.validateProject').attr('disabled', false).removeClass('disabled');
		$('#projectDropdownModal').find('.personalProject').attr('disabled', false).removeClass('disabled');
	}, timeoutMs);

});
*/

interact('.option')
.on('tap', function(e){
	console.log('tapped')
	var droppedEl = $(e.currentTarget);
	var selectedLog = $('.fc-list-item.selectedActivity');
	var eventId = selectedLog.attr('id');
	var timeoutMs = 800;

	console.log(droppedEl)
	console.log(selectedLog)
	
	if(droppedEl.hasClass('dropProject')){
		console.log('chose project');
		selectedLog.attr('data-validated', true);
		
		if(selectedLog.hasClass('fc-list-item')){
			selectedLog.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action btn btn-sm" title="You\'ve validated this activity"><i class="fa fa-check-circle-o eventAction"></i></span>');
		}
		else{
			selectedLog.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action" title="You\'ve validated this activity"><i class="fa fa-check-circle-o eventAction"></i></span>');
		}


		toastr.options.timeOut = 5000;
		toastr.options.extendedTimeOut = 1000;
		toastr.options.tapToDismiss = false;
		toastr.options.preventDuplicates = true;

		//Updates are actually performed uppon toast hide
		toastr.options.onHidden = function(){
			updateLogClassification(selectedLog, selectedLog, droppedEl);
		}

		if(selectedLog.attr('data-currentproject') !== droppedEl.attr('data-project')){
			var toastMsg = 'Changing project to '+ getProjectFromID(droppedEl.attr('data-project')) +'.';
		}
		else{
			var toastMsg = 'Validated activity.';
		}

		whitheldEvents[eventId] = toastr.info('<i class="fa fa-check-circle-o text-success"></i>&nbsp;&nbsp;'+ toastMsg +' <div class="toast-actions"><button class="toast-close-button close" type="button" aria-label="Close"><span aria-hidden="true">&times;</span></button><a href="#" class="btn btn-sm btn-link pull-right cancelWhitheldEvent">Undo</a></div>');

		resetToaster();

		//Clear timeout when user press cancel
		whitheldEvents[eventId].delegate('.cancelWhitheldEvent', 'click', function(){
			selectedLog.attr('data-validated', false);
			if(selectedLog.hasClass('fc-list-item')){
				selectedLog.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action btn btn-sm" title="You haven\'t validated this activity"><i class="fa fa-circle-o eventAction"></i></span>');
			}
			else{
				selectedLog.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action" title="You haven\'t validated this activity"><i class="fa fa-circle-o eventAction"></i></span>');
			}
			whitheldEvents[eventId].remove();
		});

		//Clear toastr on close
		whitheldEvents[eventId].delegate('.toast-close-button', 'click', function(e){
			whitheldEvents[eventId].remove()
			updateLogClassification(selectedLog, selectedLog, droppedEl);
		});
	}
	else{
		var attribute = droppedEl.attr('data-action');
		
		console.log('clicked ' + attribute)

		switch(attribute){
			case 'validate':
				selectedLog.attr('data-validated', true);
				if(selectedLog.hasClass('fc-list-item')){
					selectedLog.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action btn btn-sm" title="You\'ve validated this activity"><i class="fa fa-check-circle-o eventAction"></i></span>');
				}
				else{
					selectedLog.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action" title="You\'ve validated this activity"><i class="fa fa-check-circle-o eventAction"></i></span>');
				}

				toastr.options.timeOut = 5000;
				toastr.options.extendedTimeOut = 1000;
				toastr.options.tapToDismiss = false;
				toastr.options.preventDuplicates = true;

				//Updates are actually performed uppon toast hide
				toastr.options.onHidden = function(){
					updateLogValidation(selectedLog, selectedLog);
				}

				var toastMsg = 'Validating activity as '+ getProjectFromID(selectedLog.attr('data-currentproject')) +'.';

				whitheldEvents[eventId] = toastr.info('<i class="fa fa-check-circle-o text-success"></i>&nbsp;&nbsp;'+ toastMsg +' <div class="toast-actions"><button class="toast-close-button close" type="button" aria-label="Close"><span aria-hidden="true">&times;</span></button><a href="#" class="btn btn-sm btn-link pull-right cancelWhitheldEvent">Undo</a></div>');

				resetToaster();

				//Clear timeout when user press cancel
				whitheldEvents[eventId].delegate('.cancelWhitheldEvent', 'click', function(){
					selectedLog.attr('data-validated', false);
					if(selectedLog.hasClass('fc-list-item')){
						selectedLog.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action btn btn-sm" title="You haven\'t validated this activity"><i class="fa fa-circle-o eventAction"></i></span>');
					}
					else{
						selectedLog.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action" title="You haven\'t validated this activity"><i class="fa fa-circle-o eventAction"></i></span>');
					}
					whitheldEvents[eventId].remove();
				});

				//Clear toastr on close
				whitheldEvents[eventId].delegate('.toast-close-button', 'click', function(e){
					whitheldEvents[eventId].remove();
					updateLogValidation(selectedLog, selectedLog);
				});
				break;

			//## SET LOG AS PRIVATE
			case 'private':
				selectedLog.attr('data-private', true);

				if(selectedLog.hasClass('fc-list-item')){
					selectedLog.find('.changePrivacy').replaceWith('<span class="eventAction changePrivacy action btn btn-sm" title="Only you can see this activity"><i class="fa fa-low-vision eventAction"></i></span>');
				}
				else{
					selectedLog.find('.changePrivacy').replaceWith('<span class="eventAction changePrivacy action" title="Only you can see this activity"><i class="fa fa-low-vision eventAction"></i></span>');
				}

				toastr.options.timeOut = 5000;
				toastr.options.extendedTimeOut = 1000;
				toastr.options.tapToDismiss = false;
				toastr.options.preventDuplicates = true;

				//Updates are actually performed uppon toast hide
				toastr.options.onHidden = function(){
					updateLogPrivacy(selectedLog, selectedLog, true);
				}

				var toastMsg = 'Set activity as private.';

				whitheldEvents[eventId] = toastr.info('<i class="fa fa-low-vision"></i>&nbsp;&nbsp;'+ toastMsg +' <div class="toast-actions"><button class="toast-close-button close" type="button" aria-label="Close"><span aria-hidden="true">&times;</span></button><a href="#" class="btn btn-sm btn-link pull-right cancelWhitheldEvent">Undo</a></div>');

				resetToaster();

				//Clear timeout when user press cancel
				whitheldEvents[eventId].delegate('.cancelWhitheldEvent', 'click', function(){
					selectedLog.attr('data-private', false);
					if(selectedLog.hasClass('fc-list-item')){
						selectedLog.find('.changePrivacy').replaceWith('<span class="eventAction changePrivacy action btn btn-sm" title="This activity can be seen by others in your organization"><i class="fa fa-eye eventAction"></i></span>');
					}
					else{
						selectedLog.find('.changePrivacy').replaceWith('<span class="eventAction changePrivacy action" title="This activity can be seen by others in your organization"><i class="fa fa-eye eventAction"></i></span>');
					}
					whitheldEvents[eventId].remove();
				});

				//Clear toastr on close
				whitheldEvents[eventId].delegate('.toast-close-button', 'click', function(e){
					whitheldEvents[eventId].remove();
					updateLogPrivacy(selectedLog, selectedLog, true);
				});
				break;

			//## SET LOG AS PUBLIC
			case 'public':
				selectedLog.attr('data-private', false);

				if(selectedLog.hasClass('fc-list-item')){
					selectedLog.find('.changePrivacy').replaceWith('<span class="eventAction changePrivacy action btn btn-sm" title="This activity can be seen by others in your organization"><i class="fa fa-eye eventAction"></i></span>');
				}
				else{
					selectedLog.find('.changePrivacy').replaceWith('<span class="eventAction changePrivacy action" title="This activity can be seen by others in your organization"><i class="fa fa-eye eventAction"></i></span>');
				}

				toastr.options.timeOut = 5000;
				toastr.options.extendedTimeOut = 1000;
				toastr.options.tapToDismiss = false;
				toastr.options.preventDuplicates = true;

				//Updates are actually performed uppon toast hide
				toastr.options.onHidden = function(){
					updateLogPrivacy(selectedLog, selectedLog, false);
				}

				var toastMsg = 'Set activity as public.';

				whitheldEvents[eventId] = toastr.info('<i class="fa fa-eye"></i>&nbsp;&nbsp;'+ toastMsg +' <div class="toast-actions"><button class="toast-close-button close" type="button" aria-label="Close"><span aria-hidden="true">&times;</span></button><a href="#" class="btn btn-sm btn-link pull-right cancelWhitheldEvent">Undo</a></div>');

				resetToaster();

				//Clear timeout when user press cancel
				whitheldEvents[eventId].delegate('.cancelWhitheldEvent', 'click', function(){
					selectedLog.attr('data-private', true);
					if(selectedLog.hasClass('fc-list-item')){
						selectedLog.find('.changePrivacy').replaceWith('<span class="eventAction changePrivacy action btn btn-sm" title="Only you can see this activity"><i class="fa fa-low-vision eventAction"></i></span>');
					}
					else{
						selectedLog.find('.changePrivacy').replaceWith('<span class="eventAction changePrivacy action" title="Only you can see this activity"><i class="fa fa-low-vision eventAction"></i></span>');
					}
					whitheldEvents[eventId].remove();
				});

				//Clear toastr on close
				whitheldEvents[eventId].delegate('.toast-close-button', 'click', function(e){
					whitheldEvents[eventId].remove();
					updateLogPrivacy(selectedLog, selectedLog, false);
				});
				break;
			//## DELETE LOG
			case 'delete':
				if(selectedLog.hasClass('fc-list-item')){
					selectedLog.removeClass('forceEventVisibility').addClass('hidden');
				}
				else{
					selectedLog.addClass('hidden');	
				}

				toastr.options.timeOut = 10000;
				toastr.options.extendedTimeOut = 5000;
				toastr.options.tapToDismiss = false;
				toastr.options.preventDuplicates = true;

				//Updates are actually performed uppon toast hide
				toastr.options.onHidden = function(){
					deleteLog(selectedLog, selectedLog);
					selectedLog.remove();
				}

				var toastMsg = 'Deleted activity.';

				whitheldEvents[eventId] = toastr.info('<i class="fa fa-trash-o"></i>&nbsp;&nbsp;'+ toastMsg +' <div class="toast-actions"><button class="toast-close-button close" type="button" aria-label="Close"><span aria-hidden="true">&times;</span></button><a href="#" class="btn btn-sm btn-link pull-right cancelWhitheldEvent">Undo</a></div>');

				resetToaster();

				//Clear timeout when user press cancel
				whitheldEvents[eventId].delegate('.cancelWhitheldEvent', 'click', function(){
					if(selectedLog.hasClass('fc-list-item')){
						selectedLog.removeClass('hidden').addClass('forceEventVisibility');
					}
					else{
						selectedLog.removeClass('hidden');	
					}
					whitheldEvents[eventId].remove();
				});

				//Clear toastr on close
				whitheldEvents[eventId].delegate('.toast-close-button', 'click', function(e){
					
					whitheldEvents[eventId].remove();
					deleteLog(selectedLog, selectedLog);
					selectedLog.remove();

				});
				break;


			default:
			case 'cancel':
				timeoutMs = 1;
				break;
		}
	}

	selectedLog.removeClass('selectedActivity');
	
	$('.modal-options').scrollTop(0);
	
	Meteor.setTimeout(function(){
		$('#projectDropdownModal').removeClass('visible');
		$('#projectDropdownModal').find('.validateProject').attr('disabled', false).removeClass('disabled');
		$('#projectDropdownModal').find('.personalProject').attr('disabled', false).removeClass('disabled');
	}, timeoutMs);

});


//Scroll control when mouse leaves scroller elements
$(document).on('mouseleave', '.scroller', function(e){
	clearInterval(Session.get('scrollingEvent'))
	Session.set('scrollingEvent');
});