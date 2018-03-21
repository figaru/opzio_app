buildUserWeeklyReport = function(user, dateRange, scheduledDate){
	var callData = {
		//'startDate': "2016-06-30T23:00:00.000Z",
		//'endDate': "2016-07-06T22:59:59.999Z",
		'userId': user._id,
		'startDate': dateRange.startDate,
		'endDate': dateRange.endDate,
		'range': dateRange.range,
		'offset': scheduledDate.utcOffset() / 60,
	}
	
	Meteor.call('users.getUserProjectActivity', callData, function(err, data){
		
		var options = {
			'detail': 'all',
			'startDate': dateRange.startDate,
			'endDate': dateRange.endDate,
			'range': dateRange.range,
			'dataContext': 'user',
			'userId': user._id
		}

		console.log('--- render chart ---');
		console.log(data);
		console.log('\n\n');

		if(data.length > 0){
			var chart = new NewChart(data, options);

			chart.exportBarsChart();

		}
	})
}