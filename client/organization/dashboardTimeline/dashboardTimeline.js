Template.dashboardTimeline.onRendered(function(){
	//Store timeline object in template data
	var tData = { 
		'timeline': '',
		'timelineStartDate': '',
		'timelineEndDate': '',
	};

	var t = Template.instance();
	var container = t.$('#projectTimeline');

	if(typeof Session.get('projectTimelineOrder') === 'undefined'){
		Session.set('projectTimelineOrder', {field: 'createDate', order: 1});
	}

	Tracker.autorun(function(c){
		//console.log('run projectTimeline tracker')
		var currentHash = Session.get('currentHash');

		var order = Session.get('projectTimelineOrder');

		var sortOptions = {};

		sortOptions[order.field] = order.order;

		var projects = Projects.find(
			{
				type:{
					$nin:['personal', 'unknown']
				}
			},
			{
				sort: sortOptions,
			}
		).fetch();
		
		if(Router.current().route.path() !== '/dashboard'){
			//console.log('kill projectTimeline computation')
			c.stop();
		}
		else{
			if(projects.length > 0){
				t.data = tData;
				
				//Save newly created timeline to use in following runs
				t.data.timeline = drawDashboardTimeline(container, projects);
			}
			else{
				container.html('<div class="no-data"><h3>Looks you haven\'t created any project yet.</h3><h5><a href="#" data-name="addProject" class="modal-trigger btn btn-primary">Create new project</a></h5></div>');
				//console.log('there are no projects');
			}
		}
	});
});

Template.dashboardTimeline.events({
	'click .dropdownOpener': function(e){
		e.preventDefault();
	},
	'click .project-timeline-order': function(e){
		e.preventDefault();

		var el = $(e.currentTarget)
		var field = el.attr('data-field');
		var order = el.attr('data-order');

		Session.set('projectTimelineOrder', {field: field, order: parseInt(order)});
	}
});