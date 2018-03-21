fetchCalendarEvents = function(cal){
	//console.log('fetchCalendarEvents')
	cal.fullCalendar('removeEvents');
	var view = cal.fullCalendar('getView');
	//GET RANGE DATES
	var dates = getCalendarDateRange().dates;
	var start = moment(dates.start);
	var end = moment(dates.end);

	var bodyHeight = $('.fc-body').height();
	var detailLevel = Session.get('calendarDetail');

	//Fetch events for each day within range

	while(start.isBefore(end)){
		if(view.name === 'agendaWeek'){
			var dayRow = $('.fc-day-header[data-date='+ start.format('YYYY-MM-DD') +']');
			var rowWidth = dayRow.width()
			dayRow.append('<div class="dayTotalTime mx-2 mb-0 badge badge-primary miw-6"><i class="fa fa-clock-o"></i><span class="chart-loader badge-loader"></span></div>')
			dayRow.append('<div class="dayValidated mx-2 mb-2 badge miw-6"><i class="fa fa-check-circle-o"></i><span class="chart-loader badge-loader"></span></div>')
			dayRow.append('<div class="day-loader d-flex justify-content-center align-items-center" style="width:'+rowWidth+'px;height:'+bodyHeight+'px"><span class="text-center"><div class="chart-loader"></div>Loading</span>')
		}
		
		Meteor.call('users.getUserDayActivity', start.startOf('day').toISOString(), start.endOf('day').toISOString(), 'project', Meteor.userId(), start.format('YYYY-MM-DD'), function(err, data){
			
			var items = [];
			var logs = data.logs;
			var totalTimeSum = 0;
			var totalValidSum = 0;
			
			for(var i=0; i<logs.length; i++){
				
				var eventStyles = setEventStyles(logs[i]);

				totalTimeSum += logs[i].totalTime;

				if(logs[i].validated) totalValidSum += logs[i].totalTime;
					
				//Set detail & hide class in case of agendaWeek (list view always displays all events)
				var detailClasses = '';
				var hiddenClass = '';
				
				if(logs[i].totalTime >= 900){ detailClasses += ' lowLevelDetail'; }
				else if(logs[i].totalTime >= 300 && logs[i].totalTime < 900){ detailClasses += ' midLevelDetail'; }
				else{ detailClasses += ' highLevelDetail'; }

				//Deceide whether or not to show/hide event
				// if(detailLevel === 'midLevelDetail'){
				// 	if(detailClasses.match('highLevelDetail') !== null){
				// 		//Display both mid and low level detail events
				// 		hiddenClass = 'hidden';
				// 	}
				// }
				// else if(detailLevel === 'lowLevelDetail'){
				// 	if(detailClasses.match('highLevelDetail') !== null || detailClasses.match('midLevelDetail') !== null){
				// 		//Display both mid and low level detail events
				// 		hiddenClass = 'hidden';
				// 	}
				// }
				
				// if(view.name === 'agendaWeek'){
				// }

				//Check whether or not to hide depending on filtesr
				//Finally decide whether or not to hide event depending on filter options
				if(Session.get('invalidOnly') === true){
					if(logs[i].validated) hiddenClass = 'hidden';
				}
				if(Session.get('privateOnly') === true){
					if(logs[i].private) hiddenClass = 'hidden';
				}
				/*
				if(typeof Session.get('privateOnly') === 'undefined'){
					Session.set('privateOnly', false);
				}
				*/

				try{
					var label = logs[i].category.label;
				}
				catch(err){
					var label = 'Other';
				}

				items.push({
					objectId: logs[i]._id,
					title: _.escape(logs[i].pageTitle),
					domain: logs[i].domain,
					uri: logs[i].uri,
					category: label,
					project: logs[i].project,
					private: logs[i].private,
					totalTime: logs[i].totalTime,
					billed: logs[i].billed,
					hourRate: logs[i].hourRate,
					validated: logs[i].validated,
					start: moment(logs[i].createDate).toISOString(),
					startHour: moment(logs[i].createDate).format('HH:mm'),
					end: moment(logs[i].createDate).add(logs[i].totalTime, 'seconds').toISOString(),
					endHour: moment(logs[i].createDate).add(logs[i].totalTime, 'seconds').format('HH:mm'),
					columnStartDate: moment(logs[i].createDate).format('YYYY-MM-DD'),
					eventColor: eventStyles.color,
					icon: eventStyles.icon,
					sourceIcon: eventStyles.sourceIcon,
					sourceTooltip: eventStyles.sourceTooltip,
					activityTooltip: eventStyles.activityTooltip,
					detailClasses: detailClasses,
					hiddenClass: hiddenClass
					// selectable: true,
					// eventStartEditable: false,
					// eventDurationEditable: true,
				});
			}


			cal.fullCalendar('renderEvents', items, true);
			
			if(view.name === 'agendaWeek'){
				dayRow = $('.fc-day-header[data-date='+ data.startDate +']');
				dayRow.find('.dayTotalTime').html('<i class="fa fa-clock-o"></i>&nbsp;'+getStringFromEpoch(totalTimeSum, true));
			}
			else{
				dayRow = $('.fc-widget-header');	
				// dayRow.append('<div class="dayTotalTime mx-2 mb-0 badge badge-primary miw-6"><i class="fa fa-clock-o"></i>'+ getStringFromEpoch(totalTimeSum, true) +'</div>')
				// dayRow.append('<div class="dayValidated mx-2 mb-2 badge miw-6"><i class="fa fa-check-circle-o"></i><span class="chart-loader badge-loader"></span></div>')
			}
			
			dayRow.attr('data-totaltime', totalTimeSum);
			dayRow.attr('data-totalvalid', totalValidSum);


			
			var validPercentage = Math.round(totalValidSum / totalTimeSum * 1000) / 10;
			var validatedBadge = dayRow.find('.dayValidated');
			
			if(!isNaN(validPercentage)){
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
					validatedBadge.addClass('badge-success');
				}
				
				validatedBadge.html('<i class="fa fa-check-circle-o"></i>&nbsp;'+validPercentage+'%')
			}
			else{
				validatedBadge.addClass('badge-gray').html('<i class="fa fa-check-circle-o"></i>&nbsp;0%')
			}
			
			
			//Remove column loader
			dayRow.find('.day-loader').remove();
		});

		start = start.add(1, 'days');
	}
}