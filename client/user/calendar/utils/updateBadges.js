updateDayBadges = function(target){
	if(target.hasClass('fc-list-item')){
		var dayRow = $('.fc-widget-header');
	}
	else{
		var dayRow = $('.fc-day-header[data-date='+ target.attr('data-daycolumn') +']');
	}
	
	var eventTime = parseFloat(target.attr('data-totaltime'));
	
	var dayTotal = parseFloat(dayRow.attr('data-totaltime'));
	var dayValid = parseFloat(dayRow.attr('data-totalvalid'));

	var newValid = dayValid + eventTime;
	
	//Update day valid time
	dayRow.attr('data-totalvalid', newValid);

	//Change badge color & value
	var validPercentage = Math.round(newValid / dayTotal * 1000) / 10;
	var validatedBadge = dayRow.find('.dayValidated');

	validatedBadge.removeClass('badge-danger badge-default badge-gray badge-warning badge-yellow badge-success anim-shake');
	
	if(validPercentage < 25){
		validatedBadge.addClass('badge-danger');
	}
	else if(validPercentage >= 25 && validPercentage < 50){
		validatedBadge.addClass('badge-warning');
	}
	else if(validPercentage >= 50 && validPercentage < 85){
		validatedBadge.addClass('badge-yellow');
	}
	else{
		validatedBadge.addClass('badge-success anim-shake');
	}
	validatedBadge.html('<i class="fa fa-check-circle-o"></i>&nbsp;'+validPercentage+'%')
}

updatePeriodBadges = function(){
	var view = $('#calendar').fullCalendar('getView');
	if(view.name === 'agendaWeek'){
		var dayHeaders = $('.fc-day-header');
		var totalTime = 0;
		var totalValid = 0;
		dayHeaders.each(function(k, el){
			totalTime += parseFloat($(el).attr('data-totaltime'));
			totalValid += parseFloat($(el).attr('data-totalvalid'));
		})
	}
	else{
		var dayHeader = $('.fc-widget-header');
		var totalTime = parseFloat(dayHeader.attr('data-totaltime'));
		var totalValid = parseFloat(dayHeader.attr('data-totalvalid'));
	}
	
	if(!isNaN(totalTime) && totalTime >= 0){
		$('#periodTotal').html('<i class="fa fa-clock-o"></i>&nbsp;'+getStringFromEpoch(totalTime, true));
	}
	else{
		$('#periodTotal').html('<i class="fa fa-clock-o"></i>&nbsp;'+getStringFromEpoch(0, true));	
	}

	var validPercentage = Math.round(totalValid / totalTime * 1000) / 10;
	var validatedBadge = $('#periodValid');

	if(!isNaN(validPercentage) && validPercentage >= 0){
		validatedBadge.removeClass('badge-danger badge-gray badge-default badge-warning badge-yellow badge-success anim-shake');
		
		if(validPercentage < 25){
			validatedBadge.addClass('badge-danger');
		}
		else if(validPercentage >= 25 && validPercentage < 50){
			validatedBadge.addClass('badge-warning');
		}
		else if(validPercentage >= 50 && validPercentage < 85){
			validatedBadge.addClass('badge-yellow');
		}
		else{
			validatedBadge.addClass('badge-success anim-shake');
		}
		validatedBadge.html('<i class="fa fa-check-circle-o"></i>&nbsp;'+validPercentage+'%');
	}
	else{
		validatedBadge.html('<i class="fa fa-check-circle-o"></i>&nbsp;0%');
	}
}

recalculateTotals = function(target){
	var targetTotal = parseFloat(target.attr('data-totaltime'));
	
	if(target.hasClass('fc-list-item')){ var dayRow = $('.fc-widget-header'); }
	else{ var dayRow = $('.fc-day-header[data-date='+ target.attr('data-daycolumn') +']'); }

	var newTotal = parseFloat(dayRow.attr('data-totaltime'));
	newTotal -= targetTotal;

	dayRow.attr('data-totaltime', newTotal);

	//Also remove from validated time if log was already valid
	if(target.attr('data-validated') === 'true'){
		newTotal = parseFloat(dayRow.attr('data-totalvalid'));
		newTotal -= targetTotal;
		dayRow.attr('data-totalvalid', newTotal);
	}
}