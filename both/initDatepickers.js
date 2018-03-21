initTasklistDatepickers = function(newStartDate, newEndDate){

	console.log('init datepickers!')
	var startDateInput = $('#tasklistStartDate');
	var endDateInput = $('#tasklistEndDate');

	if(newStartDate){
		var startDate = newStartDate;
		//Set current dates to inputs for reference
		startDateInput.attr('data-content', startDate);
	}
	else{
		var startDate = moment().startOf('day').toDate();
	}
	
	var startDateOptions = {
		locale: { format: 'DD/MM/YYYY' },
		startDate: startDate,
		endDate: startDate,
		'singleDatePicker': true,
	}

	if(newEndDate){
		var endDate = newEndDate;
		endDateInput.attr('data-content', endDate);
	}
	else{
		var endDate = moment().endOf('day').toDate();
	}

	var endDateOptions = {
		locale: { format: 'DD/MM/YYYY' },
		startDate: endDate,
		endDate: endDate,
		'singleDatePicker': true,
	}

	//Check if we're in the context of a specific project
	var project = Session.get('currentProject');

	//Check if we want to bound the min/max dates to that of a project
	if(typeof project !== 'undefined'){
		startDateOptions['minDate'] = project.startDate;
		startDateOptions['maxDate'] = project.endDate;
		
		if(newEndDate){
			endDateOptions['minDate'] = startDate;
			endDateOptions['maxDate'] = project.endDate;
		}
		else{
			endDateOptions['minDate'] = project.startDate;
			endDateOptions['maxDate'] = project.endDate;
		}

	}

	var startDatepicker = startDateInput.daterangepicker(startDateOptions);
	var endDatepicker = endDateInput.daterangepicker(endDateOptions);

	startDatepicker.on('apply.daterangepicker', function(e, picker) {
	    
		var target = e.currentTarget;
		var newData = target.value;

		//Build moment object from parsing input
		var dateItems = newData.split('/');

		var hasAttr = startDateInput.attr('data-content');
		if(typeof hasAttr === 'undefined' && hasAttr !== false){
			var date = moment().hours(23).minutes(59).seconds(59).date(parseInt(dateItems[0])).month(parseInt(dateItems[1]-1)).year(parseInt(dateItems[2]));
		}
		else{
			console.log('apply hours to startDate')
			var hours = moment(hasAttr).hours()
			var minutes = moment(hasAttr).minutes()
			var seconds = moment(hasAttr).seconds()
			var date = moment().hours(hours).minutes(minutes).seconds(seconds).date(parseInt(dateItems[0])).month(parseInt(dateItems[1]-1)).year(parseInt(dateItems[2]));
		}

		startDateInput.attr('data-content', date.toDate())

	});

	endDatepicker.on('apply.daterangepicker', function(e, picker) {

		var target = e.currentTarget;
		var newData = target.value;

		//Build moment object from parsing input
		var dateItems = newData.split('/');
		var hasAttr = endDateInput.attr('data-content');
		if(typeof hasAttr === 'undefined' && hasAttr !== false){
			var date = moment().hours(23).minutes(59).seconds(59).date(parseInt(dateItems[0])).month(parseInt(dateItems[1]-1)).year(parseInt(dateItems[2]));
		}
		else{
			console.log('apply hours to endDate')
			var date = moment().date(parseInt(dateItems[0])).month(parseInt(dateItems[1]-1)).year(parseInt(dateItems[2]));
			var hours = moment(hasAttr).hours()
			var minutes = moment(hasAttr).minutes()
			var seconds = moment(hasAttr).seconds()
			var date = moment().hours(hours).minutes(minutes).seconds(seconds).date(parseInt(dateItems[0])).month(parseInt(dateItems[1]-1)).year(parseInt(dateItems[2]));
		}

		endDateInput.attr('data-content', date.toDate())

	});
}

