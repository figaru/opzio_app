import { Tracker } from 'meteor/tracker';

var organizationActivitiesRefreshInterval;

organizationActivitiesChartRefresh = function(dateRange){
	if(!dateRange){
		var dateRange = Session.get('dateRange');
	}

	var el = $('#organizationActivitiesChart')
	//el.css({opacity: 0});
	el.prev().remove();
	el.before('<div class="loader-overlay boxed"><span>Loading</span><div class="chart-loader"></div>'); //Insert loader
	
	var callData = {
		//'userId': Router.current().params.userId,
		'startDate': dateRange.startDate,
		'endDate': dateRange.endDate,
		'range': dateRange.range,
		'offset': moment().utcOffset() / 60,
	}

	Meteor.call('getOrganizationActivities', callData, function(err, data){
		var options = {
			'el': el,
			'detail': 'all',
			'startDate': dateRange.startDate,
			'endDate': dateRange.endDate,
			'range': dateRange.range,
			'dataContext': 'organization',
		}

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


Template.organizationActivitiesChart.onCreated(function(){
	Meteor.setTimeout(function(){
    	organizationActivitiesRefreshInterval = Meteor.setInterval(organizationActivitiesChartRefresh, 300*1000);
	}, 5000);
});

Template.organizationActivitiesChart.onDestroyed(function(){
    Meteor.clearInterval(organizationActivitiesRefreshInterval);
});

Template.organizationActivitiesChart.onRendered(function(){
	var dateRange = Session.get('dateRange');
	organizationActivitiesChartRefresh(dateRange);
	
	this.autorun(function (c) {
		var dateRange = Session.get('dateRange');
		
		organizationActivitiesChartRefresh(dateRange);
	
	});
});