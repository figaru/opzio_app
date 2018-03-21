Template.dateRangeMenu.onRendered(function(){
	console.log('render dateRangeMenu')
	var t = Template.instance();

	Tracker.autorun(function () {
		var hash = Session.get('currentHash');
		var dateRange = Session.get('dateRange');
		var canViewDateMenu = Session.get('canViewDateMenu');
		Meteor.setTimeout(function(){
			var data = {
				canViewDateMenu : t.data.canViewDateMenu,
				canSetCustomRange : t.data.canSetCustomRange,
				isSingleDatePicker : t.data.singleDatePicker,
				canFitRange : t.data.canFitRange,
			}
			reloadDatepicker(data, $('#dateRangeInput'));

		}, 10);

	});
	
	$('input#dateRangeInput').bind('focusin focus', function(e){
	  e.preventDefault();
	});
});

Template.dateRangeMenu.helpers({
	'currentRange': function(){
		var dateRange = Session.get('dateRange');
		var t = Template.instance();
		
		if(!t.data.singleDatePicker){
			return moment(dateRange.startDate).format('DD/MM/YYYY') + ' - ' + moment(dateRange.endDate).format('DD/MM/YYYY');
		}
		else{
			return moment(dateRange.startDate).format('DD/MM/YYYY');
		}
	}
});

Template.dateRangeMenu.events({
	'keypress #dateRangeInput': function(e){
		e.preventDefautl();
	},
	'click #dateRangeAnchor': function(e){
		$('.dateRange-group').toggleClass( "shown");
	},
	//Previous day
	'click .prev': function(e){
		e.preventDefault();
		var dateRange = Session.get('dateRange');
		goToPrevRange(dateRange);		
	},
	//Next day
	'click .next': function(e){
		e.preventDefault();
		var dateRange = Session.get('dateRange');
		goToNextRange(dateRange);
	},
});

