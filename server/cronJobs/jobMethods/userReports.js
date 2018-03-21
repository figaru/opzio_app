/*
	userReports
	
	Runs every hour and checks for given user whether or not it should send 
	a daily, weekly and monthly report of worked hours, top projects and validation/privacy ratios

*/
Meteor.methods({
	'cron.userReports': function(user){
		//console.log('running userReports')
		
		//For TEST ONLY
		// var currentDay = moment().month(5).date(30)
		// //var currentDay = moment().month(11).date(26)
		// var endOfMonth = currentDay.clone().endOf('month');

		var sendReport = false,
			currentDay = moment(),
			endOfMonth = moment().endOf('month'),
			selectedReports = {
				daily: false,
				weekly: false,
				monthly: false,
			}

		//Check whether we want to send any notifications to the user according to preferences
		for(var j=0; j<user.notificationOptions.length; j++){
			
			switch(user.notificationOptions[j].name){
				case 'userDailyReportOptions':
					if(user.notificationOptions[j].active){
						//console.log('*** CRN: RUNNNING daily userReport for ' + user._id + ', ' + user.profile.firstName + ' ' + user.profile.lastName)
						selectedReports['daily'] = user.notificationOptions[j];
					}
					break;

				case 'userWeeklyReportOptions':
					if(user.notificationOptions[j].active){
						//console.log('*** CRN: RUNNNING weekly userReport for ' + user._id + ', ' + user.profile.firstName + ' ' + user.profile.lastName)
						selectedReports['weekly'] = user.notificationOptions[j];
					}
					break;

				case 'userMonthlyReportOptions':
					if(user.notificationOptions[j].active){
						//console.log('*** CRN: RUNNNING monthly userReport for ' + user._id + ', ' + user.profile.firstName + ' ' + user.profile.lastName)
						selectedReports['monthly'] = user.notificationOptions[j];
					}
					break;
			}
		}
		
		//console.log(selectedReports)

		//Decide which reports to run and send
		//A daily report is always sent, if applicable, but it can be coupled with Weekly or monthly reports, are sent on respective periods.
		//Email cases:
			// ->  Daily only (it's not the end of the month, not the end of the week, so we send a simply daily report)
			// ->  Week end only (it's the end of the week but not the end of the month, so we send a daily report coupled with weekly report)
			// ->  Month end only (it's the end of the month but not the end of the week, so we send a daily report coupled with monthly report)
			// ->  Month and Week end (it's the end of the week and end of the month, so we send a daily report coupled with weekly and monthly report)


		// console.log(currentDay)
		// console.log(endOfMonth)

		//Send Day report 
		if(selectedReports['daily']){
			//console.log('DAILY')

			var scheduledDate = moment(selectedReports['daily'].scheduledHour);
			var compareDay = currentDay.clone().utcOffset(scheduledDate.utcOffset(), true);

			// console.log('scheduledDate: ', scheduledDate.toISOString())
			// console.log('compareDay:    ', compareDay.toISOString())
			// console.log('lastSendDate:  ', moment(selectedReports['daily'].lastSendDate).toISOString())
			// console.log('send date before: ' + moment(selectedReports['daily'].lastSendDate).isBefore(compareDay, 'day'))
			// console.log('hour: ', scheduledDate.utc().hour() === compareDay.utc().hour())

			//Check if report has been sent
			if(moment(selectedReports['daily'].lastSendDate).isBefore(compareDay, 'day')){
				//For business days
				if(compareDay.format('E') !== '6' && compareDay.format('E') !== '7'){
					//Check if right now is the hour to send report
					if( scheduledDate.utc().hour() === compareDay.utc().hour()){
						console.log('\tCrunch daily report!')
						// console.log('\tSEND! (week)')

						var dateRange = {
							startDate: compareDay.clone().startOf('day').toISOString(),
							endDate: compareDay.clone().endOf('day').toISOString(),
							// /*FOR TESTS ONLY*/
							// 'startDate': '2017-07-20T00:00:00.000Z',
							// 'endDate': '2017-07-20T22:59:59.999Z',
							range: 'day'
						}
						
						buildUserReport(user, dateRange, scheduledDate);

						Meteor.users.update({
							_id: user._id,
							'notificationOptions.name': selectedReports['daily'].name
						},
						{
							$set:{ 'notificationOptions.$.lastSendDate': compareDay.toDate() }
						});
					}
					// else{
					// 	console.log('not the scheduled hour to send')
					// }
				}
				//For weekends
				else{
					if(selectedReports['daily'].includeWeekends){
						//Check if right now is the hour to send report
						if( scheduledDate.utc().hour() === compareDay.utc().hour()){
							// console.log('\tCrunch daily report!')
							// console.log('\tSEND! (weekend)')

							var dateRange = {
								startDate: compareDay.clone().startOf('day').toISOString(),
								endDate: compareDay.clone().endOf('day').toISOString(),
								range: 'day'
							}
							
							buildUserReport(user, dateRange, scheduledDate)

							Meteor.users.update({
								_id: user._id,
								'notificationOptions.name': selectedReports['daily'].name
							},
							{
								$set:{ 'notificationOptions.$.lastSendDate': compareDay.toDate() }
							});
						}
						// else{
						// 	console.log('not the scheduled hour to send (weekend)')
						// }
					}
					// else{
					// 	console.log('\tdont send on weekend')
					// }
				}
			}
			// else{
			// 	console.log('\t ALREADY SENT FOR TODAY!')
			// }
		}

		//Send weekly report
		if(selectedReports['weekly']){
			// console.log('WEEKLY')
			var scheduledDate = moment(selectedReports['weekly'].scheduledHour);
			var compareDay = currentDay.clone().utcOffset(scheduledDate.utcOffset(), true);
			
			if(moment(selectedReports['weekly'].lastSendDate).isBefore(compareDay, 'day')){
				//Check if current day is end of Week
				if(compareDay.format('dddd').toLowerCase() === selectedReports['weekly'].sendDay){
					//Check if right now is the hour to send report
					if( scheduledDate.utc().hour() === compareDay.utc().hour()){
						//console.log('\tCrunch weekly report!')
						
						var dateRange = {
							startDate: compareDay.clone().local().subtract(6, 'days').startOf('day').toISOString(),
							endDate: compareDay.clone().local().endOf('day').toISOString(),
							// startDate: compareDay.clone().local().startOf('isoweek').toISOString(),
							// endDate: compareDay.clone().local().endOf('isoweek').toISOString(),
							range: 'week'
						}

						buildUserReport(user, dateRange, scheduledDate)

						Meteor.users.update({
							_id: user._id,
							'notificationOptions.name': selectedReports['weekly'].name
						},
						{
							$set:{ 'notificationOptions.$.lastSendDate': compareDay.toDate() }
						});
						
					}
					// else{
					// 	console.log('\tday but not hour')
					// }
				}
				// else{
				// 	console.log('\tnot day to send')
				// }
			}
			// else{
			// 	console.log('\t ALREADY SENT FOR TODAY (weekly report)!')
			// }
		}

		//Send monthly report
		if(selectedReports['monthly']){
			//console.log('MONTHLY')
			//var scheduledDate = moment(selectedReports['monthly'].scheduledHour);
			var compareDay = currentDay.clone().utcOffset(scheduledDate.utcOffset(), true);
			endOfMonth = endOfMonth.clone().utcOffset(scheduledDate.utcOffset(), true);
			
			if(moment(selectedReports['monthly'].lastSendDate).isBefore(compareDay, 'day')){
				if( scheduledDate.utc().date() === endOfMonth.utc().date()){
					//Check if right now is the hour to send report
					if( scheduledDate.utc().hour() === compareDay.utc().hour()){
						// console.log('\tCrunch monthly report!')
						// console.log('\tSEND! (month)')

						var dateRange = {
							startDate: compareDay.clone().local().startOf('month').toISOString(),
							endDate: compareDay.clone().local().endOf('month').toISOString(),
							range: 'week'
						}

						buildUserReport(user, dateRange, scheduledDate)

						Meteor.users.update({
							_id: user._id,
							'notificationOptions.name': selectedReports['monthly'].name
						},
						{
							$set:{ 'notificationOptions.$.lastSendDate': compareDay.toDate() }
						});
					}
					// else{
					// 	console.log('\tday but not hour')
					// }
				}
				// else{
				// 	console.log('\tnot day to send')
				// }
			}
			// else{
			// 	console.log('\t ALREADY SENT FOR TODAY (monthly report)!')
			// }
		}
		
		//console.log('-------------')		
	}
});