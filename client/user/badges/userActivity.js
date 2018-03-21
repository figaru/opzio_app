/*
	The Activity for
	Activity badge & performance badge
*/
refreshUserActivityGauge = function(chart, el){
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

	el.parent().prepend('<div class="loader-overlay boxed stats"><div class="chart-loader"></div>');

	Meteor.call('getUserTime', callData, function(err, data){
		if(!err){
			if(data !== null && typeof data !== 'undefined'){
				if(data.totalTime === 0){
					var percentage = 0;
					metric.html('0m 0h/0h');
					description.html('0% validated');
				}
				else{
					var percentage = Math.round(data.validatedTime * 100.0 / data.totalTime);
					//var validPercentage = Math.round(data.validatedTime * 100.0 / data.totalTime);
					
					//Set metric content
					metric.html(getStringFromEpoch(data.validatedTime, true) +'/'+ getStringFromEpoch(data.totalTime, true));
					//description.html(prettyCount(data.validatedCount) +'/'+ prettyCount(data.totalCount));
					description.html(percentage+'% validated');

					// var gross = Math.round(data.certainBillableTime);
					// var net = Math.round(data.certainBillableTime);

					// performanceMetric.html('Gross ' + prettyCount(gross) + '€');
					// performanceDescription.html('Net ' + prettyCount(Math.round(data.certainBillableTime)) + '€');

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
		else{
			console.log(err.reason)
		}

		el.parent().find('.loader-overlay').remove();
	});
}

Template.userActivity.onRendered(function(){
	//console.log('render user activity')
	var el = Template.instance().$('.chart');

	var data = {
		'percent': 0,
		//'targetpercent': 0
	}

	var options = { 'el': el }

	var chart = new NewGauge(data, options);

	this.userActivityGauge = Meteor.setInterval(function(){
		refreshUserActivityGauge(chart, el);
	}, 60 * 1000);

	this.autorun(function(c) {
		var dateRange = Session.get('dateRange');
		refreshUserActivityGauge(chart, el);

	});

});

Template.userActivity.onDestroyed(function(){
	Meteor.clearInterval(this.userActivityGauge)
});