reloadDatepicker = function(data, el){
	console.log('reloadDatepicker')
	var dateInput = el;

	var canViewDateMenu = data.canViewDateMenu;
	var canSetCustomRange = data.canSetCustomRange;
	var isSingleDatePicker = data.singleDatePicker;
	var canFitRange = data.canFitRange;
	
	//console.log('reloaded datepicker\ncanViewDateMenu: ' + canViewDateMenu + '\ncanSetCustomRange: ' + canSetCustomRange + '\nisSingleDatePicker: ' + isSingleDatePicker + '\ncanFitRange: ' + canFitRange);

	if(canViewDateMenu){
		el.removeClass('hidden');

		//Build ranges
		var ranges = {};
		//Show/hide 'best fit' range for timeline dashboard
		if(canFitRange){
			try{
				ranges['Best fit'] = [
					Session.get('timelineFitRange').startDate, 
					Session.get('timelineFitRange').endDate
				];
			}
			catch(err){
				ranges['Best fit'] = [
					moment().startOf('isoweek').startOf('day'),
					moment().endOf('isoweek').endOf('day')
				];	
			}
		}

		//Specify ranges
		ranges['Today'] = [
			moment().startOf('day'), 
			moment().endOf('day')
		];
		ranges['Yesterday'] = [
			moment().subtract(1, 'days').startOf('day'),
			moment().subtract(1, 'days')
		];
		ranges['Last 7 Days'] = [
			moment().subtract(6, 'days').startOf('day'),
			moment().endOf('day')
		];
		ranges['This Week'] = [
			moment().startOf('isoweek').startOf('day'),
			moment().endOf('isoweek').endOf('day')
		];
		ranges['Last 30 Days'] = [
			moment().subtract(29, 'days').startOf('day'),
			moment().endOf('day')
		];
		ranges['This Month'] = [
			moment().startOf('month').startOf('day'),
			moment().endOf('month').endOf('day')
		];
		ranges['Last Month'] = [
			moment().subtract(1, 'month').startOf('month'),
			moment().subtract(1, 'month').endOf('month')
		];

		//Init datepicker
		dateInput.daterangepicker({
			opens: 'left',
			autoApply: true,
			locale: {
				format: 'DD/MM/YYYY'
			},
			ranges: ranges,
			alwaysShowCalendars: canSetCustomRange,
			singleDatePicker: isSingleDatePicker,
			startDate: moment().startOf('day').format('DD/MM/YY'),
			endDate: moment().endOf('day').format('DD/MM/YY'),
		});

		var drp = dateInput.data('daterangepicker');

		/*
		$(document).on('scroll', function () {
			$('#dateRangeInput').blur();
			$('.gn-menu-main').focus();
			$('.date-range-picker').css({'display':'none'});
		});
		*/

		
		if(typeof drp !== 'undefined'){

			//if(t.data.canSetCustomRange)
			
			$(drp.container[0]).addClass('date-range-picker')

			$(drp.container[0]).css({
				//'position':'fixed',
				'top': '65px!important',
			});


			//Remove custom range selector & calendar(s)
			if(canSetCustomRange === false){	
				$('.daterangepicker').find('.ranges li:last-child').hide();
				//IF isSingleDatePicker only hide right calendar
				if(isSingleDatePicker){
					$(drp.container[0]).find('.calendar.right').hide();
				}
				//Otherwise hide both calendars
				else{
					$(drp.container[0]).find('.calendar').hide();
				}
			}
			else{
				$('.daterangepicker').find('.ranges li:last-child').show();
				$(drp.container[0]).find('.calendar').show();
			}
			

			$(dateInput).on('apply.daterangepicker', function(e, picker) {
				var range = $(this).val()
				if( $('#dateRangeInput').hasClass('shown') ) $('#dateRangeInput').removeClass('shown')
				
				//Force dropdown range list to update active class
				picker.updateView(); 
				//Update session values
				setSessionRanges(range, isSingleDatePicker);
				//Remove custom range selector if necessary
				
				if(canSetCustomRange === false){
					$('.daterangepicker').find('.ranges li:last-child').hide();
					$(drp.container[0]).find('.calendar').hide();
				}
				else{
					$('.daterangepicker').find('.ranges li:last-child').show();
					$(drp.container[0]).find('.calendar').show();
				}
			});

			var dateRange = Session.get('dateRange');

			if(!isSingleDatePicker){
				var stringContent = moment(dateRange.startDate).format('DD/MM/YYYY') + ' - ' + moment(dateRange.endDate).format('DD/MM/YYYY');
			}
			else{
				var stringContent = moment(dateRange.startDate).format('DD/MM/YYYY');
			}

			//Manipulate input width according to string length
			dateInput.css({
				'display':'inline-block',
				'width': ((stringContent.length + 1)*9.8) + 'px'
			});

			$('#dateRangeInput').data('daterangepicker').setStartDate(moment(dateRange.startDate).format('DD/MM/YYYY'));
			$('#dateRangeInput').data('daterangepicker').setEndDate(moment(dateRange.endDate).format('DD/MM/YYYY'));
		}

		Meteor.setTimeout(function(){
			$('.dateRangeTooltip').tooltipster({
				delay: 500,
				position: 'bottom',
				contentAsHTML: true,
			});
		}, 1500);

	}
	else{
		el.addClass('hidden');
	}
}

