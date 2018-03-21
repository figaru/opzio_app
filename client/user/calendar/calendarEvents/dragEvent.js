import interact from '/client/_compatibility/interactjs.min.js';

//Drag events
interact('.draggable')
.draggable({
	onstart: function(e){
		var vW = $(window).width();
		var target = $(e.target);

		var x = e.clientX;
		var y = e.clientY;

		target = target.closest('.fc-event, .fc-list-item');


		var draggedElement = $('<div id="draggedElement" style="position:absolute;display:block;background:lime;"></div>');

		if(target.hasClass('fc-list-item')){
			draggedElement.addClass('list-element-drag');
			var elWidth = '320px';
			var elHeight = 'auto';
		}
		else{
			var elWidth = target.width();
			var elHeight = target.find('.event-wrapper').height();
		}
		
		draggedElement.css({
			height: elHeight,
			width: elWidth,
			top: y+'px',
			left: x+'px'
		});
		
		var cloneEl = target.clone();
		
		draggedElement.addClass(cloneEl[0].attributes[0].textContent)
		draggedElement.append(cloneEl[0].innerHTML)
		
		$('body').append(draggedElement);

		$(document).find('.option').addClass('drop-active');

		populateModal(target);
	},
	
	onmove: function(e){
		var x = e.clientX;
		var y = e.clientY;
		var draggedElement = $(document).find('#draggedElement');
		draggedElement.css({
			top: y+5+'px',
			left: x+5+'px'
		});

		//Check where the cursor is

		var underneathElement = $(document.elementFromPoint(e.clientX, e.clientY));

		$('#projectDropdownModal').addClass('visible');

		//Check if we're hovering a project option
		if(underneathElement.hasClass('option')){
			underneathElement.addClass('drop-target');
		}
		else{
			$('.option').removeClass('drop-target');
		}	
	},
	
	onend: function(e){
		var target = $(e.target);
		var eventId = target.attr('id');
		var timeoutMs = 800;

		target = target.closest('.fc-event, .fc-list-item');

		var droppedEl = $(document.elementFromPoint(e.clientX, e.clientY)).closest('.option');

		$(document).find('.option').removeClass('drop-active');
		$(document).find('#draggedElement').remove();
		$('.modal-options').scrollTop(0);
		
		Meteor.setTimeout(function(){
			$('#projectDropdownModal').removeClass('visible');
		}, timeoutMs);

		var element = $('#'+target.attr('id'));
		
		//### HANDLE DRAG ON PROJECT/PERSONAL ACTIVITY
		if(droppedEl.hasClass('dropProject')){

			element.attr('data-validated', true);
		
			if(target.hasClass('fc-list-item')){
				element.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action btn btn-sm" title="You\'ve validated this activity"><i class="fa fa-check-circle-o eventAction"></i></span>');
			}
			else{
				element.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action" title="You\'ve validated this activity"><i class="fa fa-check-circle-o eventAction"></i></span>');
			}


			toastr.options.timeOut = 5000;
			toastr.options.extendedTimeOut = 1000;
			toastr.options.tapToDismiss = false;
			toastr.options.preventDuplicates = true;

			//Updates are actually performed uppon toast hide
			toastr.options.onHidden = function(){
				updateLogClassification(target, element, droppedEl);
			}

			if(target.attr('data-currentproject') !== droppedEl.attr('data-project')){
				var toastMsg = 'Changing project to '+ getProjectFromID(droppedEl.attr('data-project')) +'.';
			}
			else{
				var toastMsg = 'Validated activity.';
			}

			whitheldEvents[eventId] = toastr.info('<i class="fa fa-check-circle-o text-success"></i>&nbsp;&nbsp;'+ toastMsg +' <div class="toast-actions"><button class="toast-close-button close" type="button" aria-label="Close"><span aria-hidden="true">&times;</span></button><a href="#" class="btn btn-sm btn-link pull-right cancelWhitheldEvent">Undo</a></div>');

			resetToaster();

			//Clear timeout when user press cancel
			whitheldEvents[eventId].delegate('.cancelWhitheldEvent', 'click', function(){
				element.attr('data-validated', false);
				if(target.hasClass('fc-list-item')){
					element.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action btn btn-sm" title="You haven\'t validated this activity"><i class="fa fa-circle-o eventAction"></i></span>');
				}
				else{
					element.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action" title="You haven\'t validated this activity"><i class="fa fa-circle-o eventAction"></i></span>');
				}
				whitheldEvents[eventId].remove();
			});

			//Clear toastr on close
			whitheldEvents[eventId].delegate('.toast-close-button', 'click', function(e){
				whitheldEvents[eventId].remove()
				updateLogClassification(target, element, droppedEl);
			});
		}
		//### HANDLE DRAG ON OTHER LOG ACTIONS
		else{
			var option = droppedEl.closest('.option');
			$('html').css({
				'cursor': ''
			});
			
			switch(option.attr('data-action')){
				//## VALIDATE LOG
				case 'validate':
					element.attr('data-validated', true);
					if(target.hasClass('fc-list-item')){
						element.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action btn btn-sm" title="You\'ve validated this activity"><i class="fa fa-check-circle-o eventAction"></i></span>');
					}
					else{
						element.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action" title="You\'ve validated this activity"><i class="fa fa-check-circle-o eventAction"></i></span>');
					}

					toastr.options.timeOut = 5000;
					toastr.options.extendedTimeOut = 1000;
					toastr.options.tapToDismiss = false;
					toastr.options.preventDuplicates = true;

					//Updates are actually performed uppon toast hide
					toastr.options.onHidden = function(){
						updateLogValidation(target, element);
					}

					var toastMsg = 'Validating activity as '+ getProjectFromID(target.attr('data-currentproject')) +'.';

					whitheldEvents[eventId] = toastr.info('<i class="fa fa-check-circle-o text-success"></i>&nbsp;&nbsp;'+ toastMsg +' <div class="toast-actions"><button class="toast-close-button close" type="button" aria-label="Close"><span aria-hidden="true">&times;</span></button><a href="#" class="btn btn-sm btn-link pull-right cancelWhitheldEvent">Undo</a></div>');

					resetToaster();

					//Clear timeout when user press cancel
					whitheldEvents[eventId].delegate('.cancelWhitheldEvent', 'click', function(){
						element.attr('data-validated', false);
						if(target.hasClass('fc-list-item')){
							element.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action btn btn-sm" title="You haven\'t validated this activity"><i class="fa fa-circle-o eventAction"></i></span>');
						}
						else{
							element.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action" title="You haven\'t validated this activity"><i class="fa fa-circle-o eventAction"></i></span>');
						}
						whitheldEvents[eventId].remove();
					});

					//Clear toastr on close
					whitheldEvents[eventId].delegate('.toast-close-button', 'click', function(e){
						whitheldEvents[eventId].remove();
						updateLogValidation(target, element);
					});

					break;
				//## SET LOG AS PRIVATE
				case 'private':
					element.attr('data-private', true);

					if(target.hasClass('fc-list-item')){
						element.find('.changePrivacy').replaceWith('<span class="eventAction changePrivacy action btn btn-sm" title="Only you can see this activity"><i class="fa fa-low-vision eventAction"></i></span>');
					}
					else{
						element.find('.changePrivacy').replaceWith('<span class="eventAction changePrivacy action" title="Only you can see this activity"><i class="fa fa-low-vision eventAction"></i></span>');
					}

					toastr.options.timeOut = 5000;
					toastr.options.extendedTimeOut = 1000;
					toastr.options.tapToDismiss = false;
					toastr.options.preventDuplicates = true;

					//Updates are actually performed uppon toast hide
					toastr.options.onHidden = function(){
						updateLogPrivacy(target, element, true);
					}

					var toastMsg = 'Set activity as private.';

					whitheldEvents[eventId] = toastr.info('<i class="fa fa-low-vision"></i>&nbsp;&nbsp;'+ toastMsg +' <div class="toast-actions"><button class="toast-close-button close" type="button" aria-label="Close"><span aria-hidden="true">&times;</span></button><a href="#" class="btn btn-sm btn-link pull-right cancelWhitheldEvent">Undo</a></div>');

					resetToaster();

					//Clear timeout when user press cancel
					whitheldEvents[eventId].delegate('.cancelWhitheldEvent', 'click', function(){
						element.attr('data-private', false);
						if(target.hasClass('fc-list-item')){
							element.find('.changePrivacy').replaceWith('<span class="eventAction changePrivacy action btn btn-sm" title="This activity can be seen by others in your organization"><i class="fa fa-eye eventAction"></i></span>');
						}
						else{
							element.find('.changePrivacy').replaceWith('<span class="eventAction changePrivacy action" title="This activity can be seen by others in your organization"><i class="fa fa-eye eventAction"></i></span>');
						}
						whitheldEvents[eventId].remove();
					});

					//Clear toastr on close
					whitheldEvents[eventId].delegate('.toast-close-button', 'click', function(e){
						whitheldEvents[eventId].remove();
						updateLogPrivacy(target, element, true);
					});
					break;

				//## SET LOG AS PUBLIC
				case 'public':
					element.attr('data-private', false);

					if(target.hasClass('fc-list-item')){
						element.find('.changePrivacy').replaceWith('<span class="eventAction changePrivacy action btn btn-sm" title="This activity can be seen by others in your organization"><i class="fa fa-eye eventAction"></i></span>');
					}
					else{
						element.find('.changePrivacy').replaceWith('<span class="eventAction changePrivacy action" title="This activity can be seen by others in your organization"><i class="fa fa-eye eventAction"></i></span>');
					}

					toastr.options.timeOut = 5000;
					toastr.options.extendedTimeOut = 1000;
					toastr.options.tapToDismiss = false;
					toastr.options.preventDuplicates = true;

					//Updates are actually performed uppon toast hide
					toastr.options.onHidden = function(){
						updateLogPrivacy(target, element, false);
					}

					var toastMsg = 'Set activity as public.';

					whitheldEvents[eventId] = toastr.info('<i class="fa fa-eye"></i>&nbsp;&nbsp;'+ toastMsg +' <div class="toast-actions"><button class="toast-close-button close" type="button" aria-label="Close"><span aria-hidden="true">&times;</span></button><a href="#" class="btn btn-sm btn-link pull-right cancelWhitheldEvent">Undo</a></div>');

					resetToaster();

					//Clear timeout when user press cancel
					whitheldEvents[eventId].delegate('.cancelWhitheldEvent', 'click', function(){
						element.attr('data-private', true);
						if(target.hasClass('fc-list-item')){
							element.find('.changePrivacy').replaceWith('<span class="eventAction changePrivacy action btn btn-sm" title="Only you can see this activity"><i class="fa fa-low-vision eventAction"></i></span>');
						}
						else{
							element.find('.changePrivacy').replaceWith('<span class="eventAction changePrivacy action" title="Only you can see this activity"><i class="fa fa-low-vision eventAction"></i></span>');
						}
						whitheldEvents[eventId].remove();
					});

					//Clear toastr on close
					whitheldEvents[eventId].delegate('.toast-close-button', 'click', function(e){
						whitheldEvents[eventId].remove();
						updateLogPrivacy(target, element, false);
					});
					break;
				//## DELETE LOG
				case 'delete':
					if(target.hasClass('fc-list-item')){
						target.removeClass('forceEventVisibility').addClass('hidden');
					}
					else{
						target.addClass('hidden');	
					}

					toastr.options.timeOut = 10000;
					toastr.options.extendedTimeOut = 5000;
					toastr.options.tapToDismiss = false;
					toastr.options.preventDuplicates = true;

					//Updates are actually performed uppon toast hide
					toastr.options.onHidden = function(){
						deleteLog(target, element);
						target.remove();
					}

					var toastMsg = 'Deleted activity.';

					whitheldEvents[eventId] = toastr.info('<i class="fa fa-trash-o"></i>&nbsp;&nbsp;'+ toastMsg +' <div class="toast-actions"><button class="toast-close-button close" type="button" aria-label="Close"><span aria-hidden="true">&times;</span></button><a href="#" class="btn btn-sm btn-link pull-right cancelWhitheldEvent">Undo</a></div>');

					resetToaster();

					//Clear timeout when user press cancel
					whitheldEvents[eventId].delegate('.cancelWhitheldEvent', 'click', function(){
						if(target.hasClass('fc-list-item')){
							target.removeClass('hidden').addClass('forceEventVisibility');
						}
						else{
							target.removeClass('hidden');	
						}
						whitheldEvents[eventId].remove();
					});

					//Clear toastr on close
					whitheldEvents[eventId].delegate('.toast-close-button', 'click', function(e){
						
						whitheldEvents[eventId].remove();
						deleteLog(target, element);
						target.remove();

					});
					break;

				default:
				case 'cancel':
					timeoutMs = 1;
					break;
			}
		}

		$(document).find('.option').removeClass('drop-active');
		$(document).find('#draggedElement').remove();
		$('.modal-options').scrollTop(0);
		
		Meteor.setTimeout(function(){
			$('#projectDropdownModal').removeClass('visible');
			$('#projectDropdownModal').find('.validateProject').attr('disabled', false).removeClass('disabled');
			$('#projectDropdownModal').find('.personalProject').attr('disabled', false).removeClass('disabled');
		}, timeoutMs)
	},
});

//Remove dragging cursor style when user simply clicks on element but doesn't drag
interact('.draggable')
.on('tap', function(e){
	$('html').css({
		'cursor': ''
	});
});