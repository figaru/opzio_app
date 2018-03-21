Template.projectList.onRendered(function(){
	if(typeof Session.get('projectTimelineOrder') === 'undefined'){
		Session.set('projectTimelineOrder', {field: 'updateDate', order: -1});
	}

	Meteor.setTimeout(function(){
		$masonryEl = $('.internal-grid').masonry({
			gutter: 0,
			itemSelector: '.internal-msnry-item',
			columnWidth: '.internal-grid-sizer',
			percentPosition: true
		});
	},500);

});

Template.projectList.helpers({
	'projectList': function(){
		
		//Get user specific project listing
		if(typeof Template.instance().data.userProjects !== 'undefined'){
			var matchPipeline = {
				'$or': [
					{ 
						'owner': {
							$in: [Meteor.userId()]
						} 
					},
					{ 
						'team':{
							$elemMatch:{
								'user': Meteor.userId()
							}
						}
					},
					{
						'visibility': 2
					}
				],
				type:{
					$nin:['personal', 'unknown']
				},
				'state.val':{
					$in: [1, 2,] //3,
				}
			}
		}
		//Get all project listing
		else if(typeof Template.instance().data.allProjects !== 'undefined'){
			var matchPipeline = {
				'$or': [
					{ 
						'owner': {
							$in: [Meteor.userId()]
						} 
					},
					{ 
						'team':{
							$elemMatch:{
								'user': Meteor.userId()
							}
						}
					},
					{
						'visibility': 2
					}
				],
				type:{
					$nin:['personal', 'unknown']
				},
			}
		}
		//Get last active projects listing
		else{
			var matchPipeline = {
				//Remove after tests
				updateDate:{
					$gte: moment().subtract(7, 'days').toDate()
				},
				type:{
					$nin:['personal', 'unknown']
				},
				'state.val':{
					$in: [1, 2,] //3,
				}
			}
		}

		var order = Session.get('projectTimelineOrder');

		if(typeof order === 'undefined'){
			Session.set('projectTimelineOrder', {field: 'updateDate', order: -1});
			order = { field: 'updateDate', order: -1 };
		}
		else{
			var sortOptions = {};

			sortOptions[order.field] = order.order;

			var projects = Projects.find(
				matchPipeline,
				{
					sort: {
						updateDate: -1
					},
					limit: 50,
					reactive:false
				}
			).fetch();

			if(projects.length > 0){
				return projects;
			}
			else{
				return false;
			}
		}
	},
});

Template.projectList.events({
	'click .dropdownOpener': function(e){
		e.preventDefault();
	},
	'click .project-timeline-order': function(e){
		e.preventDefault();

		//console.log('change timeline order')

		var el = $(e.currentTarget)
		var field = el.attr('data-field');
		var order = el.attr('data-order');

		Session.set('projectTimelineOrder', {field: field, order: parseInt(order)});
	},
	'click .menu-option.state': function(e){
		e.preventDefault();
		//console.log('change project state')
		var el = $(e.currentTarget);
		var state = el.attr('data-value');
		var project = el.closest('.projectRow').attr('data-id');

		// console.log(state)
		// console.log(project)

		if(isAdmin(this.userId)){
			Meteor.call('projects.updateProjectState', project, parseInt(state), function(err, data){
				if(err){
					toastr.error('An error occurred changing project state.');
				}
			});
		}
	},
	'click .menu-option.priority': function(e){
		e.preventDefault();
		//console.log('change project priority')
		var el = $(e.currentTarget);
		var state = el.attr('data-value');
		var project = el.closest('.projectRow').attr('data-id');

		// console.log(state)
		// console.log(project)

		if(isAdmin(this.userId)){
			Meteor.call('projects.updateProjectPriority', project, state, function(err, data){
				if(err){
					toastr.error('An error occurred changing project state.');
				}
			});
		}
	},
	//Search mechanism
	'input #projectSearchInput': function(e){
		e.preventDefault();
		var $searchEl = $(e.currentTarget);
		var ogValue = $searchEl.val();
		var compValue = ogValue.toUpperCase();
		
		if(ogValue.length > 0 && ogValue !== ' ' && ogValue !== '  '){
			var $trow = $('.projectRow');

			if($trow.length > 0){
				_.each($trow, function(row, k){
					let $r = $(row);
					let projectName = $r.attr('data-projectname').toUpperCase();
					let codeName = '';
					
					if(typeof $r.attr('data-codename') !== 'undefined'){
						codeName = $r.attr('data-codename').toUpperCase();
					}

					if(projectName.includes(compValue) || codeName.includes(compValue)){
						//Highlight text match
						$('.empty-results').addClass('hidden');
						//console.log('MATCH!')
						$r.removeClass('hidden');
						$r.parent().removeClass('flatten');
						var re = new RegExp(compValue, "gi");
						var title = $r.find('.project-name').text();
						var highlighted = title.replace(re, "<span class='highlighted'>"+ogValue+"</span>");
						$r.find('.project-name').html(highlighted);
					}
					else{
						//console.log('unsure result?')
						var ogName = truncString($r.attr('data-projectname'), 20, false);
						$r.find('.project-name').text(ogName);
						$r.addClass('hidden');
						$r.parent().addClass('flatten');
					}
				});
				if($('.projectRow:not(.hidden)').length === 0){
					//console.log('no match sorry')
					//$('.empty-results .searchTerm').html('<b>'+ogValue+'</b>');
					$('.empty-results').removeClass('hidden');
				}
				//reloadMasonry();
			}
			// else{
			// 	console.log('nothing here')	
			// }
		}
		else{
			var $trow = $('.projectRow');			
			_.each($trow, function(r, k){
				var ogName = truncString($(r).attr('data-projectname'), 20, false);
				$(r).find('.project-name').text(ogName);
				$(r).removeClass('hidden');
				$(r).parent().removeClass('flatten');
			});
		}
		reloadMasonry();
		reloadInternalMasonry();
	}
});