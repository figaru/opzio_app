Template.userLogsPanel.events({
	//*******
	//	PANEL BULK SELECTION
	//*******
	'click .bulkSelectPanel': function(e, t){
		e.preventDefault();
		var action = e.currentTarget.getAttribute('data-action');

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
				_.each(checkboxes, function(el, k){
					$(el).prop('checked', false);
					$(el).closest('tr').removeClass('selected');
				});
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
	//	PANEL BULK ACTIONS
	//*******
	'click .bulkActionPanel': function(e, t){
		e.preventDefault();

		var el = $(e.currentTarget);
		var action = el.attr('data-action');

		switch(action){
			//****
			//	SAVE ROW
			//****
			case 'save':
				var usavedLogs = getUnsavedLogs('panel', el);
				var selectedLogs = getSelectedLogs('panel', el);
				if(typeof usavedLogs === 'undefined' || usavedLogs.length === 0){
					toastr.warning('', 'No changes to save.');
					return;
				}

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

				_updateValidatedTime();

				Session.set('selectedLogs', 0);

				break;

			case 'setProject':
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

				//Bind event
				selectEl.on('change', function(selectedProjectId){
					//console.log('set as project ' + selectedProjectId);
					clearDropdownSelectInput(el);
					Meteor.setTimeout(function(){
						updateUserLogs('project', selectedProjectId, 'panel', el);
					}, 500);
				});

				selectEl.on('blur', function(){
					clearDropdownSelectInput(el);
				});

				//Finally, Focus input
				dropdown.find('.selectize-input input').focus();
				break;

			case 'setCategory':
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
					updateUserLogs('category', selectedCategoryId, 'panel', el);
					clearDropdownSelectInput(el);
				});

				selectEl.on('blur', function(){
					clearDropdownSelectInput(el);
				});

				//Finally, Focus input
				dropdown.find('.selectize-input input').focus();
				break;

			case 'setValid':
				var selectedLogs = getSelectedLogs('panel', el);

				if(typeof selectedLogs === 'undefined' || selectedLogs.length === 0){
					toastr.warning('', 'No logs selected.');
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
						
					_updateValidatedTime();
					document.getElementsByTagName("body")[0].style.cursor = "default";

				});

				Session.set('selectedLogs', 0);
				break;
			
			case 'setPublic':
				//Update public/private is not subject to pre-save state, it is directly saved to the database
				var selectedLogs = getSelectedLogs('panel', el);
				
				if(typeof selectedLogs === 'undefined' || selectedLogs.length === 0){
					toastr.warning('','No logs selected.');
					return;
				};

				_.each(selectedLogs, function(trEl, k){
					var tr = $(trEl);

					tr.attr('data-private', false);
					tr.find('.privateCheckbox').prop('checked', false);

					Meteor.call('userLogs.updatePrivacy', tr.attr('id'), false);

					//Unselect rows
					tr.find('.selectCheckbox').prop('checked', false);
					tr.removeClass('selected');
				});
				Session.set('selectedLogs', 0);

				break;

			case 'setPrivate':
				var selectedLogs = getSelectedLogs('panel', el);
				
				if(typeof selectedLogs === 'undefined' || selectedLogs.length === 0){
					toastr.warning('','No logs selected.');
					return;
				};

				_.each(selectedLogs, function(trEl, k){
					var tr = $(trEl);

					tr.attr('data-private', true);
					tr.find('.privateCheckbox').prop('checked', true);
					
					Meteor.call('userLogs.updatePrivacy', tr.attr('id'), true);

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
		//console.log('destroy selectize');
		clearDropdownSelectInput(el);
	}
});