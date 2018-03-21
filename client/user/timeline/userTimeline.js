Template.userTimeline.onRendered(function(){
	var container = $('#userTimeline');

	let dateRange = Session.get('dateRange');
	
	//Store timeline object in template data
	var tData = { 
		'timeline': '',
		'timelineStartDate': '',
		'timelineEndDate': '',
		'originalItems': [],
		'logs': []
	};

	var t = Template.instance();
	t.data = tData;

	/*
	Meteor.call('moves.getCurrentDay', function(err, data){
		console.log(data);
	});
	*/
	
	if(typeof group === 'undefined') Session.set('groupOption', 'project');

	//Tracker runs when dateRange or groupOption session variables change
	Tracker.autorun(function () {

		//group = Session.get('groupOption');
		//console.log('group ' + group)
		//console.log(t.data)
		if(t.data === null) t.data = tData;

		t.data.timeline = drawUserTimeline(container).timeline;
		t.data.timeline.setWindow(dateRange.startDate, dateRange.endDate);
		t.data.timeline.redraw();

		var logsResult = ReactiveMethod.call('users.getUserTimelineActivity', Session.get('dateRange'), Session.get('groupOption'), Meteor.userId(), function(err, data){
			return data;
		});

		//console.log(logsResult)

		if(typeof logsResult !== 'undefined'){
			var timelineData = prepareUserActivityData(logsResult);
			
			//console.log(timelineData)
			t.data.timeline.setGroups(timelineData.groups);

			t.data.timeline.setItems(timelineData.items);

			t.data.originalItems = timelineData.items;

			t.data.logs = timelineData.logs;
		}
	});

	//Init timeline events: a combination of document binded events as well as InteractJS events
	initTimelineInteractions(t.data);

});

Template.userTimeline.helpers({
	'groupBy': function(){
		return Session.get('groupOption');
	}
});

Template.userTimeline.events({
	'click #groupSource': function(){
		Session.set('groupOption', 'source');
	},
	'click #groupActivity': function(){
		Session.set('groupOption', 'activity');
	},
	'click #toggleGroup': function(){
		var currentGroup = Session.get('groupOption');
		if(currentGroup === 'project') Session.set('groupOption', 'activity');
		else Session.set('groupOption', 'project');
	}
});