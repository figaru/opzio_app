refreshProjectActivityAndRealization = function(charts){
	var dateRange = Session.get('dateRange');

	var activityChart = charts.activityChart;
	var realizationChart = charts.realizationChart;
	var timeChart = charts.timeChart;

	var project = Projects.findOne({ _id: Router.current().params.projectId });

	var callData = {
		'projectId': project._id,
		'startDate': dateRange.startDate,
		'endDate': dateRange.endDate,
		'range': dateRange.range,
		'offset': moment().utcOffset() / 60,
		'projectCreateDate': moment(project.createDate).toISOString(),
		'currentDate': moment().toISOString(),
	}

	activityChart.el.parent().prepend('<div class="loader-overlay boxed stats"><div class="chart-loader"></div>');
	timeChart.el.parent().prepend('<div class="loader-overlay boxed stats"><div class="chart-loader"></div>');
	realizationChart.el.parent().prepend('<div class="loader-overlay boxed stats"><div class="chart-loader"></div>');


	Meteor.call('getProjectPeriodTime', callData, function(err, data){

		var activityChartData = {
			'percent': 0,
			'targetpercent': 0
		}
		var activityChartMetric = activityChart.el.parent().find('.metric');
		var activityChartDescription = activityChart.el.parent().find('.description');

		var timeChartData = {
			'percent': 0,
			'targetpercent': 0
		}
		var timeChartMetric = timeChart.el.parent().find('.metric');
		var timeChartDescription = timeChart.el.parent().find('.description');

		var realizationChartData = {
			'percent': 0,
			'targetpercent': 0
		}
		var realizationChartMetric = realizationChart.el.parent().find('.metric');
		var realizationChartDescription = realizationChart.el.parent().find('.description');
		
		var plannedTime = project.plannedTime;
		var timeGoal = _.find(project.goals, function(goal) { return goal.type === 'time' });
		var financialGoal = _.find(project.goals, function(goal) { return goal.type === 'financial' });

		if(dateRange.range === 'day'){
			var rangeGoal = timeGoal.dailyValue * 3600;
			var billingGoal = financialGoal.dailyValue;
			var goalVerbose = 'daily';
		}
		else if(dateRange.range === 'week'){
			var rangeGoal = timeGoal.weeklyValue * 3600;
			var billingGoal = financialGoal.weeklyValue;
			var goalVerbose = 'weekly';
		}
		else if(dateRange.range === 'month'){
			var rangeGoal = timeGoal.monthlyValue * 3600;
			var billingGoal = financialGoal.monthlyValue;
			var goalVerbose = 'monthly';
		}

		if(!err){

			var periodTime = data.periodTime[0];
			var totalTime = data.totalTime[0];

			//Check for period time
			if(typeof periodTime !== 'undefined'){
				//####	ACTIVITY BADGE ####
				var periodValid = periodTime.validatedTime;
				var periodUncertain = periodTime.uncertainTime;
				var periodTotal = periodValid + periodUncertain;

				var validPercent = Math.round(periodValid * 1.0 / periodTotal * 100) / 100;
				var displayPercent = Math.round(validPercent  * 10000 ) / 100;
				
				activityChartData['percent'] = validPercent * 100;
				
				activityChartMetric.html(getStringFromEpoch(periodValid, true) +'/'+ getStringFromEpoch(periodTotal, true));
				activityChartDescription.html(displayPercent+'% validated');

				//####	TOTAL TIME BADGE ####
				var timeGoalPercent = periodValid * 1.0 / rangeGoal;
				timeChartData['percent'] = timeGoalPercent * 100;

				timeChartDescription.html( Math.round( timeGoalPercent * 100 ) + '% from '+ goalVerbose +' goal')

				//Realization
				var billedTime = Math.round(periodTime.billedTime * 100) / 100;
				var totalBillableTime = Math.round(periodTime.totalBillableTime);
				var certainBillableTime = Math.round(periodTime.certainBillableTime * 10) / 10;
				var uncertainBillableTime = Math.round(periodTime.uncertainBillableTime * 10) / 10;

				// console.log(periodTime)
				// console.log('---------')

				// console.log('certainBillableTime ' + certainBillableTime)
				// console.log('uncertainBillableTime ' + uncertainBillableTime)
				// console.log('billingGoal ' + billingGoal)

				var ratio = Math.round(certainBillableTime / totalBillableTime * 10) / 10;

				realizationChartData['percent'] = Math.round(certainBillableTime / billingGoal * 100);
				realizationChartData['targetpercent'] = ratio * 100;

				realizationChartMetric.html(prettyCount(certainBillableTime) +'€ of ' + prettyCount(totalBillableTime)+'€');
				
				//Total time values
				var totalCertainBillableTime = Math.round(totalTime.certainBillableTime);
				var totalBillableTime = Math.round(totalTime.totalBillableTime);

				realizationChartDescription.html(prettyCount(totalCertainBillableTime) + '€ of ' + prettyCount(totalBillableTime)+'€');



			}
			else{
				//Activity
				activityChartMetric.html('0m 0h/0h');
				activityChartDescription.html('0% validated');

				//Time
				timeChartDescription.html('0% from '+ goalVerbose +' goal');

				//Realization
				realizationChartMetric.html('0€ of 0€');

			}
			
			//No period time, user total only if available
			if(typeof totalTime !== 'undefined'){
				var totalValid = totalTime.validatedTime;
				var totalUncertain = totalTime.uncertainTime;

				//Time
				timeChartMetric.html('Total ' + getStringFromEpoch(totalValid, true));

				//Check if we can draw planned time gauge line
				if(plannedTime !== 0){
					timeChartData['targetpercent'] = Math.round(totalValid / (plannedTime * 3600));
				}

				//Realization badge
			}
			else{
				timeChartMetric.html('Total 0h');
			}

			//Draw charts
			//	Activity
			activityChart.redraw(activityChartData);
			activityChart.el.parent().find('.loader-overlay').remove();
			
			//	Time
			//timeChartData['stateColor'] = true;
			timeChart.redraw(timeChartData);
			timeChart.el.parent().find('.loader-overlay').remove();

			//	Realization
			realizationChart.redraw(realizationChartData)
			realizationChart.el.parent().find('.loader-overlay').remove();
			
			return;


			//Realization needs both totalTime & periodTime
			if(typeof periodTime !== 'undefined' && typeof totalTime !== 'undefined'){

			}
			//No period time but totalTime
			else if(typeof periodTime === 'undefined' && totalTime !== 'undefined')


			//####	REALIZATION BADGE ####
			//	No time at all
			if(typeof totalTime === 'undefined'){
				console.log('AAA')
				var percentage = 0;
				realizationChart.el.parent().find('.metric').html('Period 0€');
				realizationChart.el.parent().find('.description').html('Total 0');
			}
			//	No period time
			else if(data.periodTime.length === 0){
				console.log('BBB')
				var percentage = 0;

				var totalTime = data.totalTime[0];
				var totalGross = Math.round(totalTime.totalBillableTime);

				
				realizationChart.el.parent().find('.description').html('Total '+ prettyCount(totalGross) + '€');
			}
			else{
				console.log('CCC')

				//console.log(totalTime.certainBillableTime, totalTime.totalBillableTime)

				//console.log(periodTime.certainBillableTime, periodTime.totalBillableTime)

				var gross = Math.round(periodTime.totalBillableTime);
				var ratio = Math.round(periodTime.certainBillableTime / periodTime.totalBillableTime * 100) / 100;

				var percentage = ratio * 100;
				//var validPercentage = Math.round(data.validatedTime * 100.0 / totalPeriod);
				
				//Set metric content
				realizationChart.el.parent().find('.metric').html('Billable ' + prettyCount(gross) + '€');
				realizationChart.el.parent().find('.description').html('<span title="Ratio between billed time VS. total registered time.">Ratio ' + ratio+'</span>');


				// metric.html('Gross ' + prettyCount(gross) + '€');
				// description.html('Net ' + prettyCount(Math.round(data.certainBillableTime)) + '€');

			}
		}
		else{
			activityChart.el.parent().find('.loader-overlay').remove();
			timeChart.el.parent().find('.loader-overlay').remove();
			realizationChart.el.parent().find('.loader-overlay').remove();
		}
	});
}

