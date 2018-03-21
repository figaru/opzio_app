/*
Template.userLogRow.onRendered(function(){
	console.log('render userLogRow');
})
*/

Template.userLogRow.helpers({
	'getSourceIcon': function(log){
		switch(log.type){
			case 'operative_system':
				return '<i class="fa fa-desktop"></i>';
				break;
			case 'browser':
				return '<i class="fa fa-globe"></i>';
				break;
			case 'code':
				return '<i class="fa fa-file-code-o"></i>';
				break;
			default:
				return '<i class="fa fa-question-circle-o">';
				break;
		}
	},
	'getSourceTooltip': function(log){
		
		var t = Template.instance();

		Meteor.setTimeout(function(){
			t.$('.sourceTooltip').tooltipster({
				delay: 500,
				contentAsHTML: true,
				//trigger: 'click',
				interactive: true,
			});
		},500)

		switch(log.type){
			case 'operative_system':
				if(typeof log.uri === 'undefined' || log.uri === ''){
					return '<p><b><i class="fa fa-desktop"></i> Desktop Application</b><br><br><b>Name:</b> ' + log.domain + '<br><br><b>Path:</b> N/A</p>';
				}
				else{
					var cleanedUri = log.uri.cleanProtocol();
					return '<p><b><i class="fa fa-desktop"></i> Desktop Application</b><br><br><b>Name:</b> ' + log.domain + '<br><br><b>Path:</b> '+cleanedUri+'</p>';
				}
				break;
			case 'browser':
				return '<p><b><i class="fa fa-globe"></i> Browser</b><br><br><b>Domain:</b> '+ log.domain +' <br><br><b>Path:</b> <a href="'+log.uri+'" target="_blank">'+log.uri+'</a></p>';
				break;
			case 'code':
				return '<p><b><i class="fa fa-file-code-o"></i> Code editor</b><br><br><b>Path:</b> '+log.uri+'</p>';
				break;

			default:
				return '<p><b><i class="fa fa-question-circle-o"></i> Unknown Application</b><br><br><b>Path:</b> Unknown</p>';
				break;
		}
	},
	'displayLogUri': function(log){
		if(typeof log.uri === 'undefined' || log.uri === ''){
			return log.domain;
		}
		else{
			var cleanedUri = log.uri.cleanProtocol();
			var finalUri = truncString(cleanedUri, 25, false)
			return finalUri;
		}
	},

	//For the tr data-attributes
	'isPrivateLog': function(log){
		if(log.private) return 'true';
		else return 'false';
	},
	'isTrainedLog': function(log){
		if(log.usedForTraining) return 'true';
		else return 'false';
	},
	'isClassifiedLog': function(log){
		if(log.classified) return 'true';
		else return 'false';	
	},
	'isValidatedLog': function(log){
		if(log.validated) return 'true';
		else return 'false';
	},
	//Inputs/checkboxes
	'privateLogCheckbox': function(log){
		if(log.private) return '<input checked="checked" class="privateCheckbox" type="checkbox" id="privateLog_'+ log._id +'" /><label data-action="private" for="privateLog_'+ log._id +'"></label>';
		else return '<input class="privateCheckbox" type="checkbox" id="privateLog_'+ log._id +'" /><label data-action="private" for="privateLog_'+ log._id +'"></label>';
	},
	'validatedLogCheckbox': function(log){
		if(log.classified || log.type === 'code'){
			if(log.validated) return '<input disabled checked="checked" class="validatedCheckbox filled-in" type="checkbox" id="validatedLog_'+ log._id +'" /><label data-action="validated" for="validatedLog_'+ log._id +'"></label>';
			else return '<input class="validatedCheckbox filled-in" type="checkbox" id="validatedLog_'+ log._id +'" /><label data-action="validated" for="validatedLog_'+ log._id +'"></label>';
		}
		else{
			return '<span class="load-spinner m-progress tooltipster classifyTooltip" title="<p>Log is still being classified. Come back in a couple of minutes to be able to change it.</p>"></span>';
		}
		
	},
	'getUrl': function(log){
		if(typeof log.uri === 'undefined' || log.uri === ''){
			return log.domain;
		}
		else{
			return log.uri
		}
	},
	'getProjectId': function(log){
		if(log.project !== ''){
			return log.project._id;
		}
		else{
			var project = Projects.findOne({
				type: 'personal',
				owner:{
					$in:[ Meteor.userId() ]
				}
			});
			return project._id;
		}
	},
	'getProjectName': function(log){
		if(log.project !== ''){
			return log.project.name;
		}
		else{
			var project = Projects.findOne({
				type: 'personal',
				owner:{
					$in:[ Meteor.userId() ]
				}
			});
			return project.name;
		}
	},
	'getProjectGitName': function(log){
		if(typeof log.project.heartbeatName !== 'undefined'){
			return log.project.heartbeatName;
		}
		else{			
			return log.project.name;
		}
	},
	'categorySelectInput': function(log){
		if(log.classified || log.type === 'code'){
			if(typeof log.category !== 'undefined'){
				return '<input type="text" name="categoryInput" class="demo-default selectized categoryInput" value="'+ this.category.label +'" data-selected="'+ this.category._id +'">'
			}
			else{
				var category = DomainCategories.findOne({
					_id: 'JJMh9XbDXSXXHqF5X'
				});
				return '<input type="text" name="categoryInput" class="demo-default selectized categoryInput" value="'+ category.label +'" data-selected="'+ category._id +'">'
			}
		}
		else{
			return '<span class="load-spinner m-progress tooltipster classifyTooltip" title="<p>Log is still being classified. Come back in a couple of minutes to be able to change it.</p>"></span>';
		}
	},
	'projectSelectInput': function(log){
		if(log.classified || log.type === 'code'){

			if(typeof log.project._id !== 'undefined' && log.project.name !== null){
				var project = log.project;
			}
			else{
				var project = Projects.findOne({
					type: 'personal',
					owner:{
						$in:[ Meteor.userId() ]
					}
				});
			}


			if(project['matchType'] === 'no_system_project'){
				
				Meteor.setTimeout(function(){
					$('.classificationTooltip').tooltipster({
						delay: 500,
						contentAsHTML: true,
						//trigger: 'click',
						interactive: true,
					});
				},500);

				return '<i class="fa fa-info-circle classificationTooltip" title="<p>It looks you\'re working on a project within a folder or repository named '+ project.heartbeatName +' but you haven\'t set that repository to any project.<br>You can do so in any projects\' settings page.</p>"></i><input type="text" name="systemProjectMatches" class="demo-default selectized systemProjectMatches" value="'+ project.name +'" data-selected="'+ project._id +'">';
			}
			else{
				return '<input type="text" name="systemProjectMatches" class="demo-default selectized systemProjectMatches" value="'+ project.name +'" data-selected="'+ project._id +'">';
			}
		}
		else{
			return '<span class="load-spinner m-progress tooltipster classifyTooltip" title="<p>Log is still being classified. Come back in a couple of minutes to be able to change it.</p>"></span>';
		}
	}
});

