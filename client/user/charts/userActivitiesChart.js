import { Tracker } from 'meteor/tracker';

var userActivitiesRefreshInterval;

userActivitiesChartRefresh = function(dateRange){
	if(!dateRange){
		var dateRange = Session.get('dateRange');
	}

	var el = $('#userActivitiesChart')
	//el.css({opacity: 0});
	el.prev().remove();
	el.before('<div class="loader-overlay boxed"><span>Loading</span><div class="chart-loader"></div>'); //Insert loader
	var callData = {
		//'startDate': "2016-06-30T23:00:00.000Z",
		//'endDate': "2016-07-06T22:59:59.999Z",
		'userId': Router.current().params.userId,
		'startDate': dateRange.startDate,
		'endDate': dateRange.endDate,
		'range': dateRange.range,
		'offset': moment().utcOffset() / 60,
	}
	
	Meteor.call('getUserActivities', callData, function(err, data){
		
		//console.log(data);
		
		var options = {
			'el': el,
			'detail': 'all',
			'startDate': dateRange.startDate,
			'endDate': dateRange.endDate,
			'range': dateRange.range,
			'dataContext': 'user',
		}

		//console.log('--- render project chart ---');
		//console.log(data);

		if(data.length > 0){
			var chart = new NewChart(data, options);

			chart.drawPieChart();

			el.prev().remove();
		}
		else{
			el.html('');
			el.prev().remove();
			el.append(emptyPieChart);
		}
	});
};


Template.userActivitiesChart.onCreated(function(){
	Meteor.setTimeout(function(){
    	userActivitiesRefreshInterval = Meteor.setInterval(userActivitiesChartRefresh, 60000);
	}, 5000);
});

Template.userActivitiesChart.onDestroyed(function(){
    Meteor.clearInterval(userActivitiesRefreshInterval);
});

Template.userActivitiesChart.onRendered(function(){
	this.autorun(function (c) {
		var dateRange = Session.get('dateRange');	
		userActivitiesChartRefresh(dateRange);
	});
});