Template.projectBadges.onRendered(function(){
	var activityEl = Template.instance().$('#projectActivity');
	var timeEl = Template.instance().$('#projectTime');
	var realizationEl = Template.instance().$('#projectRealization');

	var data = {
		'percent': 0,
	}
	
	var activityChart = new NewGauge(data, { 'el': activityEl });
	var timeChart = new NewGauge(data, { 'el': timeEl });
	var realizationChart = new NewGauge(data, { 'el': realizationEl });
	

	refreshProjectActivityAndRealization({
		'activityChart': activityChart,
		'timeChart': timeChart,
		'realizationChart': realizationChart
	});

	this.projectActivityRealizationBadges = Meteor.setInterval(function(){
		refreshProjectActivityAndRealization({
			'activityChart': activityChart,
			'timeChart': timeChart,
			'realizationChart': realizationChart
		});
	}, 60 * 1000);

	//Time period total time tracker
	this.autorun(function(){
		//console.log('run proejct badges tracker')
		var dateRange = Session.get('dateRange');
		
		refreshProjectActivityAndRealization({
			'activityChart': activityChart,
			'timeChart': timeChart,
			'realizationChart': realizationChart
		});
	});

	//Swiper initialization

	var swiper = new Swiper('.badges-area', {
		loop: false,
		//Default desktop settings
		initialSlide: 0,
		slidesPerView: 'auto',
		slidesPerGroup: 1,
		spaceBetween: 15,
		grabCursor: false,
		pagination: '.swiper-pagination',
		paginationClickable: true,
	});

	_setBadgesSize(swiper, Session.get('deviceWidth'));

	//Tooltips
	$('.badgeTooltip').tooltipster({
		contentAsHTML: true,
		delay: 500,
		// interactive: true,
		// trigger: 'click'
	});

	$(window).on('resize', function(){
		console.log('resize badges')
		_setBadgesSize(swiper, $(window).width());
	});

	this.autorun(function () {
		var deviceWidth = Session.get('deviceWidth');
		_setBadgesSize(swiper, deviceWidth);
	});
});

Template.projectBadges.onDestroyed(function(){
	Meteor.clearInterval(this.projectActivityRealizationBadges);
});