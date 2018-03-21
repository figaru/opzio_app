Template.userTimesheet.onRendered(function(){

	//initMasonry();

	if(process.env.NODE_ENV === 'production'){
		try{
			Tawk_API.hideWidget();
		}
		catch(err){}
	}

	if(typeof Session.get('groupOptions') === 'undefined'){
		Session.set('groupOptions', 'source');
	}

	/*######
		Scroll event to fix panel-headers
	######*/
	Meteor.setTimeout(function(){
		$(document).on('scroll', function(){
			var scrollPos = $(document).scrollTop() + 50;
			setFixedHeader(scrollPos);
			if(scrollPos > 60){
				/*
				$('#userLogFilters').addClass('fixed');
				_.each($('#userLogFilters .dropdown'), function(el, k){
					$(el).addClass('dropup');
				});
				*/
				$('body').css({'margin-bottom':'60px'});
				reloadMasonry();
			}
			else{
				/*
				$('#userLogFilters').removeClass('fixed');
				_.each($('#userLogFilters .dropdown'), function(el, k){
					$(el).removeClass('dropup');
				});
				*/
				$('body').css({'margin-bottom':'0'});
				reloadMasonry();
			}
		});
	},1500)

	/*######
		Remove panel-header fix on panel collapse
	######*/
	$('.collapse-panel').click(function(){
		$(window).scrollTop($(document).scrollTop()+1);
		var scrollPos = $(document).scrollTop() + 50;
		setFixedHeader(scrollPos);
	});

	/*######
		KEYBOARD EVENTS
	######*/
	$(document).on('keydown, keyup', function(e){
		e.preventDefault();
		var activeEl = $(document.activeElement);
		//console.log(e.keyCode)
		switch(e.keyCode){
			case 37: //Left Arrow - search
				/* Avoids changin period in case we're focusing and input */
				if(activeEl[0].nodeName === 'BODY'){ 
					var dateRange = Session.get('dateRange');
					goToPrevRange(dateRange);
				}
				break;
			case 39: //Right Arrow - search
				if(activeEl[0].nodeName === 'BODY'){ 
					var dateRange = Session.get('dateRange');
					goToNextRange(dateRange);
				}
				break;
		}
	});


});
/**
	END ON RENDERED
**/


