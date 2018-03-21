import { Tracker } from 'meteor/tracker';

Template.projectTimeline.onCreated(function(){
	var projectId = Router.current().params.projectId;
	var project = Projects.findOne({_id:projectId});
	Session.set('currentProject', project);
})

Template.projectTimeline.onDestroyed(function(){
	Session.set('dateRange', {
		'startDate': moment().startOf('day').toISOString(),
		'endDate': moment().endOf('day').toISOString(),
		'range': 'day',
		'verbosePeriod': 'Today',
		'altVerbosePeriod': 'Daily',
	});
});

Template.projectTimeline.onRendered(function(){
	var container = $('#projectTimeline');

	//Store timeline object in template data
	var tData = { 
		'timeline': '',
		'timelineStartDate': '',
		'timelineEndDate': '',
	};

	var t = Template.instance();
	t.data = tData;
	
	//Save newly created timeline to use in following runs
	t.data.timeline = drawSingleProjectTimeline(container);

	//***
	//Session dateRange/hash trackers
	//***
	Tracker.autorun(function (c) {
		var dateRange = Session.get('dateRange');
		var currentHash = Session.get('currentHash');
		
		if(typeof Router.current().params.projectId !== 'string' || currentHash !== 'timeline'){
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
	//Tasklists tracker
	//***
	Tracker.autorun(function (c) {


		var currentHash = Session.get('currentHash');
		var project = Session.get('currentProject');
		var tasklists = Tasklists.find({
			project: project._id
		},
		{
			sort:{
				startDate: 1
			},
		}).fetch();

		
		if(typeof Router.current().params.projectId !== 'string' || currentHash !== 'timeline'){
			console.log('kill projects timeline tracker')
			c.stop();
		}
		else{
			if(!c.firstRun){
				console.log('tasklists refresh')
				var timeline = t.data.timeline;
				
				var timelineData = prepareTimelineTasklistData(tasklists);

				console.log(timelineData.items)

				timeline.setGroups(timelineData.groups);
				timeline.setItems(timelineData.items);
				//timeline.setWindow(t.data.timelineStartDate, t.data.timelineEndDate)
				timeline.redraw()

				

			}
			//First run of the tracker
			/*else{
				//Do nothing on first run
			}*/
		}
	});
});