Template.userLogRow.events({
	//	SELECT ROW CHECKBOX
	'click tr .selectCheckbox': function(e, t){
		//console.log(e.currentTarget)
		
		if($(e.currentTarget).prop('checked')){
			$(e.currentTarget).closest('tr').addClass('selected');
		}
		else{
			$(e.currentTarget).closest('tr').removeClass('selected');	
		}

		var selectedLogs = $('tr.selected');
		Session.set('selectedLogs', selectedLogs.length);
	},
	//************
	//	PROJECT SELECTIZE DROPDOWN SELECT
	//************
	'change .systemProjectMatches': function(e){
		console.log('change systemProjectMatches');

		let tr = $(e.currentTarget).closest('tr');
		var originalProjectId = tr.attr('data-projectid');
		var originalProjectName = tr.attr('data-projectname');
		var selectizeEl = $(e.currentTarget).data('selectize');
		
		if(typeof selectizeEl !== 'undefined'){
			var item = selectizeEl.$control[0].getElementsByClassName('item');
			
			if(typeof item === 'undefined'){
				$(e.currentTarget).val(originalProjectName);
				selectizeEl.setValue(originalProjectId, true);
				return;
			}
		}
		else return;


		

		//console.log('originalProjectId ' + originalProjectId)
		//console.log('originalProjectName ' + originalProjectName)
		
		//var currentlySelected = $(e.currentTarget).data('selectize').$input[0].getAttribute('data-selected');

		if($(e.currentTarget).data('selectize').$control[0].getElementsByClassName('item').length > 0){
			var selectProjectId = $(e.currentTarget).data('selectize').$control[0].getElementsByClassName('item')[0].getAttribute('data-value');

			//console.log('selectProjectId ' + selectProjectId);

			if(selectProjectId !== originalProjectId && selectProjectId !== originalProjectName){
				//console.log('change project classification');

				updateRowUnsavedChanges(tr, 'push', 'project');
			}
			else{
				updateRowUnsavedChanges(tr, 'pull', 'project');
			}
		}
	},
	//PROJECT SELECTIZE BLUR on empty value
	'blur .systemProjectMatches': function(e, t){
		var el = $(e.currentTarget);
		var item = el.find('.item');
		
		if(item.length === 0){
			let tr = $(e.currentTarget).closest('tr');
			var originalProjectName = tr.attr('data-projectname');
			t.$('.systemProjectMatches').data('selectize').setValue(originalProjectName, true);

			updateRowUnsavedChanges(tr, 'pull', 'project');
		}
	},
	//************
	//	CATEGORY SELECTIZE DROPDOWN SELECT
	//************
	'change .categoryInput': function(e){
		console.log('change categoryInput');

		let tr = $(e.currentTarget).closest('tr');
		var originalCategoryId = tr.attr('data-categoryid');
		var originalCategoryName = tr.attr('data-categorylabel');
		
		var item = $(e.currentTarget).data('selectize').$control[0].getElementsByClassName('item');

		if(typeof item === 'undefined'){
			$(e.currentTarget).val(originalCategoryName)
			$(e.currentTarget).data('selectize').setValue(originalCategoryId, true)
			return;
		}
		
		var currentlySelected = $(e.currentTarget).data('selectize').$input[0].getAttribute('data-selected');

		if($(e.currentTarget).data('selectize').$control[0].getElementsByClassName('item').length > 0){
			var selectCategoryId = $(e.currentTarget).data('selectize').$control[0].getElementsByClassName('item')[0].getAttribute('data-value');

			console.log('selectCategoryId ' + selectCategoryId);

			if(selectCategoryId !== originalCategoryId && selectCategoryId !== originalCategoryName){
				console.log('change category classification');

				updateRowUnsavedChanges(tr, 'push', 'category');
			}
			else{
				updateRowUnsavedChanges(tr, 'pull', 'category');
			}
		}
	},
	//CATEGORY SELECTIZE BLUR on empty value
	'blur .categoryInput': function(e, t){
		var el = $(e.currentTarget);
		var item = el.find('.item');
		
		if(item.length === 0){
			var originalCategoryLabel = el.closest('tr').attr('data-categorylabel');
			t.$('.categoryInput').data('selectize').setValue(originalCategoryLabel, true)
		}
	},
	//********
	//	VALIDATE INPUT CHECKBOX
	// 	On validate, disable both projects selectize and validation checkbox
	//********
	'click tr .validatedCheckbox': function(e){
		console.log('click validatedCheckbox');
		var el = $(e.currentTarget);
		var updateData = {};

		var tr = el.closest('tr');
		var selectInput = tr.find('.systemProjectMatches');
		
		el.attr('disabled', true);

		var selectizeEl = selectInput.data('selectize');
		selectizeEl.destroy();

		var selectedProjectId = selectizeEl.$input[0].value;
		var selectedProjectName = selectizeEl.$control[0].innerText;

		console.log('selectedProjectId: ' + selectedProjectId);
		console.log('selectedProjectName: ' + selectedProjectName);

		//When user hasn't changed the selected project, the value and innerText are the same (the project name)
		//so we must get the project id through the tr element
		if(selectedProjectId === selectedProjectName){
			updateData['project'] = tr.attr('data-projectid');
		}
		//Otherwise use the value of the input (the project Id)
		else{
			updateData['project'] = selectedProjectId;
		}

		selectInput.val(selectedProjectName);
		selectInput.attr('data-selected', selectedProjectId);
		selectInput.attr('disabled', true);
		
		tr.removeClass('hasUnsavedChanges').find('.hasUnsavedChanges').html('');
		tr.attr('data-unsavedchanges', '[]');
		tr.attr('data-validated', true);

		updateData['logId'] = tr.attr('id');

		Meteor.call('updateLogProject', updateData, function(err, data){
			if(err){
				toastr.error('System error validating log');
			}
			else{
				_updateValidatedTime();
			}
		});
	},

	'click tr .privateCheckbox': function(e){
		var el = $(e.currentTarget);
		var tr = el.closest('tr');

		if(el.prop('checked')){
			//console.log('set as private');
			Meteor.call('userLogs.updatePrivacy', tr.attr('id'), true);
		}
		else{
			//console.log('set as public');
			Meteor.call('userLogs.updatePrivacy', tr.attr('id'), false);
		}

	},

	//Row Actions
	'click .rowAction': function(e){
		e.preventDefault();
		var el = $(e.currentTarget);
		var action =el.attr('data-action');
		var tr = el.closest('tr');

		//console.log(action)
		
		switch(action){
			case 'save':
				if(!el.hasClass('disabled')){
					if(!tr.hasClass('hasUnsavedChanges')){
						toastr.warning('No changes to save.');
						return;
					}
					
					saveRowChanges(tr);

					_updateValidatedTime();
				}
				break;

			case 'deleteLog':
				Meteor.call('userLogs.remove', tr.attr('id'), function(err, data){
					if(err){
						toastr.error('There was an error deleting this log.')
					}
					else{
						tr.remove();
					}
				})
				break;

			case 'setRule':
				//Open rules modal for given log attributes (domain, url, pageTitle)
				var modal = $('#domainRulesModal');
				
				var rulesArea = modal.find('#domainRules');
				var subHeader = modal.find('#ruleData');

				modal.find('.modal-action').removeClass('m-progress');
				subHeader.html('');




				//Get domain rules for related with this userLog
				let queryData = {
					'domain': tr.attr('data-domain'),
					'uri': tr.attr('data-url'),
					'pageTitle': tr.attr('data-title')
				}
				
				console.log('gettting rules..');

				//Add some data attributes to modal for use
				modal.attr({
					'data-domain': queryData['domain'],
					'data-uri': queryData['uri'],
					'data-pagetitle': queryData['pageTitle']
				});

				//Set string showing current log data
				subHeader.html('<span>For: <b>'+ queryData['pageTitle'] +' </b> - <em>'+ queryData['uri'] +'</em></span>');

				rulesArea.html('<div class="loader-overlay boxed stats" style="margin-top:100px;"><p class="align-right" style="display:inline-block;"><br><br>Loading rules..</p><div class="chart-loader" style="position:relative;margin:0 15px 0 20px;top:0;"></div></div>');

				if(process.env.NODE_ENV === 'production'){
					try{
						Tawk_API.hideWidget();
					}
					catch(err){
						console.log('Extension may be blocking social/analytics tools');
					}
				}

				modal.modal('show',{
					keyboard: true,
					backdrop: true,
				});
				
				Meteor.call('domains.getDomainRules', queryData, function(err, existingRules){
					//Populate modal if no errors
					if(!err){

						if(existingRules.length > 0){
							_buildRulesList(existingRules, rulesArea);
						}
						else{
							if(tr.attr('data-type') === 'code'){


								if(tr.attr('data-classified') === true){
									var project = Projects.findOne({
										_id: tr.attr('data-projectid')
									});

									//console.log('project')
									//console.log(project)

									if(typeof project !== 'undefined'){
										rulesArea.html('<div class="tab-wrapper ruleRow">'
											+'File was classified using the GIT repository name '
											+'<div class="dropdown modal-control rule-dropdown">'
												+'<button class="btn btn-default form-control dropdown-toggle matchMenu validateDropdown" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'
											  	+ '<span class="submenu-title">'+ project.gitName +' </span>'
											  +'</button>'
											+'</div>'
										+'</div>');
									}
								}
								else{
									rulesArea.html('<div class="tab-wrapper ruleRow">'
										+'File was classified as Personal as no project was found with repository name of'
										+'<div class="dropdown modal-control rule-dropdown">'
											+'<button class="btn btn-default form-control dropdown-toggle matchMenu validateDropdown" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'
										  	+ '<span class="submenu-title">'+ tr.attr('data-projectgitname') +' </span>'
										  +'</button>'
										+'</div>'
									+'</div>');
								}

							}
							else{
								rulesArea.html('<h3>No rules found based on this log data.</h3>');
							}
						}
					}
					else{
						toastr.error('There was an error retrieving your rules for this domain.')
					}
				});
				
				modal.on('hide.bs.modal', function(){
					$(this).find('form')[0].reset();
					
					rulesArea.html('');

					var toasts = $(document).find('.toast');
					if(typeof toasts !== 'undefined'){ toasts.remove(); }
				});
				break;
		}
	}
});