Template.userTimesheet.helpers({
	'userLogs': function(){
		//Reset selected logs to 0
		Session.set('selectedLogs', 0);

		$(document).scrollTop(0);

		$('#hourLogsArea').append('<div class="page-overlay"><img class="bot-loader" src="data:image/png;base64,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AhERURCKiIgoCEVERBSEIiIiCkIREREFoYiIiIJQREREQSgiIqIgFBERURCKiIgoCEVERBSEIiIiCkIREREFoYiIiIJQRKRlWdoeURAKgAk/RDotBBPqk0WNLgAOkFQzSAcGYdSOe/XJanRZxg5Bq9FLJx73GooUBaEcpKFREVEQioiIKAhFREQUhCIiIgpCERERBaGIiIiCUEREREEoIiKiIBQREVEQioiIKAhFREQUhCIiIgpCERERBaGIiIiCUEREREEoIiKiIBQREVEQioiIKAhFREQUhCIiIgpCERERBaGIiIiCUEREREEoIiKiIBQREVEQioiIKAhFREQUhCIiIgpCERERBaGIiIiCUEREREEoIiKiIBQREVEQioiIKAhFREQUhCIiIgpCERERBaGIyCIZoBDBbRIFoYjIkvCB2YhtU1m7RUEoItLpVaooCGWZrkJn1QwioiAUERFREIqIiCgIRUREFIQiIiIKQhEREQWhiIiIglBERERBKCIioiAUERFREIqIiCgIRUREFIQiIiIKQhEREQWhiIiIglBERERBKCIioiAUERFREIqIiCgIRUREFIQiIiIKQhEREQWhiIiIglBERERBKCIioiAUERFREIqIiCgIRUREFIQiIiIKQhEREQWhiIiIglBERERBKCIioiAUERFREIqIiCgIRUREFIQiIiIKQhEREQWhiIiIglBERERBKCIioiAUERFREIqIiCgIRUREFIQiIiIKwuixIrQtRrtDdB6KglCWWjFCAWSAgnaJdBgTnodRUtZuURB2ktEIbUsBmNAukQ5TBsYitD05YFa7RUHYSR6MUEWYA3Zrl0iHKQE7I3ZxrAtSBWFH+X2EtmUKuFe7RDpMDrgzYhfH+7RbFISd5HrAj8i2jAO3aJdIJ8lms4WIXZCOAA9ozygIO+kkvB+4i2gMj96dzWb3aq9Ip9iwYUPl053AHRHZrNuy2ewu7R0FYaedhP/B8k/f3gN8f852ibT7hWjl03Hg6xHYpG3AsM5DBWEnnoRXsfz3BO4BvjNnu0Q65VycBn5AcJ98Of0I+K3OQwVhx1WF4TCIt4ybMQ58LZvNTuoqVDrxHAxtBb6wjJvyEPCDbDY7rr2iIOxUnwK2LNPvvg74knaBdGg1WPlzCriS5Zs5/VXgp3PCWRSEnXEShlXhPuCtwPQSb8II8MFsNjsb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" alt=""></div>');

		var userId = Router.current().params.userId;
		if(typeof userId === 'undefined' || userId === ''){ userId = Meteor.userId(); }

		var dateRange = Session.get('dateRange');
		var groupOptions = Session.get('groupOptions');
		var userLogs = ReactiveMethod.call('users.getUserHourLogs', dateRange, groupOptions, userId);
		

		if(typeof userLogs !== 'undefined'){
			$('#hourLogsArea').find('.page-overlay').remove();
		}

		//console.log(userLogs)

		return userLogs;
	},

	'dailyValidationBadge': function(){
		//We just get changedLogValidation to retrigger helper when user changes validation of log entries
		var react = Session.get('changedLogValidation');
		
		var userId = Router.current().params.userId;
		if(typeof userId === 'undefined' || userId === ''){ userId = Meteor.userId(); }

		var dateRange = Session.get('dateRange');

		var validationStats = ReactiveMethod.call('users.getDailyValidation', dateRange, userId);

		//console.log(validationStats);

		if(typeof validationStats !== 'undefined'){
			if(validationStats.length > 0){
				validationStats = validationStats[0];

				if(validationStats.totalTime > 0){
					var badgeClass = getBadgeStateClass(validationStats.validCount, validationStats.totalCount);
					if(badgeClass === 'very-complete'){
						Session.set('dailyValidQuota', true);
						Meteor.setTimeout(function(){
							
							$('.icon-tooltip').addClass('anim-shake');

							$('.icon-tooltip').tooltipster({
								delay: 500,
								contentAsHTML: true,
								//trigger: 'click',
								interactive: true,
							});

						},1000);
						return '<span class="stat '+ badgeClass +'">'+ getStringFromEpoch(validationStats.validTime, true) + '/' + getStringFromEpoch(validationStats.totalTime, true)+ '</span><i class="twa twa-tada twa-2x tooltipster icon-tooltip tooltipstered" title="<p>Most of your time is valid for the day</p>"></i>';
					}
					else{
						Session.set('dailyValidQuota', false);
						return '<span class="stat '+ badgeClass +'">'+ getStringFromEpoch(validationStats.validTime, true) + '/' + getStringFromEpoch(validationStats.totalTime, true)+ '</span>';
					}
				}
			}

		}
	}
});
//*****
//	Handles the whole day log selections and actions
//******
Template.userTimesheet.events({
	//*******
	//	EMPTY TIMESHEET
	//*******
	//Previous day
	'click .prev': function(e){
		e.preventDefault();
		var dateRange = Session.get('dateRange');
		goToPrevRange(dateRange);		
	},
	//Next day
	'click .next': function(e){
		e.preventDefault();
		var dateRange = Session.get('dateRange');
		goToNextRange(dateRange);
	},
	//*******
	//	TIMESHEET BLUK SELECT
	//*******
	'click .bulkSelect': function(e, t){
		var action = e.currentTarget.getAttribute('data-action');
		console.log(action);

		switch(action){
			case 'selectAll':
				var checkboxes = t.findAll('tr:not(.hidden) .selectCheckbox');
				if(checkboxes.length > 0){
					_.each(checkboxes, function(el, k){
						$(el).prop('checked', true);
						$(el).closest('tr').addClass('selected');
					});
				}
				else{
					toastr.warning('', 'No logs found.')
				}
				break;

			case 'selectNone':
				var checkboxes = t.findAll('tr:not(.hidden) .selectCheckbox');
				if(checkboxes.length > 0){
					_.each(checkboxes, function(el, k){
						$(el).prop('checked', false);
						$(el).closest('tr').removeClass('selected');
					});
				}
				else{
					toastr.warning('', 'No logs found.')
				}
				break;

			case 'selectAllPublic':
				var checkboxes = t.findAll('tr:not(.hidden)[data-private="false"] .selectCheckbox');
				if(checkboxes.length > 0){
					_.each(checkboxes, function(el, k){
						$(el).prop('checked', true);
						$(el).closest('tr').addClass('selected');
					});
				}
				else{
					toastr.warning('', 'No public logs found.')
				}
				break;

			case 'selectAllPrivate':
				var checkboxes = t.findAll('tr:not(.hidden)[data-private="true"] .selectCheckbox');
				if(checkboxes.length > 0){
					_.each(checkboxes, function(el, k){
						$(el).prop('checked', true);
						$(el).closest('tr').addClass('selected');
					});
				}
				else{
					toastr.warning('', 'No private logs found.')
				}
				break;

			case 'selectAllValid':
				var checkboxes = t.findAll('tr:not(.hidden)[data-validated="true"] .selectCheckbox');
				if(checkboxes.length > 0){
					_.each(checkboxes, function(el, k){
						$(el).prop('checked', true);
						$(el).closest('tr').addClass('selected');
					});
				}
				else{
					toastr.warning('', 'No valid logs found.')
				}
				break;

			case 'selectAllInvalid':
				var checkboxes = t.findAll('tr:not(.hidden)[data-validated="false"] .selectCheckbox');
				if(checkboxes.length > 0){
					_.each(checkboxes, function(el, k){
						$(el).prop('checked', true);
						$(el).closest('tr').addClass('selected');
					});
				}
				else{
					toastr.warning('', 'No invalid logs found.')
				}
				break;

			case 'selectAllDomain':
				var selectCriteria = e.currentTarget.getAttribute('data-domain');
				var checkboxes = t.findAll('tr:not(.hidden)[data-domain="'+ selectCriteria +'"] .selectCheckbox');
				_.each(checkboxes, function(el, k){
					$(el).prop('checked', true);
					$(el).closest('tr').addClass('selected');
				});
				break;

			case 'selectAllTitle':
				var selectCriteria = e.currentTarget.getAttribute('data-title');
				var checkboxes = t.findAll('tr:not(.hidden)[data-title="'+ selectCriteria +'"] .selectCheckbox');
				_.each(checkboxes, function(el, k){
					$(el).prop('checked', true);
					$(el).closest('tr').addClass('selected');
				});
				break;
		}

		var selectedLogs = t.findAll('tr.selected');
		Session.set('selectedLogs', selectedLogs.length);
	},
	//*******
	//	TIMESHEET BLUK ACTIONS
	//*******
	'click .logBulkAction': function(e, t){
		e.preventDefault();

		var el = $(e.currentTarget);
		var action = el.attr('data-action');

		switch(action){
			case 'save':
				console.log('save all timesheet')
				var usavedLogs = getUnsavedLogs('global');
				var selectedLogs = getSelectedLogs('global');

				if(typeof usavedLogs === 'undefined' || usavedLogs.length === 0){
					toastr.warning('No changes to save.');
					return;
				}

				console.log('saving ' + usavedLogs.length + ' logs')

				_.each(usavedLogs, function(trEl, k){
					var tr = $(trEl);

					saveRowChanges(tr);

					tr.find('.selectCheckbox').prop('checked', false);
					tr.removeClass('selected');
				});

				_.each(selectedLogs, function(trEl, k){
					var tr = $(trEl);
					tr.find('.selectCheckbox').prop('checked', false);
					tr.removeClass('selected');
				});

				Session.set('selectedLogs', 0);

				_updateValidatedTime();
				break;

			//*****
			//	Set as Project action (sets selected logs to the selected project) 
			case 'setProject':
				console.log('setProject selectize')
				var dropdown = el.closest('.dropdown');
				var dropdownToggle = dropdown.find('.dropdown-toggle');
				var inputGroup = dropdown.find('.dropdown-input-group');

				dropdownToggle.css({'display':'none'});

				//*************
				//	Project Selectize Options
				//*************
				//Build options
				var projectOptions = [];
				var allProjects = Projects.find({},{sort:{name:1}, reactive: false}).fetch();
				for(var i=0; i < allProjects.length; i++){
					projectOptions.push({
						'value': allProjects[i]._id,
						'text': capitalizeFirstLetter(allProjects[i].name)
					});
				}
				//sort string ascending
				originalOptions = projectOptions.sort(function(a, b){
					var textA = a.text.toLowerCase(), 
						textB = b.text.toLowerCase();
					
					if (textA < textB) return -1;
					if (textA > textB) return 1;	
					return 0; //default return value (no sorting)
				});

				inputGroup.css({'display':'inline-block'});

				//Instantiate selectize
				var selectInput = inputGroup.find('input');

				var projectSelectEl = $(selectInput).selectize({
					maxItems: 1,
					create: false,
					placeholder: 'Select project',
					render: {
						option: function (data, escape) {
							return '<div class="option panelAction" data-action="setProject" data-value="' + data.value + '" data-id="'+ data.value +'">' + data.text + '</div>';
						}
					}
				});

				var selectEl = projectSelectEl[0].selectize;

				selectEl.addOption(originalOptions);

				//console.log(selectEl)

				//Bind events
				selectEl.on('change', function(selectedProjectId){
					updateUserLogs('project', selectedProjectId, 'global');
					clearDropdownSelectInput(el);
				});

				selectEl.$control_input.on('keypress keydown keyup', function(e) {
					console.log('keypress')
					positionDropdown(selectEl);
					//Meteor.setTimeout(function(){
					//},10);
				});

				selectEl.on('focus', function(){
					Meteor.setTimeout(function(){
						positionDropdown(selectEl);
					},5);
				});

				$(window).on('scroll', function(){
					positionDropdown(selectEl);
				});

				selectEl.on('blur', function(){
					clearDropdownSelectInput(el);
				});

				//Finally, Focus input
				dropdown.find('.selectize-input input').focus();
				break;

			case 'setCategory':
				console.log('setCategory timesheet')
				var dropdown = el.closest('.dropdown');
				var dropdownToggle = dropdown.find('.dropdown-toggle');
				var inputGroup = dropdown.find('.dropdown-input-group');

				dropdownToggle.css({'display':'none'});

				//*************
				//	Category Selectize Options
				//*************
				//Build options
				var categoryOptions = [];
				var allCategories = DomainCategories.find().fetch();

				for(var i=0; i < allCategories.length; i++){
					categoryOptions.push({
						'value': allCategories[i]._id,
						'text': allCategories[i].label
					});
				}

				inputGroup.css({'display':'inline-block'});

				//Instantiate selectize
				var selectInput = inputGroup.find('input');

				var categoriesSelectEl = $(selectInput).selectize({
					maxItems: 1,
					create: false,
					placeholder: 'Select category',
					render: {
						option: function (data, escape) {
							return '<div class="option panelAction" data-action="setCategory" data-value="' + data.value + '" data-id="'+ data.value +'">' + data.text + '</div>';
						}
					}
				});

				var selectEl = categoriesSelectEl[0].selectize;

				selectEl.addOption(categoryOptions);

				//Bind event
				selectEl.on('change', function(selectedCategoryId){
					updateUserLogs('category', selectedCategoryId, 'global');
					clearDropdownSelectInput(el);
				});

				selectEl.on('blur', function(){
					clearDropdownSelectInput(el);
				});

				//Finally, Focus input
				dropdown.find('.selectize-input input').focus();
				break;
			
			case 'setValid':
				console.log('setValid timsheet')
				var selectedLogs = getSelectedLogs('global');

				if(typeof selectedLogs === 'undefined' || selectedLogs.length === 0){
					toastr.warning('No logs selected.');
					return;
				}
				
				document.getElementsByTagName("body")[0].style.cursor = "wait";

				Meteor.setTimeout(function(){
					_.each(selectedLogs, function(trEl, k){
						
						var tr = $(trEl);
						if(tr.attr('data-validated') === 'false'){

							updateRowUnsavedChanges(tr, 'push', 'validation');

							saveRowChanges($(trEl));

						}
						tr.find('.selectCheckbox').prop('checked', false);
						tr.removeClass('selected');
					});

					document.getElementsByTagName("body")[0].style.cursor = "default";
					_updateValidatedTime();
					

				}, 200);

				Session.set('selectedLogs', 0);
				break;

			case 'setPublic':
				console.log('setPublic')
				var selectedLogs = getSelectedLogs('global');

				if(typeof selectedLogs === 'undefined' || selectedLogs.length === 0){
					toastr.warning('No logs selected.');
					return;
				};

				_.each(selectedLogs, function(trEl, k){
					var tr = $(trEl);

					tr.attr('data-private', false);
					tr.find('.privateCheckbox').prop('checked', false);
					
					console.log('TODO: save public state for row');

					//Unselect rows
					tr.find('.selectCheckbox').prop('checked', false);
					tr.removeClass('selected');
				});
				Session.set('selectedLogs', 0);
				break;

			case 'setPrivate':
				console.log('setPrivate')
				var selectedLogs = getSelectedLogs('global');

				if(typeof selectedLogs === 'undefined' || selectedLogs.length === 0){
					toastr.warning('No logs selected.');
					return;
				};

				_.each(selectedLogs, function(trEl, k){
					var tr = $(trEl);

					tr.attr('data-private', true);
					tr.find('.privateCheckbox').prop('checked', true);
					
					console.log('TODO: save public state for row');

					//Unselect rows
					tr.find('.selectCheckbox').prop('checked', false);
					tr.removeClass('selected');
				});
				Session.set('selectedLogs', 0);
				break;
		}
	},

	'click .dismiss-input': function(e, t){
		e.preventDefault();
		var el = $(e.currentTarget);
		console.log('destroy selectize');
		clearDropdownSelectInput(el);
	},
});

Template.userTimesheet.onDestroyed(function(){
	$(window).off('scroll');
	$(document).off('keydown, keyup');
	
	if(process.env.NODE_ENV === 'production'){
		try{
			Tawk_API.showWidget();
		}
		catch(err){}
	}

});