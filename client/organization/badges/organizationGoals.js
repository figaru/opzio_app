calculateOrgGoals = function(chart, el){
	var dateRange = Session.get('dateRange');
	var activeUsers = $('#organizationUsers').parent().attr('data-activeusers');
	var totalTime = $('#organizationActivity').parent().attr('data-totaltime');
	var metric = el.parent().find('.metric');

	activeUsers = parseInt(activeUsers);
	totalTime = parseInt(totalTime);

	//console.log(activeUsers, totalTime)

	var gaugeData = {
		'percent': 0,
	}

	var metricValue = 'N/A';
	var descriptionValue = '';

	if(activeUsers > 0 && totalTime > 0){
		var dailyGoal = 28800;  //8h = 28800
		var totalGoal = dailyGoal;

		let periodLength = parseInt(moment(dateRange.endDate).format('DDD')) - parseInt(moment(dateRange.startDate).format('DDD')) + 1;

		if(periodLength > 1){
			totalGoal = dailyGoal * periodLength;
		}

		totalGoal = totalGoal * activeUsers;

		var percentage = totalTime * 100.0 / totalGoal;
		
		percentage = Math.round(percentage * 100.0) / 100;

		//Set metric content
		metricValue = percentage+'%';
		//description.html(prettyCount(data.validatedCount) +'/'+ prettyCount(data.totalCount));

		gaugeData['percent'] = percentage;
	}

	//Redraw chart;
	metric.html(metricValue);
	//description.html(descriptionValue);
	el.html('');
	chart.redraw(gaugeData);


	el.parent().find('.loader-overlay').remove();
}

Template.organizationGoals.onRendered(function(){

	var el = Template.instance().$('.chart');

	var elWidth = Math.round(el.parent().width() / 4);
	el.attr({'height': elWidth, 'width': elWidth});
	
	//console.log('for users: ' + elWidth)

	var data = {
		'percentage': 0
	}

	var options = {
		'el': el,
	}

	var chart = new NewGauge(data, options);

	if(Template.instance().data === null){
		Template.instance().data = {}
	}

	calculateOrgGoals(chart, el);

	el.parent().prepend('<div class="loader-overlay boxed stats"><div class="chart-loader"></div>');

	Meteor.setTimeout(function(){
		calculateOrgGoals(chart, el);
	}, 5000)

	this.organizationGoalsInterval = Meteor.setInterval(function(){
		el.parent().prepend('<div class="loader-overlay boxed stats"><div class="chart-loader"></div>');
		calculateOrgGoals(chart, el);
	}, 60 * 1000);

	Tracker.autorun(function (c) {
		var dateRange = Session.get('dateRange');
		var currentHash = Session.get('currentHash');
		if(Router.current().route.path() !== '/dashboard' || Router.current().params.hash !== 'dashboard'){
			c.stop();
		}
		else{
			el.parent().prepend('<div class="loader-overlay boxed stats"><div class="chart-loader"></div>');
			Meteor.setTimeout(function(){
				calculateOrgGoals(chart, el);
			}, 5000)
		}
	});

});

Template.organizationGoals.onDestroyed(function(){
	//console.log('destroy!')
	Meteor.clearInterval(this.organizationGoalsInterval)
})