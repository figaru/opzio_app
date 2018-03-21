import { Tracker } from 'meteor/tracker';

var organizationActivityRefreshInterval;

refreshChart = function(dateRange){

	if(!dateRange){
		var dateRange = Session.get('dateRange');
	}

	var el = $('#activityChart')
	
	el.prev().remove();
	
	el.before('<div class="loader-overlay boxed"><span>Loading</span><div class="chart-loader"></div>'); //Insert loader
	
	var callData = {
		'startDate': dateRange.startDate,
		'endDate': dateRange.endDate,
		'range': dateRange.range,
		'offset': moment().utcOffset() / 60,
	}

	Meteor.call('getOrganizationActivity', callData, function(err, data){
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
			chart.drawBarsChart();
		}
		else{
			el.html('');
			el.append(emptyBarsChart);
		}
		el.parent().find('.loader-overlay').remove();
	});
};

Template.activityChart.onCreated(function(){
	Meteor.setTimeout(function(){
    	organizationActivityRefreshInterval = Meteor.setInterval(refreshChart, 300*1000);
	}, 5000);
});

Template.activityChart.onRendered(function(){
	this.autorun(function(c) {
		var dateRange = Session.get('dateRange');
		
		refreshChart(dateRange);
	});
});

Template.activityChart.onDestroyed(function(){
    Meteor.clearInterval(organizationActivityRefreshInterval);
});

//Extracts some other metrics returned by the aggregation
getPeriodMetrics = function(data){
	var meanTotal = 0;
	var mean = 0;
	if(typeof data !== 'undefined'){
		var dataSize = data.length;

		if(dataSize === 0){ return; }
		
		var tmpUsers = {};
		var topUsers = [];


		for(var i = 0; i < dataSize; i++){
			//console.log(data[i])
			meanTotal += data[i].avgTime;
			
			for(var j = 0; j < data[i].users.length;j++){
				
				if(typeof tmpUsers[data[i].users[j].user] !== 'undefined'){
					var tmpTotal = tmpUsers[ data[i].users[j].user ];
					tmpTotal += data[i].users[j].totalTime;
					tmpUsers[ data[i].users[j].user ] = tmpTotal;
				}
				else{
					tmpUsers[ data[i].users[j].user ] = data[i].users[j].totalTime;
				}
			}
		}

		_.each(tmpUsers, function(val, key){
			topUsers.push({
				user: key,
				totalTime: val
			});
		});

		mean = meanTotal / dataSize;

		$('#periodAverage .metric').text(getStringFromEpoch(mean));

		sortByTime(topUsers);

		$('#topMember .metric').html('<a href="/user/'+ topUsers[0].user +'#dashboard" >'+ getUserShortName(topUsers[0].user) +'</a>');
	}
}