import { vis } from 'meteor/jorisbontje:vis';
drawDashboardTimeline = function(el, projects){
	var dateRange = Session.get('dateRange');
	var container = el[0];

	$(container).html('');//Clear timeline within element

	//Prepare data if we have any project
	var timelineData = prepareDashboardTimelineData(projects);

	// define timeline options
	var options = {
		maxHeight: 600,
		editable: {
			add: false,         // add new items by double tapping
			updateTime: false,  // drag items horizontally
			updateGroup: false, // drag items from one group to another
			remove: false       // delete an item by tapping the delete button top right
		},
		start: moment().subtract(3,'days').startOf('day'),
		end: moment().add(3,'days').endOf('day'),
		zoomMin: 1000 * 60 * 60 * 24,// * 7,
		zoomMax: 1000 * 60 * 60 * 24 * 31 * 12 * 4,
		format:{
		  minorLabels: {
		    millisecond:'SSS',
		    second:     's',
		    minute:     'HH:mm',
		    hour:       'HH:mm',
		    weekday:    'ddd D',
		    day:        'dd D',
		    month:      'MMM',
		    year:       'YYYY'
		  },
		  majorLabels: {
		    millisecond:'HH:mm:ss',
		    second:     'D MMMM HH:mm',
		    minute:     'ddd D MMMM',
		    hour:       'ddd D MMMM',
		    weekday:    'MMMM YYYY',
		    day:        'MMMM YYYY',
		    month:      'YYYY',
		    year:       ''
		  }
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
				case 'project':
					console.log('move project item')
					//dragTasklistRange(item);
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
			//var item = updateTimelineItem(item);
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
		
	};


	//Create timeline
	var timeline = new vis.Timeline(container);
	
	timeline.setOptions(options);

	//console.log(timelineData)

	timeline.setGroups(timelineData.groups);

	timeline.setItems(timelineData.items);

	return timeline;
}

prepareDashboardTimelineData = function(projects){
	var groups = new vis.DataSet();
	var items = new vis.DataSet();
	var userOffset = moment().utcOffset() / 60;

	// create a data set with groups
	if(projects.length > 0){
		for(var i = 0; i < projects.length; i++){
			if(projects[i].type !== 'personal' && projects[i].type !== 'unknown'){
				// Add group
				groups.add({
					id: projects[i]._id, 
					content: '<a href="!#" title="'+ projects[i].name +'">'+projects[i].codeName+'</a>'
						+'<span class="badge icon state '+ projects[i].state.type +'"><i class="fa '+ projects[i].state.type +'"></i></span>',
					order: i
				});

				if(typeof projects[i].deliveryDate !== 'undefined'){
					var endDate = projects[i].deliveryDate;
				}
				else{
					var endDate = moment().toDate();
				}

				// add item to group
				items.add({
					id: i,
					group: projects[i]._id,
					content: '<span class="badge icon '+ projects[i].priority.type +'"><i class="fa '+ projects[i].priority.type +'"></i></span>'
					+'<span class="badge icon state '+ projects[i].state.type +'"><i class="fa '+ projects[i].state.type +'"></i></span>'
					+'<span class="item-description"><a href="#" data-project="'+projects[i]._id+'" data-name="editProject" class="modal-trigger">'+projects[i].name+'</a></span>',
					className: 'blue',
					name: projects[i].name,
					codeName: projects[i].codeName,
					plannedTime: projects[i].plannedTime,
					priority: projects[i].priority.val,
					priorityText: projects[i].priority.type,
					state: projects[i].state.val,
					stateText: projects[i].state.type,
					start: projects[i].createDate,
					end: endDate,
					inititalStart: projects[i].startDate,
					inititalEnd: endDate,
					type: 'range',
					itemType: 'project',
					editable: true,
				});
			}
		}	
	}
	
	return {
		'groups': groups,
		'items': items,
	}

}