setSessionRanges = function(range, isSingleDatePicker){
	//console.log('setSessionRanges')
	//Retrieve current session object
	var currentRange = Session.get('dateRange');

	if(!isSingleDatePicker){
		//console.log('non single datepicker')
		range = range.split(' - ');
		var startSplit = range[0].split('/');
		var endSplit = range[1].split('/');

		// console.log(startSplit);
		// console.log(endSplit);

		var startDate = moment().year(parseInt(startSplit[2])).month(parseInt(startSplit[1] - 1)).date(startSplit[0]).startOf('day');

		var endDate = moment().year(parseInt(endSplit[2])).month(parseInt(endSplit[1] - 1)).date(endSplit[0]).endOf('day');

		//Rewrite startDate/endDate values
		currentRange.startDate = startDate.toISOString();
		currentRange.endDate = endDate.toISOString();

	}
	else{
		//console.log('SINGLE datepicker')
		range = range.split('/');

		var startDate = moment().set({
			'date': parseInt(range[0]),
			'month': parseInt(range[1] - 1), 
			'year': parseInt(range[2]), 
		}).startOf('day');

		var endDate = moment().set({
			'date': parseInt(range[0]),
			'month': parseInt(range[1] - 1), 
			'year': parseInt(range[2]), 
		}).endOf('day');
		
		//Rewrite startDate/endDate values
		currentRange.startDate = startDate.toISOString();
		currentRange.endDate = endDate.toISOString();
	}

	var period = $('.daterangepicker.dropdown-menu .ranges ul .active')[0].innerText;
	var verbosePeriod = '';
	var textualPeriod = '';
	var altVerbosePeriod = '';

	if(!isSingleDatePicker){
		switch(period){
			case 'Today':
				verbosePeriod = 'Today';
				altVerbosePeriod = 'Daily';
				currentRange.range = 'day';
				break;
			case 'Yesterday':
				verbosePeriod = 'Yesterday';
				altVerbosePeriod = 'Yesterday';
				currentRange.range = 'day';
				break;
			case 'Last 7 Days':
				verbosePeriod = 'Last 7 Days';
				altVerbosePeriod = 'Past 7 Days';
				currentRange.range = 'week';
				break;
			case 'This Week':
				verbosePeriod = 'This Week';
				altVerbosePeriod = 'This Week';
				currentRange.range = 'week';
				break;
			case 'Last 30 Days':
				verbosePeriod = 'Last 30 Days';
				altVerbosePeriod = 'Past 30 Days';
				currentRange.range = 'month';
				break;
			case 'This Month':
				verbosePeriod = 'This Month';
				altVerbosePeriod = 'This Month';
				currentRange.range = 'month';
				break;
			case 'Last Month':
				verbosePeriod = 'Last Month';
				altVerbosePeriod = 'Past Month';
				break;
		}
	}
	else{
		var verbosePeriod = startDate.format('DD/MM/YYYY');
		var altVerbosePeriod = startDate.format('DD/MM/YYYY');
	}

	currentRange.verbosePeriod = verbosePeriod;
	currentRange.altVerbosePeriod = altVerbosePeriod;

	//Re-set session value with updated object
	Session.set('dateRange', currentRange);
	//console.log('finish setting range')
}

goToPrevRange = function(dateRange){

	var currentStartDate = moment(dateRange.startDate);
	var currentEndDate = moment(dateRange.endDate);

	console.log($('#dateRangeInput'))

	switch(dateRange.range){
		case 'day':
		case 'realtime':
			var newStartDate = currentStartDate.subtract(1, 'days').startOf('day');
			var newEndDate = currentEndDate.subtract(1, 'days').endOf('day');
			dateRange.range = 'day';
			break;
		case 'week':
			var newStartDate = currentStartDate.startOf('isoweek').subtract(1, 'weeks');
			var newEndDate = currentEndDate.endOf('isoweek').subtract(1, 'weeks');	
			dateRange.range = 'week';
			break;
		case 'month':
			var newStartDate = currentStartDate.subtract(1, 'month').startOf('month');
			var newEndDate = currentEndDate.subtract(1, 'month').endOf('month');
			dateRange.range = 'month';
			break;
	}

	$('#dateRangeInput').data('daterangepicker').setStartDate(newStartDate.format('DD/MM/YYYY'));
	$('#dateRangeInput').data('daterangepicker').setEndDate(newEndDate.format('DD/MM/YYYY'));
	
	dateRange['startDate'] = newStartDate.toISOString();
    dateRange['endDate'] = newEndDate.toISOString();

    Session.set('dateRange', dateRange);

}

goToNextRange = function(dateRange){
	var currentStartDate = moment(dateRange.startDate);
	var currentEndDate = moment(dateRange.endDate);


	switch(dateRange.range){
		case 'day':
		case 'realtime':
			var newStartDate = currentStartDate.add(1, 'days').startOf('day');
			var newEndDate = currentEndDate.add(1, 'days').endOf('day');
			dateRange.range = 'day';
			break;
		case 'week':
			var newStartDate = currentStartDate.startOf('isoweek').add(1, 'weeks');
			var newEndDate = currentEndDate.endOf('isoweek').add(1, 'weeks');			
			dateRange.range = 'week';
			break;
		case 'month':
			var newStartDate = currentStartDate.add(1, 'month').startOf('month');
			var newEndDate = currentEndDate.add(1, 'month').endOf('month');
			dateRange.range = 'month';
			break;
	}

	$('#dateRangeInput').data('daterangepicker').setStartDate(newStartDate.format('DD/MM/YYYY'));
	$('#dateRangeInput').data('daterangepicker').setEndDate(newEndDate.format('DD/MM/YYYY'));

	dateRange['startDate'] = newStartDate.toISOString();
	dateRange['endDate'] = newEndDate.toISOString();

	Session.set('dateRange', dateRange);
}