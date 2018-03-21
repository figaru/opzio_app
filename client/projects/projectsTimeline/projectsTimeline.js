import { Tracker } from 'meteor/tracker';

Template.projectsTimeline.onDestroyed(function(){
	Session.set('dateRange', {
		'startDate': moment().startOf('day').toISOString(),
		'endDate': moment().endOf('day').toISOString(),
		'range': 'realtime',
		'verbosePeriod': 'Today',
		'altVerbosePeriod': 'Daily',
	});
})

Template.projectsTimeline.onRendered(function(){
	var container = $('#projectsTimeline');

	//Store timeline object in template data
	var tData = { 
		'timeline': '',
		'timelineStartDate': '',
		'timelineEndDate': '',
	};

	var t = Template.instance();
	t.data = tData;

	//***
	//Session dateRange tracker
	//***
	Tracker.autorun(function (c) {
		var dateRange = Session.get('dateRange');
		var currentHash = Session.get('currentHash');

		if(Router.current().route.path() !== '/projects' || currentHash !== 'timeline'){
			console.log('kill computation')
			c.stop();
		}
		else{
			if(!c.firstRun){
				var timeline = t.data.timeline;
				console.log('dateRange refresh')
				timeline.setWindow(dateRange.startDate, dateRange.endDate);
			}
			//First run of the tracker - render and keep timeline object in tempalate data
			else{
				console.log('dateRange firstRun')
				//Save newly created timeline to use in following runs
				t.data.timeline = drawProjectsTimeline(container);
				t.data.timelineStartDate = t.data.timeline.getWindow().start;
				t.data.timelineEndDate = t.data.timeline.getWindow().end;
				
				/* Bind events */
				/*
				t.data.timeline.on('update', function (properties) {
					console.log('update');
				});
				*/

				Session.set('timelineFitRange', {
					'startDate': t.data.timeline.getWindow().start,
					'endDate': t.data.timeline.getWindow().end
				});
			}
		}
	});

	//***
	//Projects dateRange tracker
	//***
	Tracker.autorun(function (c) {

		var currentHash = Session.get('currentHash');
		var projects = Projects.find({
			//'_id': 'R6raBHJ26T5Ay3yq8', //For tests only
			'startDate':{ $exists:true },
			'endDate':{ $exists:true }
		},
		{
			sort:{startDate: 1}, 
			limit: 10
		}).fetch();

		if(Router.current().route.path() !== '/projects' || currentHash !== 'timeline'){
			console.log('kill projects timeline tracker')
			c.stop();
		}
		else{
			if(!c.firstRun){
				console.log('projects refresh')
				var timeline = t.data.timeline;
				
				var timelineData = prepareTimelineData(projects);

				timeline.setGroups(timelineData.groups);
				timeline.setItems(timelineData.items);
				timeline.setWindow(t.data.timelineStartDate, t.data.timelineEndDate)

				

			}
			//First run of the tracker
			/*else{
				//Do nothing on first run
			}*/
		}
	});
});