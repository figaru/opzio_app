Template.projectModal.onRendered(function(){

	//Init datepickers
	var startDatepicker = $('#projectStartDate').datepicker({
		format: 'dd/mm/yyyy',
		todayHighlight: true,
		autoclose: true,
		weekStart: 1,
		daysOfWeekHighlighted: [0,6],
	});
	var endDatepicker = $('#projectEndDate').datepicker({
		format: 'dd/mm/yyyy',
		todayHighlight: true,
		autoclose: true,
		weekStart: 1,
		daysOfWeekHighlighted: [0,6]
	});

	//When changing startDate value, set it as the minimum start date for endDate
	startDatepicker.on('changeDate', function(){
		endDatepicker.datepicker('setStartDate', startDatepicker.datepicker('getDate'));
	});

	startDatepicker.on('hide', function(){ new MaterialLabel(); });

	endDatepicker.on('hide', function(){ new MaterialLabel(); });

	//Team selectize initialization
	$('#teamSelect').closest('.form-group').addClass('force-focused-alt');
	Meteor.setTimeout(function(){
		var organizationTeam = Meteor.users.find().fetch();
		var teamOptions = [];
		var owner;

		for(var i=0; i<organizationTeam.length;i++){
			teamOptions.push({
				name: getUserInitials(organizationTeam[i]),
				text: getUserFullName(organizationTeam[i]),
				value: organizationTeam[i]._id
			});
			if(organizationTeam[i]._id === Meteor.userId()){
				owner = {
					name: getUserInitials(organizationTeam[i]),
					text: getUserFullName(organizationTeam[i]),
					value: organizationTeam[i]._id
				}
			}
		}

		var $team = $('#teamSelect').selectize({
		    delimiter: ',',
		    plugins: ['remove_button'],
		    persist: false,
		    create: false,
		    options: teamOptions,
		    render: {
	            item: function(item) {
	            	let color = getRandColor();
	            	//console.log(color)
	                return '<div class="member" style="background-color:'+color+';">' 
	                	+'<span class="name" title="'+item.text+'">' + item.name + '</span>'
	                +'</div>';
	            },
	        },
		});
		
		var selectEl = $team[0].selectize;

		//Set initial default user (the one creating the project)
		selectEl.setValue(Meteor.userId());

		selectEl.on('change', function(items){
			//Reset team to owner if user removed all users. Must have at least one user  
			if(items.length === 0){
				selectEl.setValue(Meteor.userId());
				toastr.error('Team must be have least one member.', 'Empty team');
			}
		});


	},1000);
});

