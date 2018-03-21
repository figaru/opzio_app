import fullcalendar from 'fullcalendar';

Template.userCalendar.onRendered(function(){
	$('body').css({
		'overflow-y': 'hidden'
	});
	var dateRange = Session.get('dateRange');
	var start = moment(dateRange.startDate);

	//Set calendar height
	var vH = $(window).height();
	var vW = $(window).width();

	//Define default view
	if(vW <= 600){
		var defaultView = 'listDay';
		var height = vH - $('#calendar').position().top - 215;
	}
	else{
		//If session date is a day, force view as listDay
		if(dateRange.range === 'day'){
			var defaultView = 'listDay';
			window.location.hash = '#listDay';
		}
		//Otherwise pick the existing view from url hash
		else{
			window.location.hash = '#agendaWeek';
			var defaultView = 'agendaWeek';
		}

		var height = vH - $('#calendar').position().top - 220;
	}

	/* initialize the calendar
	-----------------------------------------------------------------*/
	var cal = $('#calendar').fullCalendar({
		contentHeight: height,
		header: {
			left: '',
			center: '',
			right: 'prev,agendaWeek,listDay,next today' //month,agendaDay
		},
		allDaySlot: false,
		slotDuration: '00:05:00',
		defaultView: defaultView,
		displayEventTime: false,
		listDayFormat: 'dddd DD/MM',
		noEventsMessage: 'No activities found',
		views: {
			basic: {
				timeFormat: 'H:mm',
			},
			agenda: {
				timeFormat: 'H:mm',
				columnFormat: 'ddd DD/MM'
			},
			week: {
				timeFormat: 'H:mm',
				columnFormat: 'ddd DD/MM'
			},
			day: {
				timeFormat: 'H:mm',
				columnFormat: 'ddd DD/MM'
			},
		},
		/*
		visibleRange: {
			start: moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD'),
			end: moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD')
		},
		*/
		/*
		//Enphasis on business hour/days, in our case, trackable periods
		businessHours:{
			dow: Meteor.user().workableWeekDays,
			start: moment().hour(Meteor.user().workStartHour).minute(0).second(0).millisecond(0).format('HH:mm'),
			end: moment().hour(Meteor.user().workEndHour).minute(0).second(0).millisecond(0).format('HH:mm')
		},
		*/
		lazyFetching: false,
		//eventOverlap: false,
		nowIndicator: true,
		weekNumberCalculation: 'ISO',

		slotLabelFormat: 'HH:mm',
		timeFormat: 'HH:mm',
		editable: false,
		selectable: false,
		droppable: false, // this allows things to be dropped onto the calendar
		/*
		drop: function() {
		// is the "remove after drop" checkbox checked?
			if ($('#drop-remove').is(':checked')) {
			// if so, remove the element from the "Draggable Events" list
				$(this).remove();
			}
		},
		*/
		eventLimit: true, // allow "more" link when too many events
		navLinks: true,
		navLinkDayClick: function(date, e){
			$('#calendar').fullCalendar('changeView', 'listDay', date.format());
		},
	  
		eventRender: function( event, element, view ) {
			//Add element attributes
			element.attr('id', event.objectId);
			element.attr('data-private', event.private);
			element.attr('data-validated', event.validated);
			element.attr('data-currentproject', event.project._id);
			element.attr('data-daycolumn', event.columnStartDate);
			element.attr('data-totaltime', event.totalTime);

			element.addClass(event.eventColor);
			element.addClass(event.detailClasses);
			element.addClass(event.hiddenClass);

			var eventWrapper = $('<div class="event-wrapper"></div>');
			

			//Append icon if existing
			if(typeof event.icon !== 'undefined'){
				element.find('.fc-event-dot').prepend('<i class="fa '+event.icon+'"></i> ');
				element.attr('data-attribute', event.customAttr)
			}
			

			//Set project icon if not personal
			if(event.project.name === 'Personal'){
				var projectBadge = '<span class="badge badge-outline-default selectedProject"><i class="fa fa-user"></i>&nbsp; '+ event.project.name +'</span>';
			}
			else{
				var projectBadge = '<span class="badge badge-outline-primary selectedProject"><i class="fa fa-briefcase"></i>&nbsp; '+ event.project.name +'</span>';
			}

			//Set description if existing
			if(event.description){
				var activityDescription = '<p class="event-description mt-1 text-center ">'+ event.description +'</p>';
			}
			else{
				var activityDescription = '<p class="event-description empty-description mt-2">No description. Click to edit.</p>'
			}
			

			//Build agenda view events
			if(!element.hasClass('fc-list-item')){
				element.removeClass('forceEventVisibility')

				var title = element.find('.fc-title');

				var actions = $('<div class="event-actions"></div>');
				//#### Build actions menu
				//Activity type
				actions.append('<span class="eventAction action" title="'+event.activityTooltip+'"><i class="fa '+event.icon+'"></i></span>');

				//Activity total time
				actions.append('<span class="badge badge-default totaltime mt-1 pull-left"><i class="fa fa-clock-o"></i> '+ getStringFromEpoch(event.totalTime, true) +'</span>');

				//Validation
				if(!event.validated){
					actions.append('<span class="eventAction changeValidation action" title="You haven\'t validated this activity"><i class="fa fa-circle-o eventAction"></i></span>')
					
					//Only let non validated events to be dragged to change the project
					element.addClass('draggable hasHoldEvent');
				}
				else{
					actions.append('<span class="eventAction changeValidation action" title="You\'ve validated this activity"><i class="fa fa-check-circle-o eventAction"></i></span>')
				}

				//Privacy
				if(event.private){
					actions.append('<span class="eventAction changePrivacy action" title="Only you can see this activity"><i class="fa fa-low-vision eventAction"></i></span>');
				}
				else{
					actions.append('<span class="eventAction changePrivacy action" title="This activity can be seen by others in your organization"><i class="fa fa-eye eventAction"></i></span>');	
				}
				
				//Activity source
				actions.append('<span class="eventAction action" title="'+event.sourceTooltip+'"><i class="fa '+event.sourceIcon+'"></i></span>');
				
				//Billed
				if(event.billed){
					actions.append('<span class="eventAction changeBilled action" title="This activity has been billed"><i class="fa fa-usd crossed green eventAction"></i></span>');
				}
				else{
					actions.append('<span class="eventAction changeBilled action" title="This activity hasn\'t been billed"><i class="fa fa-usd crossed red eventAction"></i></span>');	
				}

				eventWrapper.append(actions);
				eventWrapper.append(title);
				//console.log('render EVENT item')
				eventWrapper.append('<div class="event-body">\
					<h5>'+ projectBadge +'</h5><!--'+activityDescription+'-->\
				</div>');
				
				eventWrapper.append('<div class="event-footer">'+event.uri+'</div>');

				element.find('.fc-content').html(eventWrapper);
			}
			//Build list view events
			else{
				//console.log('render LIST item')
				element.addClass('forceEventVisibility');
				element.find('.fc-list-item-marker').prepend('<span class="event-start">'+event.startHour+'</span>')
				
				projectBadge = $(projectBadge).addClass('mt-1 mr-2 pull-left miw-5')[0].outerHTML;

				var badges = '<span class="badge badge-default totaltime mt-1 mr-2 pull-left miw-5"><i class="fa fa-clock-o hidden-sm-down"></i> '
					+ getStringFromEpoch(event.totalTime, true)
				+ '</span> '
				+ projectBadge
				+ '</span> '; 

				var actions = $('<div class="event-actions ml-auto miw-10 text-right"></div>');

				//Privacy
				if(event.private){
					actions.append('<span class="eventAction changePrivacy action btn btn-sm" title="Only you can see this activity"><i class="fa fa-low-vision eventAction"></i></span>');
				}
				else{
					actions.append('<span class="eventAction changePrivacy action btn btn-sm" title="This activity can be seen by others in your organization"><i class="fa fa-eye eventAction"></i></span>');	
				}
				
				//Activity source
				//actions.append('<span class="eventAction action btn btn-sm" title="'+event.sourceTooltip+'"><i class="fa '+event.sourceIcon+'"></i></span>');
				
				//Billed
				if(event.billed){
					actions.append('<span class="eventAction changeBilled action btn btn-sm hidden-xs-down" title="This activity has been billed"><i class="fa fa-usd green eventAction"></i></span>');
				}
				else{
					actions.append('<span class="eventAction changeBilled action btn btn-sm hidden-xs-down" title="This activity hasn\'t been billed"><i class="fa fa-usd text-red eventAction"></i></span>');	
				}

				//Validation
				if(!event.validated){
					actions.append('<span class="eventAction changeValidation action btn btn-sm" title="You haven\'t validated this activity"><i class="fa fa-circle-o eventAction"></i></span>')
					
					//Only let non validated events to be dragged to change the project
					element.addClass('hasHoldEvent');
				}
				else{
					actions.append('<span class="eventAction changeValidation action btn btn-sm" title="You\'ve validated this activity"><i class="fa fa-check-circle-o eventAction"></i></span>')
				}

				//Depending if mobile or not, allow the event to be dragged or tapped
				if(vW > 600){
					element.addClass('draggable');
				}
				else{
					//For mobile interaction
					element.addClass('clickable');
				}


				var eventInfo = '<div class="d-flex justify-content-end">\
									<div class="event-title">'+ event.title +'</div>\
									'+actions[0].outerHTML+'\
								</div>';

				//SM down badges
				element.find('.fc-list-item-marker').append('<div class="badges hidden-md-up d-inline mobile-badges">'+badges+'</div>');
				actions.addClass('mr-4 hidden-md-up pull-right')
				element.find('.fc-list-item-marker').append(actions);

				//SM up badges
				eventWrapper.append('<div class="badges hidden-sm-down">'+badges+'</div>');
				eventWrapper.append(eventInfo);
				
				element.find('.fc-list-item-title').html(eventWrapper)
			}
		},
		eventMouseover: function(event, element, view){
			var el = $(element.currentTarget);
			//el.finish();
			el.addClass('shadow');
			var ogHeight = el.height();
			var ogLeft = el.css('left');
			var ogMarginRight = el.css('margin-right');
			var ogRight = el.css('right');

			el.attr('data-defaultright', ogRight);
			el.attr('data-defaultleft', ogLeft);
			el.attr('data-defaultmarginright', ogMarginRight);

			var innerHeight = el.find('.event-wrapper').height();
			if(innerHeight > ogHeight){
				el.attr('data-defaultheight', ogHeight);
				
				el.css({
					'opacity': '0.95',
					'margin-right': '0',
					'left': '0',
					'right': '0',
					'height': innerHeight+2+'px'
				});
			}
			
			
		},
		eventMouseout: function(event, element, view){
			var el = $(element.currentTarget);
			//el.finish();
			el.removeClass('shadow');
			var ogHeight = el.attr('data-defaultheight');
			var ogRight = el.attr('data-defaultright');
			var ogLeft = el.attr('data-defaultleft');
			var ogMargin = el.attr('data-defaultmarginright');
			el.css({
				'opacity': '1',
				'margin-right': ogMargin,
				'left': ogLeft,
				'right': ogRight,
				'height': ogHeight+'px'
			});
		},		
		viewRender: function(view, element){
			//console.log('render view')
			var cal = $('#calendar');
			
			//Set events visibility if not set
			if(typeof Session.get('invalidOnly') === 'undefined'){
				Session.set('invalidOnly', false);
			}
			if(typeof Session.get('privateOnly') === 'undefined'){
				Session.set('privateOnly', false);
			}

			//#### FETCH EVENTS FROM SERVER
			fetchCalendarEvents(cal);

			window.location.hash = view.name;

			cal.find('.fc-right .zoomActions').remove();
			cal.find('.fc-right .detailActions').remove();
			
			//Right controls depending on view
			if(view.name === 'agendaWeek'){
				//Zoom options agendaWeek
				cal.find('.fc-right').append('<div class="dropdown zoomActions">\
				    <a href="#" title="Change time slot interval" class="dropdown-toggle btn btn-outline-primary no-caret" id="calendarZoomOptions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
				    	<span class="hidden-lg-down">Zoom</span>\
				    	<i class="fa fa-list"></i>\
				    </a>\
					<div class="dropdown-menu dropdown-menu-right" aria-labelledby="calendarZoomOptions">\
						<a class="dropdown-item zoom-option" href="#" data-slotsize="00:05:00"> 5 minutes</a>\
						<a class="dropdown-item zoom-option" href="#" data-slotsize="00:15:00"> 15 minutes</a>\
						<a class="dropdown-item zoom-option" href="#" data-slotsize="00:30:00"> 30 minutes</a>\
						<a class="dropdown-item zoom-option" href="#" data-slotsize="01:00:00"> 1 hour</a>\
					</div>\
				</div>');

				//Detail menu for agendaWeek
				cal.find('.fc-right').append('<div class="dropdown detailActions">\
				    <a href="#" title="View more or less events" class="dropdown-toggle btn btn-outline-primary no-caret" id="calendarDetailOptions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
				    	<span class="hidden-lg-down">Filters</span>\
				    	<i class="fa fa-filter"></i>\
				    </a>\
					<div class="dropdown-menu dropdown-menu-right" aria-labelledby="calendarDetailOptions">\
						<a class="dropdown-item detail-option bg-blue-light" href="#" title="Show all events" data-detail="all"> Show all</a>\
						<h6 class="dropdown-header">Events detail</h6>\
						<a class="dropdown-item detail-option" href="#" title="All events over 1 minute" data-detail="highLevelDetail"> High</a>\
						<a class="dropdown-item detail-option" href="#" title="Events with more than 5 minutes" data-detail="midLevelDetail"> Medium</a>\
						<a class="dropdown-item detail-option" href="#" title="Events with more than 15 minutes" data-detail="lowLevelDetail"> Low</a>\
						<div class="dropdown-divider"></div>\
						<h6 class="dropdown-header">Filter events</h6>\
						<a class="dropdown-item toggle-option" href="#" title="" data-selected="false" data-filter="toggleValid"> Hide validated</a>\
						<a class="dropdown-item toggle-option" href="#" title="" data-selected="false" data-filter="togglePublic"> Hide public</a>\
					</div>\
				</div>');
			}
			else{
				//Detail menu for agendaWeek
				var dropdownClass = 'dropdown'
				if(vW < 768){
					dropdownClass = 'dropup'
				}
				cal.find('.fc-right').append('<div class="'+dropdownClass+' detailActions">\
				    <a href="#" title="View more or less events" class="dropdown-toggle btn btn-outline-primary no-caret" id="calendarDetailOptions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
				    	<span class="hidden-lg-down">Filters</span>\
				    	<i class="fa fa-filter"></i>\
				    </a>\
					<div class="dropdown-menu dropdown-menu-right" aria-labelledby="calendarDetailOptions">\
						<a class="dropdown-item detail-option bg-blue-light" href="#" title="Show all events" data-detail="all"> Show all</a>\
						<h6 class="dropdown-header">Filter events</h6>\
						<a class="dropdown-item toggle-option toggleValid" href="#" title="" data-selected="false" data-filter="toggleValid"> Hide validated</a>\
						<a class="dropdown-item toggle-option togglePublic" href="#" title="" data-selected="false" data-filter="togglePublic"> Hide public</a>\
					</div>\
				</div>');

				Meteor.setTimeout(function(){
					var eventsCount = $(document).find('.fc-list-item');
					$('.fc-widget-header').find('.badge-outline-primary').remove();
					$('.fc-widget-header').append('<span class="badge badge-outline-primary py-1 px-2 ml-2">'+  eventsCount.length +' records</span>')
				}, 500)
			}

			if(Session.get('invalidOnly') === true){
				cal.find('.toggleValid').attr('data-selected', 'true').text('Show valid & invalid');
			}
			if(Session.get('privateOnly') === true){
				cal.find('.togglePublic').attr('data-selected', 'true').text('Show public & private');
			}




			cal.find('.fc-right #fullscreenCalendar').remove();
			cal.find('.fc-right').append('\
				<a href="#" class="btn btn-outline-primary" id="fullscreenCalendar">\
					<i class="fa fa-expand"></i>\
				</a>\
			');

			//Left stats
			cal.find('.fc-left').html('').append('\
				<div class="stats-wrapper m-0">\
					<h3 class="m-0 mr-2 pull-left">\
				  		<span id="periodTotal" class="badge badge-default tooltipster" title="<h6>\
				  			<span class=\'d-block w-100 mb-2\'>Total Time</span>\
				  			<span class=\'font-weight-light\'>The total amount of time automatically registered for the given time period.</span>\
			  			</h6>"><i class="fa fa-clock-o"></i><span class="chart-loader badge-loader"></span></span>\
					</h3>\
					<h3 class="m-0 mr-2 pull-left">\
				  		<span id="periodValid" class="badge badge-default tooltipster" title="<h6>\
				  			<span class=\'d-block w-100 mb-2\'>Validated Percentage</span>\
				  			<span class=\'font-weight-light\'>How many of your time has been validated for this period of time.<br>Only validated time is taken into account for reports.</span>\
			  			</h6>"><i class="fa fa-check-circle-o"></i><span class="chart-loader badge-loader"></span></span>\
					</h3>\
				</div>')

			//Scrolls to current hour
			var currentHour = moment().startOf('hour').format('HH:mm:ss');
			var selector = "[data-time='"+ currentHour +"']";
			var el = $(selector);
			if(el.length > 0){
				$('.fc-scroller').animate({
					scrollTop: el.position().top
				}, 1000);
			}


			$('.fc-agendaWeek-button').addClass('hidden-sm-down');
			$('.fc-listDay-button').addClass('hidden-sm-down');

			//Update session date range
			changeSessionDateRange();

			$('.fc-button').blur();
		},
		eventAfterAllRender: function(view, element){
			//Every time a column is done rendering events, recalculate period completion
			if(view.name === 'agendaWeek'){
				//console.log('eventAfterAllRender!')
				Meteor.setTimeout(function(){
					updatePeriodBadges();
					$('.tooltipster').tooltipster({
						contentAsHTML: true,
						delay: 500,
						// interactive: true,
						// trigger: 'click'
					});
				}, 4000);
			}
			else{
				Meteor.setTimeout(function(){
					updatePeriodBadges();
					$('.tooltipster').tooltipster({
						contentAsHTML: true,
						delay: 500,
						// interactive: true,
						// trigger: 'click'
					});
				},250)
			}
			$('.fc-list-empty').html('No events on <br>'+ $('#calendar').fullCalendar('getDate').format('dddd DD/MM'));
		}
		// select: function(start, end, jsEvent, view){

		// },
	});

	//Navigate to current dateRange
	cal.fullCalendar('gotoDate', start);


	//BIND GENERAL EVENT TO CLOSE TOOLTIPS
	// $(document).on('click', '.fc-view-container', function(e){
	// 	e.preventDefault();
	// 	$(document).find('.cluster-tooltip').remove();
	// });

	//Calendar ratio calculation on resize
	$(window).on('resize', function(e){
		Meteor.setTimeout(function(){
			resizeCalendar();
		}, 500)
	});

	//Force fullscreen if fullscreen option is present in URL
	if(typeof Router.current().params.option !== 'undefined'){
		if(Router.current().params.option === 'fullscreen'){
			$('body').addClass('fullscreen-calendar');
			$('#calendar').addClass('fullscreen');
			$('#fullscreenCalendar').removeClass('btn-outline-primary').addClass('btn-primary').html('<i class="fa fa-compress"></i>').blur();
			resizeCalendar();
		}
	}
});

Template.userCalendar.onDestroyed(function(){
	$(window).off('resize');
	$('body').css({
		'overflow-y': ''
	});
});

Template.userCalendar.helpers({
	'changeEventVisibility': function(e){
		var invalidOnly = Session.get('invalidOnly');
		var privateOnly = Session.get('privateOnly');
		
		console.log('changeEventVisibility')
		
		setEventsVisibility()
		
		return;

		var events = $('.fc-event, .fc-list-item');
		//console.log(events);
		

		if(invalidOnly){
			events.each(function(k, el){
				//Deceide whether or not to show/hide event
				if($(el).attr('data-validated') === 'true'){
					$(el).addClass('hidden');
				}
			});
		}
		else{
			events.each(function(k, el){
				//Deceide whether or not to show/hide event
				if($(el).attr('data-validated') === 'true'){
					$(el).removeClass('hidden');
				}
			});
		}
	}
});

resizeCalendar = function(offset){
	var vH = $(window).height();
	var cal = $('#calendar');
	if(cal.hasClass('fullscreen')){
		var height = vH - cal.position().top - 100;
	}
	else{
		var height = vH - cal.position().top - 220;	
	}

	cal.fullCalendar('option', {
		'contentHeight': height
	});
}

getCalendarDateRange = function() {
	var calendar = $('#calendar').fullCalendar('getCalendar');
	var view = calendar.view;
	var start = view.start._d;
	var end = view.end._d;
	var dates = { start: start, end: end };
	return {
		'dates': dates,
		'view': view
	};
}

changeSessionDateRange = function(){
	var calendarData = getCalendarDateRange();
	var dates = calendarData.dates;
	var view = calendarData.view;
	var start = moment(dates.start);
	var end = moment(dates.end);

	//Update dateRange session variable
	var dateRange = Session.get('dateRange');
	
	dateRange['startDate'] = start.toISOString();
	dateRange['endDate'] = end.subtract(1, 'days').endOf('day').toISOString();
	if(view.name === 'agendaWeek'){
		dateRange['range'] = 'week';
	}
	else{
		dateRange['range'] = 'day';	
	}
	
	Session.set('dateRange', dateRange);
}