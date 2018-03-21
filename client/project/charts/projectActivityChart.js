/*
	
	Project Activity Chart
	Also responsible for updating users pie chart and active users badge

*/
var projectActivityRefreshInterval;

projectActivityChartRefresh = function(dateRange, badgeEl){
	//console.log('projectActivityChartRefresh')
	if(!dateRange){
		var dateRange = Session.get('dateRange');
	}
	if(!badgeEl){
		var badgeEl = $('#projectUsers');
	}
	
	var options = { 'el': badgeEl[0], }
	//var activeUsersChart = new NewGauge({}, options);

	var projectId = Router.current().params.projectId;
	var project = Projects.findOne({ _id: projectId });

	var metric = badgeEl.parent().find('.metric');
	var description = badgeEl.parent().find('.description');

	var activityChartEl = $('#projectActivityChart');
	var usersPieChartEl = $('#projectUsersPieChart')
	
	badgeEl.parent().prepend('<div class="loader-overlay boxed"><div class="chart-loader"></div>');
	
	activityChartEl.prev().remove();
	activityChartEl.before('<div class="loader-overlay boxed"><span>Loading</span><div class="chart-loader"></div>'); //Insert loader
	
	usersPieChartEl.prev().remove();
	usersPieChartEl.before('<div class="loader-overlay boxed"><span>Loading</span><div class="chart-loader"></div>'); //Insert loader

	var callData = {
		//'startDate': "2016-06-30T23:00:00.000Z",
		//'endDate': "2016-07-06T22:59:59.999Z",
		'projectId': projectId,
		'startDate': dateRange.startDate,
		'endDate': dateRange.endDate,
		'range': dateRange.range,
		'offset': moment().utcOffset() / 60,
	}

	Meteor.call('getProjectActivity', callData, function(err, data){
		
		//console.log(data);
		
		var activeUsers = 0;
		
		//Chart options
		var activityOptions = {
			'el': activityChartEl,
			'detail': 'all',
			'startDate': dateRange.startDate,
			'endDate': dateRange.endDate,
			'range': dateRange.range,
			'dataContext': 'project',
		};

		var usersOptions = {
			'el': usersPieChartEl,
			'detail': 'all',
			'startDate': dateRange.startDate,
			'endDate': dateRange.endDate,
			'range': dateRange.range,
			'dataContext': 'project',
		};

		if(data.length > 0){
			//Bars Chart
			var activityChart = new NewChart(data, activityOptions);
			activityChart.drawBarsChart();
			activityChartEl.prev().remove();
			//Pie Chart
			var usersChart = new NewChart(data, usersOptions);
			usersChart.drawPieChart();
			usersPieChartEl.prev().remove();

			//Active users badge
			_.each(data[0].objectList, function(val, key){
				activeUsers += 1;
			});
			//console.log('activeUsers: ' + activeUsers + ' team ' + project.team.length)
			var percentage = activeUsers * 1.0 / project.team.length;
			var displayPercent = Math.round(percentage * 100) / 100;
			var new_degrees = Math.round(percentage*360);

			if(new_degrees === 0) new_degrees = 1;
			//activeUsersChart.draw(new_degrees);

			metric.html(activeUsers + '/' + project.team.length);
			description.html('Last: ' + getUserShortName(project.lastUser));

			badgeEl.parent().find('.loader-overlay').remove();
		}
		else{
			console.log('no data for period');
			activityChartEl.html('');
			activityChartEl.prev().remove();
			activityChartEl.append(emptyBarsChart);

			usersPieChartEl.html('');
			usersPieChartEl.prev().remove();
			usersPieChartEl.append(emptyPieChart);

			badgeEl.parent().find('.loader-overlay').remove();

			//activeUsersChart.draw(0);
		}


		
		
	});
};


Template.projectActivityChart.onCreated(function(){
	Meteor.setTimeout(function(){
    	projectActivityRefreshInterval = Meteor.setInterval(projectActivityChartRefresh, 60000);
	}, 5000);
});

Template.projectActivityChart.onDestroyed(function(){
    Meteor.clearInterval(projectActivityRefreshInterval);
});

Template.projectActivityChart.onRendered(function(){
	var activeUsersBadgeEl = $('#projectUsers');
	var elWidth = Math.round(activeUsersBadgeEl.parent().width() / 4);
	activeUsersBadgeEl.attr({'height': elWidth, 'width': elWidth});

	var data = {
		'totalTime': 0,
		'validatedTime': 0,
		'validatedCount': 0,
		'unknownTime': 0,
		'unknownCount': 0,
	}

	this.autorun(function (c) {
		var dateRange = Session.get('dateRange');
		projectActivityChartRefresh(dateRange, activeUsersBadgeEl);
	});
});