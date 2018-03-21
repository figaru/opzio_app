/*
	The Activity Chart for Organization Main Dashboard
*/

refreshOrgActivityGauge = function(chart, el){
	//console.log('Refresh le activity gauge (organization)')
	var dateRange = Session.get('dateRange');
	var metric = el.parent().find('.metric');
	var description = el.parent().find('.description');

	var callData = {
		'startDate': dateRange.startDate,
		'endDate': dateRange.endDate,
		'range': dateRange.range,
		'offset': moment().utcOffset() / 60,
	}

	el.parent().prepend('<div class="loader-overlay boxed stats"><div class="chart-loader"></div>');

	Meteor.call('getOrganizationTime', callData, function(err, data){
		//console.log('getOrganizationTime')
		//console.log(data)
		
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

					el.parent().attr('data-totaltime', data.totalTime);
				}

				var data = {
					'percent': percentage,
					//'targetpercent':  validPercentage
				}
				chart.redraw(data)
			}
		}

		else{
			console.log(err.reason)
		}

		el.parent().find('.loader-overlay').remove();
	});
}

Template.organizationActivity.onRendered(function(){
	var el = Template.instance().$('.chart');

	var data = {
		'percent': 0
	}

	var options = { 'el': el, }

	var chart = new NewGauge(data, options);

	this.orgActivityGauge = Meteor.setInterval(function(){
		refreshOrgActivityGauge(chart, el);
	}, 60 * 1000);

	Tracker.autorun(function(c) {
		var dateRange = Session.get('dateRange');
		
		if(Router.current().route.path() !== '/dashboard' || Router.current().params.hash !== 'dashboard'){
			//console.log('kill activityChart computation (organization)')
			//Kill computation
			c.stop();
		}
		else{ refreshOrgActivityGauge(chart, el); }
	});

});


Template.organizationActivity.onDestroyed(function(){
	Meteor.clearInterval(this.orgActivityGauge)
});