initProjectDatepickers = function(newStartDate, newEndDate){

	var organizationProfile = OrganizationProfile.findOne({ organization: Meteor.user().profile.organization });
	//For some reason, OrganizationProfile is not ready sometimes
	if(typeof organizationProfile === 'undefined') return;

	//console.log('init project datepickers!')
	var startDateInput = $('#projectStartDate');
	var endDateInput = $('#projectEndDate');

	
	var workStartHour = organizationProfile.workStartHour;
	var workEndHour = organizationProfile.workEndHour;

	if(newStartDate){
		//console.log('has newStartDate')
		//console.log(newStartDate)
		var defaultStartDate = moment(newStartDate);
		startDateInput.attr('data-customdate', defaultStartDate.toISOString());
	}
	else{
		var defaultStartDate = moment();
		startDateInput.removeAttr('data-customdate');
	}
	if(defaultStartDate.hour() >= workStartHour){
		defaultStartDate = defaultStartDate.add(1, 'days').hour(workStartHour).minute(0).second(0).millisecond(0);
	}

	if(newEndDate){
		//console.log('has newEndDate')
		//console.log(newEndDate)
		var defaultEndDate = moment(newEndDate);
		endDateInput.attr('data-customdate', defaultStartDate.toISOString());
	}
	else{
		var defaultEndDate = moment().hour(workEndHour).minute(0).second(0).millisecond(0);
		endDateInput.removeAttr('data-customdate');
	}

	if(defaultEndDate.isBefore(defaultStartDate)){
		//console.log('is before')
		defaultEndDate = defaultEndDate.add(30, 'days').hour(workEndHour).minute(0).second(0).millisecond(0);
	}

	//console.log(defaultStartDate)
	//console.log(defaultEndDate)
	
	var startDatepicker = startDateInput.datetimepicker({
		format: 'DD/MM/YYYY HH:mm',
		defaultDate: defaultStartDate,
		maxDate: defaultEndDate
	});
	startDateInput.attr('data-isodate', defaultStartDate.toISOString());
	startDateInput.data('DateTimePicker').date(defaultStartDate);

	var endDatepicker = endDateInput.datetimepicker({
		format: 'DD/MM/YYYY HH:mm',
		defaultDate: defaultEndDate,
		minDate: defaultStartDate
	});
	endDateInput.attr('data-isodate', defaultEndDate.toISOString());
	endDateInput.data('DateTimePicker').date(defaultEndDate);
	
	//Set values
	startDateInput.val(defaultStartDate.clone().format('DD/MM/YYYY HH:mm'));
	endDateInput.val(defaultEndDate.clone().format('DD/MM/YYYY HH:mm'));

	//#####
	//	EVENTS
	//#####
	startDatepicker.on('dp.show dp.change dp.update', function(e, picker){
		var startDay = moment(startDateInput.data('DateTimePicker').date());
		var endDay = moment(endDateInput.data('DateTimePicker').date());
		_.each($('tbody .day'), function(val, key){
			var date = $(val).attr('data-day').split('/');
			var dateObj = moment().month(parseInt(date[0])-1).date(date[1]).year(date[2]);
			if(dateObj.isBetween(startDay, endDay) && organizationProfile.workableWeekDays.indexOf(dateObj.isoWeekday()) >= 0){
				$(val).addClass('highlighted');
			}
			else{ $(val).removeClass('highlighted'); }
		});
	});

	endDatepicker.on('dp.show dp.change dp.update', function(e, picker){
		var startDay = moment(startDateInput.data('DateTimePicker').date());
		var endDay = moment(endDateInput.data('DateTimePicker').date());
		_.each($('tbody .day'), function(val, key){
			var date = $(val).attr('data-day').split('/');
			var dateObj = moment().month(parseInt(date[0])-1).date(date[1]).year(date[2]);
			if(dateObj.isBetween(startDay, endDay) && organizationProfile.workableWeekDays.indexOf(dateObj.isoWeekday()) >= 0 ){
				$(val).addClass('highlighted');
			}
			else{ $(val).removeClass('highlighted'); }
		});
	});
}