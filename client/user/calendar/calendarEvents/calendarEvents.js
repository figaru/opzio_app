Template.userCalendar.events({
	'click #fullscreenCalendar': function(e){
		e.preventDefault()
		var cal = $('#calendar');
		var btnEl = $(e.currentTarget);

		if(!cal.hasClass('fullscreen')){
			btnEl.removeClass('btn-outline-primary').addClass('btn-primary').html('<i class="fa fa-compress"></i>').blur();
			cal.addClass('fullscreen');
			$('body').addClass('fullscreen-calendar');
			resizeCalendar();
		}
		else{
			btnEl.removeClass('btn-primary').addClass('btn-outline-primary').html('<i class="fa fa-expand"></i>').blur();
			cal.removeClass('fullscreen');
			$('body').removeClass('fullscreen-calendar');
			resizeCalendar();
		}
	},
	//Change "zoom" option (by changing slotDuration)
	'click .zoom-option': function(e){
		e.preventDefault();
		$('#calendar').fullCalendar('option', {
			'slotDuration': $(e.currentTarget).attr('data-slotsize')
		});
	},
	'click .detail-option': function(e){
		var detailLevel = $(e.currentTarget).attr('data-detail');
		Session.set('calendarDetail', detailLevel);
		setEventsVisibility();
	},

	'click .toggle-option': function(e){
		var el = $(e.currentTarget);
		var filterOption = el.attr('data-filter');
		
		switch(filterOption){
			case 'toggleValid':
					if(el.attr('data-selected') === 'false'){
						el.attr('data-selected', 'true');
						el.text('Show valid & invalid');
						Session.set('invalidOnly', true);
					}
					else{
						el.attr('data-selected', 'false');
						el.text('Hide validated');
						console.log('set toggleValid as false')
						Session.set('invalidOnly', false);
					}
				break;
			case 'togglePublic':
				if(el.attr('data-selected') === 'false'){
					el.attr('data-selected', 'true');
					el.text('Show public & private');
					Session.set('privateOnly', true);
				}
				else{
					el.attr('data-selected', 'false');
					el.text('Hide public');
					Session.set('privateOnly', false);
				}
				break;
		}

		setEventsVisibility()
	},
});