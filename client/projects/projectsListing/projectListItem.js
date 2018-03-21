Template.projectListItem.onRendered(function(){
	var t = Template.instance();
	var tr = t.$('.projectRow');

	var project = Projects.findOne({_id: tr.attr('data-id') })
	var selectorString = '#projectChart_' + project._id;
	

	var chartArea = t.$(selectorString);

	var options = {
		'el': chartArea,
		'detail': 'all',
		'startDate': moment().endOf('day').subtract(7, 'days').toISOString(),
		'endDate': moment().endOf('day').toISOString(),
		'range': 'week',
		'dataContext': 'project',
	}

	var chart = new NewChart([], options);

	var callData = {
		'projectId': project._id,
		'startDate': options.startDate,
		'endDate': options.endDate,
		'range': 'week',
		'offset': moment().utcOffset() / 60,
	}

	chartArea.before('<div class="loader-overlay boxed stats height-100"><div class="chart-loader"></div>'); //Insert loader

	Meteor.call('getProjectActivity', callData, function(err, data){
		if(!err){
			//console.log('for ' + getProjectFromID(project._id))
			
			var chartOptions = {
				'el': chartArea,
				'projectId': project._id
			}
			//console.log('--------------');
			chart.drawSimpleAreaChart(chartOptions, data);

			if(data.length === 0){
				chartArea.parent().addClass('emptyChart')
			}
		}
		else{
			toastr.error('Error getting activity data for project ' + getProjectFromID(project._id));
		}
	});

	//Progress bar
	//console.log(project);

	var tooltipContent = '';

	
	//console.log(project);

	t.$('.projectTotal').removeClass('grey-text font-weight-light').text(getStringFromEpoch(project.totalTime, true));

	//Check for project completion time
	/*
	Meteor.call('projects.getProjectTotalTime', project._id, function(err, data){
		if(!err){
			
			//If there's data for project (total time in this case)
			if(typeof data !== 'undefined'){
				console.log('for ' + project.name + ' ' + getStringFromEpoch(data.totalTime, true))

				t.$('.projectTotal').removeClass('grey-text font-weight-light').text(getStringFromEpoch(data.totalTime, true));

				if(project.plannedTime > 0){
					//Get planned time in seconds
					var plannedTimeSeconds = project.plannedTime * 3600;
					var completionPercent = data.totalTime * 100 / plannedTimeSeconds;

					tooltipContent += '<p>Worked <b>'+ getStringFromEpoch(data.totalTime, true) +' ('+ Math.round(completionPercent) +'%)</b> out of <b>'+ project.plannedTime +' planned hours</b></p>';
					
					console.log('completionPercent = ' + Math.round(completionPercent));
					
					t.$('.completion').animate({
						width: completionPercent+'%',
					}, 2000);
				}
			}
			else{
				if(project.plannedTime > 0){
					tooltipContent += '<h6>Worked <b>0h (0%)</b> out of <b>'+ project.plannedTime +' planned hours</b></h6>';
					t.$('.completion').addClass('empty');
				}
				else{
					tooltipContent += '<h6>Worked <b>0h (0%)</b> out of <b>0 planned hours</b></h6>';
					t.$('.completion').addClass('empty');
				}
			}
		}
		else{
			toastr.error('Error retrieving total time for ' + project.name);
		}
		console.log('-------------------')
	});
	*/

	//Check remaining time for delivery
	if(typeof project.deliveryDate !== 'undefined' && project.deliveryDate !== null){

		var now = moment();
		
		//Get delivery date to show how long there's left until now and delivery date
		var deliveryDate = moment(project.deliveryDate);
		var difFromNow = deliveryDate.diff(now, 'days');

		t.$('.projectDelivery').removeClass('grey-text font-weight-light').text(deliveryDate.format("DD MMM"));

		//Try to get create date to show progress bar regarding start date
		var createDate = moment(project.createDate);
		if(typeof createDate !== 'undefined'){
			
			var difFromStart = deliveryDate.diff(createDate, 'days');
			var percent = Math.round(difFromNow * 100 / difFromStart);
			
			tr.find('.remaining').animate({
				width: percent+'%',
			}, 2000);
		}
		


		

		// console.log('difFromNow: ' + difFromNow)
		// console.log('difFromStart: ' + difFromStart)

		if(difFromNow > 0){
			tooltipContent += '<h6>Delivery on <b>'+ deliveryDate.format("DD MMM \'YY") +'</b> ('+ difFromNow +' days to go)</h6>';
		}
		else{
			tr.find('.remaining').addClass('very-high');

			tooltipContent += '<h6>Delivery on <b>'+ deliveryDate.format("DD MMM \'YY") +'</b> (<i class="fa fa-warning"></i> '+ Math.abs(parseInt(difFromNow)) +' days behind)</h6>';
			
			//tr.find('.remaining .bar-tooltip .content').html('<b>'+Math.abs(parseInt(difFromNow))+' days overdue</b> <i class="fa fa-warning"></i>');

			tr.find('.remaining').animate({
				width: '100%',
			}, 2000);

			//tooltipContent = '<b>'+Math.abs(parseInt(difFromNow))+' days overdue</b> <i class="fa fa-warning"></i>';
		}
	}
	else{
		tr.find('.remaining .bar-tooltip').addClass('empty').find('.content').html('<i class="fa fa-calendar"></i> No delivery date');
		tooltipContent += '<h6>No delivery date specified.</h6>';
		t.$('.remaining').addClass('empty');
	}

	var el = t.$('.column-tooltip');

	el.tooltipster({
		contentAsHTML: true,
		delay: 500,
		content: tooltipContent,
		side: 'bottom'
	});

});