refreshUsersGauge = function(chart, el){
	var dateRange = Session.get('dateRange');
	var metric = el.parent().find('.metric');
	var parent = el.parent();

	var callData = {
		'startDate': dateRange.startDate,
		'endDate': dateRange.endDate,
		'range': dateRange.range,

	}

	el.parent().prepend('<div class="loader-overlay boxed stats"><div class="chart-loader"></div>');

	Meteor.call('getActiveUsers', callData, function(err, data){
		//Default gauge data
		var gaugeData = {
			'percent': 0,
			//'targetpercent': 0,
			//'icon': icons[0],
			//'iconColor': grey
		}

		var metricValue = 'N/A';
		
		if(!err){
			if(data !== null && typeof data !== 'undefined'){
				//Get percentage regarding max
				var percentage = data.active * 100.0 / data.total;

				//Set metric content
				metricValue = prettyCount(data.active) +'/'+ prettyCount(data.total);

				gaugeData['percent'] = percentage;

				$('#organizationUsers').closest('.panel-description').attr('data-activeusers', data.active);
			}
		}

		metric.html(metricValue);
		
		el.html('');
		chart.redraw(gaugeData);
		
		el.parent().find('.loader-overlay').remove();
	});
}

Template.organizationUsers.onRendered(function(){

	var el = Template.instance().$('.chart');

	var data = {
		'percent': 0,
		//'targetpercent': 0,
		//'iconColor': '#EFEFEF'
	}

	var options = {
		'el': el,
		//'useIcon': true,
		//'icon': 'f056',
	}

	var chart = new NewGauge(data, options);

	if(Template.instance().data === null){
		Template.instance().data = {}
	}

	//Refresh users radial chart
	this.usersGaugeInterval = Meteor.setInterval(function(){
		refreshUsersGauge(chart, el);
	}, 60 * 1000);

	//Refresh last user value
	this.lastUserInterval = Meteor.setInterval(function(){
		getLastActiveUser(el);
	}, 5000);

	Tracker.autorun(function (c) {
		var dateRange = Session.get('dateRange');
		var currentHash = Session.get('currentHash');
		if(Router.current().route.path() !== '/dashboard' || Router.current().params.hash !== 'dashboard'){
			c.stop();
		}
		else{
			refreshUsersGauge(chart, el);
			getLastActiveUser(el);
		}
	});
});

Template.organizationUsers.onDestroyed(function(){
	//console.log('destroy user intervals!')
	Meteor.clearInterval(this.usersGaugeInterval)
	Meteor.clearInterval(this.lastUserInterval)
})

getLastActiveUser = function(el){
	var dateRange = Session.get('dateRange');
	var description = el.parent().find('.description');

	Meteor.call('organization.getLastActiveUser', dateRange, function(err, data){
		if(!err){
			if(data.length > 0){
				var userName = getUserShortName(data[0].user);
				description.text(userName);
			}
			else{
				description.text('N/A');
			}
		}
		else{
			console.log(err)
			description.text('N/A');
		}
	});
}