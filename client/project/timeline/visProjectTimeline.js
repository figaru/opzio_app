import { vis } from 'meteor/jorisbontje:vis';

drawSingleProjectTimeline = function(el){
	console.log('drawSingleProjectTimeline')
	var container = el[0];

	$(container).html('');//Clear timeline within element

	var project = Session.get('currentProject');

	if(typeof project === 'undefined'){ 
		console.log('no project found!')
		return; 
	}

	var tasklists = Tasklists.find({
		project: project._id
	},
	{
		sort:{
			startDate: 1
		},
	}).fetch();

	//Prepare data if we have any project
	var timelineData = prepareTimelineTasklistData(tasklists);

	// define timeline options
	var options = {
		editable: {
			add: true,         // add new items by double tapping
			updateTime: true,  // drag items horizontally
			updateGroup: false, // drag items from one group to another
			remove: false       // delete an item by tapping the delete button top right
		},
		
		onAdd: function (item, callback) {
			return;
			console.log('add item')
			item.content = 'New item';
			console.log(item)
			callback(item); // send back adjusted new item
		},
		//When stop dragging item (either drag or resize)
		onMove: function (item, callback) {
			
			console.log(item.itemType)

			switch(item.itemType){
				case 'event':
					console.log('drag event item')
					break;
				case 'tasklist':
					dragTasklistRange(item);
					break;
				default:
					toastr.error('Error dragging timeline item ' + item.itemType);
					break;

			}


			callback(item); // send back item as confirmation (can be changed)

			/*
			//Check if we're moving a project event (start/end date)
			if(item.id === 'project-start-date'){
				console.log('update project start date')
				callback(item); // send back item as confirmation (can be changed)
				return;
			}
			if(item.id === 'project-end-date'){
				console.log('update project end date')
				callback(item); // send back item as confirmation (can be changed)
				return;
			}
			*/

			
		},

		onUpdate: function (item, callback) {
			console.log('I\'m updated');
			var item = updateTimelineItem(item);
			callback(item); // send back adjusted item
		},

		onRemove: function (item, callback) {
			console.log('remove item')
			//callback(item); // confirm deletion
			callback(null); // cancel deletion
		},
		groupOrder: function (a, b) {
			return a.order - b.order;
		},
		zoomMin: 1000 * 60 * 60 * 24,// * 7,
		zoomMax: 1000 * 60 * 60 * 24 * 31 * 12,
	};


	//Create timeline
	var timeline = new vis.Timeline(container);
	
	timeline.setOptions(options);

	//console.log(timelineData)

	timeline.setGroups(timelineData.groups);

	timeline.setItems(timelineData.items);

	return timeline;
}

prepareTimelineTasklistData = function(tasklists){
	console.log('prepareTimelineTasklistData')
	var groups = new vis.DataSet();
	var items = new vis.DataSet();
	var userOffset = moment().utcOffset() / 60;

	var project = Session.get('currentProject');

	//Add project to groups
	groups.add({
		id: project._id, 
		content: '<h4>'+ getProjectFromID(project._id) +'</h4>',
		order: -1
	});

	// create a data set with groups
	if(tasklists.length > 0){
		for(var i = 0; i < tasklists.length; i++){

			// Add group
			groups.add({
				id: tasklists[i]._id, 
				content: '<a href="!#">'+tasklists[i].projectCodeName+'-'+tasklists[i].taskNumber+'</a>'
					+'<span class="badge icon state '+ tasklists[i].stateText +'"><i class="fa '+ tasklists[i].stateText +'"></i></span>',
				order: i
			});

			// add item to group
			items.add({
				id: i,
				group: tasklists[i]._id,
				content: '<span class="badge icon '+ tasklists[i].priorityText +'"><i class="fa '+ tasklists[i].priorityText +'"></i></span>'
				+'<span class="badge icon state '+ tasklists[i].stateText +'"><i class="fa '+ tasklists[i].stateText +'"></i></span>'
				+'<span class="item-description">'+tasklists[i].name+'</span>',
				className: 'blue',
				name: tasklists[i].name,
				codeName: tasklists[i].projectCodeName+'-'+tasklists[i].taskNumber,
				plannedTime: tasklists[i].plannedTime,
				priority: tasklists[i].priority,
				priorityText: tasklists[i].priorityText,
				state: tasklists[i].state,
				stateText: tasklists[i].stateText,
				start: tasklists[i].startDate,
				end: tasklists[i].endDate,
				inititalStart: tasklists[i].startDate,
				inititalEnd: tasklists[i].endDate,
				type: 'range',
				itemType: 'tasklist'
			});
		}	
	}

	if(typeof project.startDate !== 'undefined'){
		var startDate = project.startDate;
	}
	if(typeof project.startDate === 'undefined' && typeof project.createDate !== 'undefined'){
		var startDate = project.createDate;
	}

	//Add project duration as background item
	if(typeof startDate !== 'undefined' && typeof project.endDate !== 'undefined'){
		items.add({
			id: 'project-duration',
			//content: 'item ' + i + ' <span style="color:#97B0F8;">(<a href="!#">'+tasklists[i].name+'</a>)</span>',
			start: startDate,
			end: project.endDate,
			type: 'background'
		});
	}

	//Add relevant project events
	if(typeof project.createDate !== 'undefined'){
		items.add({
			id: 'project-start-date',
			group: project._id,
			content: '<i class="fa fa-flag-o"></i> Project start',
			start: startDate,
			itemType: 'event',
			eventType: 'date'
		});
	}
	if(typeof project.endDate !== 'undefined'){
		items.add({
			id: 'project-end-date',
			group: project._id,
			content: '<i class="fa fa-flag-checkered"></i> Project end',
			start: project.endDate,
			itemType: 'event',
			eventType: 'date'
		});
	}
	
	//Add other project events to timeline

	items.add({
		id: items.length + 1,
		group: project._id,
		content: '<i class="fa fa-calendar"></i> <a href="!#">Client meeting</a>',
		start: moment().subtract(2, 'month').toDate(),
		itemType: 'event',
		eventType: 'meeting'
	});

	items.add({
		id: items.length + 1,
		group: project._id,
		content: '<i class="fa fa-dollar"></i> <a href="!#">Adjudication</a>',
		start: moment().subtract(45, 'day').toDate(),
		itemType: 'event',
		eventType: 'financial'
	});
	
	items.add({
		id: items.length + 1,
		group: project._id,
		content: '<i class="fa fa-calendar"></i> <a href="!#">Demo meeting #1</a>',
		start: moment().subtract(5, 'day').toDate(),
		itemType: 'event',
		eventType: 'meeting'
	});
	
	return {
		'groups': groups,
		'items': items,
	}

}