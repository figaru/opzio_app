import { Tracker } from 'meteor/tracker';

var teamRefreshInterval;

teamLeaderboardRefresh = function(dateRange){
	if(!dateRange){
		var dateRange = Session.get('dateRange');
	}

	var el = $('#teamLeaderboardChart')
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

	Meteor.call('users.getUsersLeaderboard', callData, function(err, data){

		console.log(data)

		var options = {
			'el': el,
			'detail': 'validOnly',
			'startDate': dateRange.startDate,
			'endDate': dateRange.endDate,
			'range': dateRange.range,
			'dataContext': 'organization',
		}

		if(data.length > 0){
			var chart = new NewChart(data, options);
			
			chart.drawHorizontalBarsChart();

			el.prev().remove();
		}
		else{
			el.html('');
			el.prev().remove();
			el.append(emptyHorizontalBars);
		}
	});
};


Template.teamLeaderboardChart.onCreated(function(){
	Meteor.setTimeout(function(){
    	teamRefreshInterval = Meteor.setInterval(teamLeaderboardRefresh, 300*1000);
	}, 5000);
});

Template.teamLeaderboardChart.onDestroyed(function(){
    Meteor.clearInterval(teamRefreshInterval);
});

Template.teamLeaderboardChart.onRendered(function(){
	var dateRange = Session.get('dateRange');
	
	//teamLeaderboardRefresh(dateRange);

	this.autorun(function (c) {
		var dateRange = Session.get('dateRange');
		
		teamLeaderboardRefresh(dateRange);
	
	});
});