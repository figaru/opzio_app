import { Tracker } from 'meteor/tracker';

var projectDistributionRefreshInterval;

refreshProjectDistributionChart = function(dateRange){
	if(!dateRange){
		var dateRange = Session.get('dateRange');
	}

	var el = $('#projectDistributionChart')
	//el.css({opacity: 0});
	el.prev().remove();
	el.before('<div class="loader-overlay boxed"><div class="chart-loader"></div>'); //Insert loader
	var callData = {
		//'startDate': "2016-06-30T23:00:00.000Z",
		//'endDate': "2016-07-06T22:59:59.999Z",
		'projectId': Router.current().params.projectId,
		'startDate': dateRange.startDate,
		'endDate': dateRange.endDate,
		'range': dateRange.range,
		'offset': moment().utcOffset() / 60,
	}

	Meteor.call('getProjectDistribution', callData, function(err, data){
		var options = {
			'el': el,
			'detail': 'all',
			'startDate': dateRange.startDate,
			'endDate': dateRange.endDate,
			'range': dateRange.range,
			'dataContext': 'project',
		}

		//console.log('--- render projects distribution chart ---');
		//console.log(data);

		var chart = new NewChart(data, options);

		chart.drawHorizontalBarsChart();

		el.prev().remove();

		//toastr.info('Refresh Horizontal Chart');
	});
};

Template.projectDistributionChart.onCreated(function(){
	Meteor.setTimeout(function(){
    	projectDistributionRefreshInterval = Meteor.setInterval(refreshProjectDistributionChart, 60000);
	}, 5000);
});

Template.projectDistributionChart.onDestroyed(function(){
    Meteor.clearInterval(projectDistributionRefreshInterval);
});

Template.projectDistributionChart.onRendered(function(){
	this.autorun(function(c) {
		var dateRange = Session.get('dateRange');
		refreshProjectDistributionChart(dateRange);
	});
});