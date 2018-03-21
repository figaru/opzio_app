/*
	The Performance badge for User Main Dashboard
*/

refreshUserPerformance = function(chart, el){
	var dateRange = Session.get('dateRange');
	var metric = el.parent().find('.metric');
	var description = el.parent().find('.description');
	var callData = {
		'userId': Router.current().params.userId,
		'startDate': dateRange.startDate,
		'endDate': dateRange.endDate,
		'range': dateRange.range,
		'offset': moment().utcOffset() / 60,
	}

	Meteor.call('users.getUserPerformance', callData, function(err, data){
		//console.log(data)
		if(!err){
			if(data !== null && typeof data !== 'undefined'){
				if(data.totalTime === 0){
					var percentage = 0;
					metric.html('Generated 0€');
					description.html('Ratio 0');
				}
				else{
					console.log(data.certainBillableTime, data.totalBillableTime)

					var gross = Math.round(data.certainBillableTime);
					var ratio = Math.round(data.certainBillableTime / data.totalBillableTime * 100) / 100;

					var percentage = ratio * 100;
					//var validPercentage = Math.round(data.validatedTime * 100.0 / data.totalTime);
					
					//Set metric content
					metric.html('Generated ' + prettyCount(gross) + '€');
					description.html('Ratio ' + ratio);


					// metric.html('Gross ' + prettyCount(gross) + '€');
					// description.html('Net ' + prettyCount(Math.round(data.certainBillableTime)) + '€');

				}


				var data = {
					'percent': percentage,
					//'targetpercent':  validPercentage
				}
				
				//console.log(data)

				chart.redraw(data)
				//chart.draw(new_degrees);
			}
		}
	});
};

Template.userPerformanceBadge.onRendered(function(){
	//console.log('render user top project')
	var el = Template.instance().$('.chart');

	var data = {
		'percent': 0,
		//'targetpercent': 0
	}

	var options = { 'el': el }

	var chart = new NewGauge(data, options);

	this.userPerformance = Meteor.setInterval(function(){
		refreshUserPerformance(chart, el);
	}, 60 * 1000);

	this.autorun(function(c) {
		var dateRange = Session.get('dateRange');
		
		refreshUserPerformance(chart, el);
	});

});


Template.userPerformanceBadge.onDestroyed(function(){
	Meteor.clearInterval(this.userPerformance)
});