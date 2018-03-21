import interact from '/client/_compatibility/interactjs.min.js';


interact.debug().defaultOptions._holdDuration = 1100;

interact('.hasHoldEvent')
.on('hold', function (e) {
	var target = $(e.target);
	var eventId = target.attr('id');
	

	target = target.closest('.fc-event, .fc-list-item');

	//console.log(target)
	
	//console.log(target.attr('id'))
	if(target.attr('data-validated') !== 'true'){
		//Handle event for agenda view
		if(!target.hasClass('fc-list-item')){
			var element = $('#'+target.attr('id'));
			element.attr('data-validated', true);
			element.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action" title="You\'ve validated this activity"><i class="fa fa-check-circle-o eventAction"></i></span>');

			toastr.options.timeOut = 5000;
			toastr.options.extendedTimeOut = 1000;
			toastr.options.tapToDismiss = false;
			toastr.options.preventDuplicates = true;

			toastr.options.onHidden = function(){
				updateLogValidation(target, element);
			}

			whitheldEvents[eventId] = toastr.info('<i class="fa fa-check-circle-o text-success"></i>&nbsp;&nbsp;Activity validated. <div class="toast-actions"><button class="toast-close-button close" type="button" aria-label="Close"><span aria-hidden="true">&times;</span></button><a href="#" class="btn btn-sm btn-link pull-right cancelWhitheldEvent">Undo</a></div>');

			resetToaster();

			//Clear timeout when user press cancel
			whitheldEvents[eventId].delegate('.cancelWhitheldEvent', 'click', function(){
				element.attr('data-validated', false);
				element.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action" title="You haven\'t validated this activity"><i class="fa fa-circle-o eventAction"></i></span>');
				whitheldEvents[eventId].remove();
			});

			//Clear toastr on close
			whitheldEvents[eventId].delegate('.toast-close-button', 'click', function(e){
				
				console.log(e)
				whitheldEvents[eventId].remove()
				console.log('close toast');
				updateLogValidation(target, element);
			});
		}
		else{
			console.log('handle hold event')
			target.attr('data-validated', true);
			target.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action btn btn-sm" title="You\'ve validated this activity"><i class="fa fa-check-circle-o eventAction"></i></span>');

			toastr.options.timeOut = 5000;
			toastr.options.extendedTimeOut = 1000;
			toastr.options.tapToDismiss = false;
			toastr.options.preventDuplicates = true;

			toastr.options.onHidden = function(){
				updateLogValidation(target, element);
			}

			whitheldEvents[eventId] = toastr.info('<i class="fa fa-check-circle-o text-success"></i>&nbsp;&nbsp;Activity validated. <div class="toast-actions"><button class="toast-close-button close" type="button" aria-label="Close"><span aria-hidden="true">&times;</span></button><a href="#" class="btn btn-sm btn-link pull-right cancelWhitheldEvent">Undo</a></div>');

			resetToaster();

			//Clear timeout when user press cancel
			whitheldEvents[eventId].delegate('.cancelWhitheldEvent', 'click', function(){
				target.attr('data-validated', false);
				target.find('.changeValidation').replaceWith('<span class="eventAction changeValidation action btn btn-sm" title="You haven\'t validated this activity"><i class="fa fa-circle-o eventAction"></i></span>');
				whitheldEvents[eventId].remove();
			});

			//Clear toastr on close
			whitheldEvents[eventId].delegate('.toast-close-button', 'click', function(e){
				
				console.log(e)
				whitheldEvents[eventId].remove()
				console.log('close toast');
				updateLogValidation(target, element);
			});
		}

		
	}
});

//Only used for mobile device (double tap to open modal)
//Modal events are then handled in classificationModal/classificationEvents.js
interact('.clickable')
.on('doubletap', function(e){
	var target = $(e.target);
	target = target.closest('.fc-event, .fc-list-item');

	if(target.hasClass('clickable')){
		//Add class to identify which activity we want to alter (removed uppon modal close)
		target.addClass('selectedActivity');
		populateModal(target);
		Meteor.setTimeout(function(){
			$('#projectDropdownModal').addClass('visible');
		}, 250)
	}
	// if(!$(element.target).hasClass('eventAction')){
	// 	Meteor.setTimeout(function(){
	// 		$(document).find('.cluster-tooltip').remove();
	// 		positionEventTooltip(event, element.currentTarget)
	// 	}, 50)
	// }
});