Template.projectModal.events({
	//**************
	//	PROJECT FORM SUBMISSION
	//**************
	'click .modal-primary-action': function(e){
		e.preventDefault();

		var submitEl = $(e.currentTarget);

		if(submitEl.is(':disabled')) return;

		var failedFields = false;

		//--- Validate form ---
		var form = Template.instance().$('#newProjectForm');
		var modal = form.closest('.modal');

		//Text data
		var projectName = form.find('#projectName');
		var projectCode = form.find('#projectCode');
		var projectBrief = form.find('#projectBrief');

		//Dates
		var startDateInput = form.find('#projectStartDate');
		var endDateInput = form.find('#projectEndDate');

		//Privacy/visibility
		var visibility = modal.find('#projectVisibilityMenu').attr('data-value');

		var stateEl = modal.find('.projectState');
		var stateText = stateEl.attr('data-state');
		var stateVal = stateEl.attr('data-value');
		if(typeof stateVal === 'undefined' || typeof parseInt(stateVal) !== 'number'){
			failedFields = true;
			//submitEl.attr('disabled', true);
			stateEl.addClass('error');
		}

		//Priority
		var priorityEl = modal.find('.priorityMenu');
		var priorityText = priorityEl.attr('data-priority');
		var priorityVal = priorityEl.attr('data-value');
		if(typeof priorityVal === 'undefined' || typeof parseInt(priorityVal) !== 'number'){
			failedFields = true;
			//submitEl.attr('disabled', true);
			priorityEl.addClass('error');
		}

		//Team
		var teamSelect = $('#teamSelect');
		var finalTeam = [];
		if(typeof teamSelect.val().match(',') !== null){
			var teamMembers = teamSelect.val().split(',');
			_.each(teamMembers, function(member, k){
				finalTeam.push({
					user: member,
					role: 'member'
				});
			})
		}
		else{
			finalTeam.push({
				user: teamSelect.val(),
				role: 'member'
			});
		}

		if(finalTeam.length === 0){
			toastr.error('Team must be have least one member.', 'Empty team');
			failedFields = true;
			submitEl.attr('disabled', true);
			return;
		}

		if(startDateInput.val().length > 0){
			console.log('A')
			var dateObj = startDateInput.val().split('/');
			var startDate = moment().date(dateObj[0]).month(dateObj[1]).year(dateObj[2]).startOf('day').toDate();
		}
		else
			var startDate;

		if(endDateInput.val().length > 0){
			var dateObj = endDateInput.val().split('/');
			var endDate = moment().date(dateObj[0]).month(dateObj[1]).year(dateObj[2]).startOf('day').toDate();
		}
		else
			var endDate;


		//##### VALIDATE FIELDS
		if(projectName.val().length === 0){
			failedFields = true;
			projectName.addClass('error');
			//submitEl.attr('disabled', true);
		}

		//Check for errors
		if(failedFields){
			toastr.error('Please correct the fields with errors', 'Invalid fields');
		}
		//Dispatch updates if no fields failed
		else{
			$('.form-control').removeClass('error');
			
			submitEl.removeAttr('disabled');

			var newData = {
				name: projectName.val(),
				codeName: projectCode.val(),
				startDate: startDate,
				endDate: endDate,
				owner: [Meteor.userId()],
				team: finalTeam,
				brief: projectBrief.val(),
				plannedTime: 0,
				priority: parseInt(priorityVal),
				priorityText: priorityText,
				state: parseInt(stateVal),
				stateText: stateText,
				visibility: parseInt(visibility),
				budgetType: undefined,
				hourValue: 0,
				applyHourValuePerTeam: false,
				budget: 0,
				useForCategorization: true,
				gitName: '',
				matchWords: [],
				excludeWords: [],
			}

			Meteor.call('createNewProject', newData, function(err, data){
				if(!err){
					toastr.success('<i class="fa fa-check-circle-o text-success"></i>&nbsp;&nbsp;Project <a href="/project/'+data+'/dashboard" class=""><u>' + projectName.val() + '</u></a> created. <div class="toast-actions"><button class="toast-close-button close" type="button" aria-label="Close"><span aria-hidden="true">&times;</span></button><a href="/project/'+data+'/finance" class="btn btn-sm btn-link pull-right">Setup budget</a></div>');					
					$('#projectModal').modal('hide');
					resetProjectModal();
				}
				else{
					console.log(err)
					toastr.error(err.reason);	
				}
			})
		}

	},

	'input #projectName': function(e){
		e.preventDefault();
		
		var form = Template.instance().$('#newProjectForm');
		var projectCode = form.find('#projectCode');

		if(e.currentTarget.value.length >= 3){
			if(typeof projectCode.attr('data-customcode') === 'undefined'){
				Meteor.call('minifyProjectName', e.currentTarget.value, function(err, data){
					//console.log(data)
					if(!err){
						if(!data.duplicate){
							form.find('#projectCode').val(data.codeName).attr('data-codename', data.codeName)
							form.find('#projectCode').closest('.form-group').addClass('force-focused-alt');
						}
					}
				});
			}
		}
		else{
			projectCode.val('').removeAttr('data-codename data-customcode');
			projectCode.closest('.form-group').removeClass('force-focused-alt focused');
		}
	},
	'input #projectCode': function(e){
		e.preventDefault();
		if(e.currentTarget.value.length > 0){
			Meteor.call('project.checkDuplicateCode', e.currentTarget.value, function(err, data){
				if(data){
					toastr.error('Code name has been taken, please choose another one.')
				}
				else{
					$(e.currentTarget).attr('data-customcode', true);
				}
			});
		}
	},
	'blur #projectCode': function(e){
		if(e.currentTarget.value.length === 0){
			$(e.currentTarget).closest('.form-group').removeClass('focused force-focused-alt');
			$(e.currentTarget).removeAttr('data-codename data-customcode');
		}
	}
});