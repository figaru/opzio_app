import { Tracker } from 'meteor/tracker';

var projectsActivityRefreshInterval;

projectsActivityChartRefresh = function(dateRange){
	if(!dateRange){
		var dateRange = Session.get('dateRange');
	}

	var activityChartEl = $('#projectsActivityChart');
	var pieChartEl = $('#projectsPieChart');

	activityChartEl.prev().remove();
	activityChartEl.before('<div class="loader-overlay boxed"><span>Loading</span><div class="chart-loader"></div>'); //Insert loader

	pieChartEl.prev().remove();
	pieChartEl.before('<div class="loader-overlay boxed"><span>Loading</span><div class="chart-loader"></div>'); //Insert loader

	var callData = {
		'startDate': dateRange.startDate,
		'endDate': dateRange.endDate,
		'range': dateRange.range,
		'offset': moment().utcOffset() / 60,
	}

	//return;

	Meteor.call('getProjectsActivity', callData, function(err, data){
		
		//console.log(data);

		var activityOption = {
			'el': activityChartEl,
			'detail': 'all',
			'startDate': dateRange.startDate,
			'endDate': dateRange.endDate,
			'range': dateRange.range,
			'dataContext': 'projects',
		}

		var projectsOptions = {
			'el': pieChartEl,
			'detail': 'all',
			'startDate': dateRange.startDate,
			'endDate': dateRange.endDate,
			'range': dateRange.range,
			'dataContext': 'projects',
		};

		//console.log('--- render projects chart range '+ dateRange.range +' ---');
		//console.log(data);
		
		if(data.length > 0){
			var activityChart = new NewChart(data, activityOption);
			activityChart.drawBarsChart();
			activityChartEl.prev().remove();

			var projectsChart = new NewChart(data, projectsOptions);
			projectsChart.drawPieChart();
			
			pieChartEl.prev().remove();
		}
		else{
			//console.log('no data for period');
			activityChartEl.html('');
			activityChartEl.prev().remove();
			activityChartEl.append(emptyBarsChart);

			pieChartEl.html('')
			pieChartEl.prev().remove();
			pieChartEl.append(emptyPieChart);
		}

		//getPeriodMetrics(data);
		
		//toastr.info('Chart Refresh');
		
	});
};


Template.projectsActivityChart.onCreated(function(){
	Meteor.setTimeout(function(){
    	projectsActivityRefreshInterval = Meteor.setInterval(projectsActivityChartRefresh, 300*1000);
	}, 5000);
});

Template.projectsActivityChart.onDestroyed(function(){
    Meteor.clearInterval(projectsActivityRefreshInterval);
});

Template.projectsActivityChart.onRendered(function(){
	this.autorun(function (c) {
		var dateRange = Session.get('dateRange');
		var currentHash = Session.get('currentHash');
		projectsActivityChartRefresh(dateRange);
	});
})