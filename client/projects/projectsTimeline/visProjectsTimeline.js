import { vis } from 'meteor/jorisbontje:vis';

drawProjectsTimeline = function(el){
	var container = el[0];

	$(container).html('');//Clear timeline within element

	var projects = Projects.find({
		//'_id': 'R6raBHJ26T5Ay3yq8', //For tests only
		'startDate':{ $exists:true },
		'endDate':{ $exists:true }
	},
	{
		sort:{startDate: 1}, 
		limit: 10
	}).fetch();

	//Prepare data if we have any project
	var timelineData = prepareTimelineData(projects);

	// define timeline options
	var options = {
		editable: {
			add: true,         // add new items by double tapping
			updateTime: true,  // drag items horizontally
			updateGroup: false, // drag items from one group to another
			remove: false       // delete an item by tapping the delete button top right
		},
		
		onAdd: function (item, callback) {
			console.log('add item')
			item.content = 'New item';
			callback(item); // send back adjusted new item
		},
		//When stop dragging item (either drag or resize)
		onMove: function (item, callback) {
			var project = Projects.findOne({_id:item.group});
			
			var startDate = moment(item.start);
			var newStartDate = moment().date(startDate.date()).month(startDate.month()).year(startDate.year()).hour(0).minute(0).second(0).millisecond(0);
			var endDate = moment(item.end);
			var newEndDate = moment().date(endDate.date()).month(endDate.month()).year(endDate.year()).hour(0).minute(0).second(0).millisecond(0).subtract(1,'millisecond');

			if(!moment(project.startDate).isSame(newStartDate)){

				//Fix newEndDate.
				//For some reason, when dragging startDate, newStartDate goes 1 day back 
				//and endDate has the correct (same) endDate
				newEndDate = endDate;
				
				Meteor.call('saveProjectStartDate', project._id, newStartDate.startOf('day').utc().toDate(), function(err){
				    if(!err){
				        toastr.success('Set start date of <b>'+ project.name +'</b> to <b> '+ newStartDate.startOf('day').utc().format('DD/MM/YY') +'</b>, ' + moment().to(newEndDate));
				    }
				    else{
				        toastr.error('Error setting start date to <b> '+ newEndDate.format('DD/MM/YY') +'</b>, ');
				    }
				});
			}
			
			if(!moment(project.endDate).isSame(newEndDate)){
				
				Meteor.call('saveProjectEndDate', project._id, newEndDate.toDate(), function(err){
					if(!err){
					    toastr.success('Set delivery date of <b>'+ project.name +'</b> to <b> '+ newEndDate.format('DD/MM/YY') +'</b>, ' + moment().to(newEndDate));
					}
					else{
					    toastr.error('Error setting delivery date to <b> '+ newEndDate.format('DD/MM/YY') +'</b>, ');
					}
				});
			}
			

			callback(item); // send back item as confirmation (can be changed)
		},

		onUpdate: function (item, callback) {
			item.content = 'I\'m updated';
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
		zoomMin: 1000 * 60 * 60 * 24 * 7,
		zoomMax: 1000 * 60 * 60 * 24 * 31 * 12,
	};


	//Create timeline
	var timeline = new vis.Timeline(container);
	
	timeline.setOptions(options);
	timeline.setGroups(timelineData.groups);
	timeline.setItems(timelineData.items);

	return timeline;
}

prepareTimelineData = function(projects){

	var groups = new vis.DataSet();
	var items = new vis.DataSet();
	var userOffset = moment().utcOffset() / 60;

	// create a data set with groups
	if(projects.length > 0){
		for(var i = 0; i < projects.length; i++){

			// Add group
			groups.add({
				id: projects[i]._id, 
				content: '<a href="/project/'+ projects[i]._id +'#dashboard">'+projects[i].name+'</a>',
				order: i
			});

			// add item to group
			items.add({
				id: i,
				group: projects[i]._id,
				content: 'item ' + i + ' <span style="color:#97B0F8;">(<a href="/project/'+ projects[i]._id +'#dashboard">'+projects[i].name+'</a>)</span>',
				utcStart: moment(projects[i].startDate).add(userOffset, 'hours').toDate(),
				utcEnd: moment(projects[i].endDate).add(userOffset, 'hours').toDate(),
				start: projects[i].startDate,
				end: projects[i].endDate,
				type: 'range'
			});
		}	
	}
	
	return {
		'groups': groups,
		'items': items,
	}

}