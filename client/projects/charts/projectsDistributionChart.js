import { Tracker } from 'meteor/tracker';

var projectsDistributionRefreshInterval;

refreshProjectsDistributionChart = function(dateRange){
	if(!dateRange){
		var dateRange = Session.get('dateRange');
	}

	var el = $('#projectsDistributionChart')
	
	el.prev().remove();
	//el.append('<div class="no-chart-data"><h3>No data for current period</h3><h5><a href="#">Validate</a> your time so it shows up<h5></div>');
	el.before('<div class="loader-overlay boxed"><span>Loading</span><div class="chart-loader"></div>'); //Insert loader
	var callData = {
		//'startDate': "2016-06-30T23:00:00.000Z",
		//'endDate': "2016-07-06T22:59:59.999Z",
		'startDate': dateRange.startDate,
		'endDate': dateRange.endDate,
		'range': dateRange.range,
		'offset': moment().utcOffset() / 60,
	}

	//return;

	Meteor.call('getProjectsDistribution', callData, function(err, data){
		var options = {
			'el': el,
			'detail': 'all',
			'startDate': dateRange.startDate,
			'endDate': dateRange.endDate,
			'range': dateRange.range,
			'dataContext': 'projects',
		}

		//console.log('--- render projects distribution chart ---');
		//console.log(data);

		var chart = new NewChart(data, options);

		chart.drawHorizontalBarsChart();

		el.prev().remove();

		//toastr.info('Refresh Horizontal Chart');
	});
};

Template.projectsDistributionChart.onCreated(function(){
	Meteor.setTimeout(function(){
    	projectsDistributionRefreshInterval = Meteor.setInterval(refreshProjectsDistributionChart, 300*1000);
	}, 5000);
});

Template.projectsDistributionChart.onDestroyed(function(){
    Meteor.clearInterval(projectsDistributionRefreshInterval);
});

Template.projectsDistributionChart.onRendered(function(){
	
	initTooltips();

	this.autorun(function(c) {
		var dateRange = Session.get('dateRange');
		refreshProjectsDistributionChart(dateRange);
	});
});