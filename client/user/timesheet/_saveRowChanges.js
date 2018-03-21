saveRowChanges = function(tr){

	console.log('saveRowChanges');

	var updateData = {};
	var changes = JSON.parse(tr.attr('data-unsavedchanges'));
	var applyChanges = false;

	//console.log(changes);

	if(changes.indexOf('project') >= 0){
		//Ensure log hasn't been validated previsouly, if so ignore
		if(tr.attr('data-validated') === 'false'){
			//console.log('has project change');

			//Check if there's a validation change in the array as well, if so remove it
			if(changes.indexOf('validation') >= 0){
				console.log('remove')
				updateRowUnsavedChanges(tr, 'pull', 'validation');
				changes = JSON.parse(tr.attr('data-unsavedchanges'));
			}

			var projectSelectInput = tr.find('.systemProjectMatches');
			
			//Disable validate checkbox
			tr.find('.validatedCheckbox').attr('disabled', true).prop('checked', true);;

			
			var projectSelectizeEl = projectSelectInput.data('selectize');
			//Destroy selectize
			projectSelectizeEl.destroy();

			//Assign project to be updated
			updateData['project'] = projectSelectizeEl.$input[0].value;

			//Manipulate original input to display project name instead of ID, then disable it
			projectSelectInput.val(projectSelectizeEl.$control[0].innerText);
			projectSelectInput.attr('data-selected', projectSelectizeEl.$input[0].value);
			projectSelectInput.attr('disabled', true);

			//Style row as validated
			tr.attr('data-validated', true);

			applyChanges = true;

		}

	}

	if(changes.indexOf('category') >= 0){
		//console.log('has category change');

		var categorySelectInput = tr.find('.categoryInput');


		//Assign project to be updated
		updateData['category'] = categorySelectInput.data('selectize').$input[0].value;

		applyChanges = true;
	}

	if(changes.indexOf('validation') >= 0){
		var selectInput = tr.find('.systemProjectMatches');
		tr.find('.validatedCheckbox').prop('checked', true).attr('disabled', true);

		var selectizeEl = selectInput.data('selectize');
		selectizeEl.destroy();

		//Check if selected project has been changed or not

		var selectedProject = selectizeEl.$input[0].value;
		if(selectedProject === tr.attr('data-projectname')){
			selectedProject = selectizeEl.$input[0].getAttribute('data-selected');
		}

		updateData['project'] = selectedProject;

		//Manipulate original input to display project name instead of ID, then disable it
		selectInput.val(selectizeEl.$control[0].innerText);
		selectInput.attr('data-selected', selectizeEl.$input[0].value);
		selectInput.attr('disabled', true);
		
		tr.attr('data-validated', true);

		applyChanges = true;
	}

	//Remove row unsavedChanges styles/elements & unselect
	if(applyChanges){
		tr.removeClass('hasUnsavedChanges').find('.hasUnsavedChanges').html('');
		tr.attr('data-unsavedchanges', '[]');
		tr.find('.saveAction').addClass('disabled');

		updateData['logId'] = tr.attr('id');
		
		Meteor.call('updateLogProject', updateData, function(err, data){
			if(err){
				toastr.error('System error validating log');
			}
		});
	}
	
	Session.set('selectedLogs', 0);

	//console.log('update with data')
	//console.log(updateData)
};