//
//	UPDATE User Log Row inputs and attributes prior to prepare it for save/classification
//
updateUserLogs = function(updateType, selectionId, scope, targetEl){
	//console.log(updateType, selectionId, scope);

	var selectedLogs = getSelectedLogs(scope, targetEl);

	//console.log(targetEl)

	if(typeof selectedLogs === 'undefined' || selectedLogs.length === 0){
		toastr.warning('You haven\'t selected any logs.');
		return;
	}

	switch(updateType){
		case 'project':
			_.each(selectedLogs, function(trEl, k){
				let tr = $(trEl);

				if(tr.attr('data-type') !== 'code' && tr.attr('data-validated') === 'false'){
					var originalProjectId = tr.attr('data-projectid');
					var originalProjectName = tr.attr('data-projectname');
					
					var inputEl = tr.find('.systemProjectMatches');
					var item = inputEl.data('selectize').$control[0].getElementsByClassName('item');

					if(typeof item === 'undefined'){
						inputEl.val(originalProjectName);
						inputEl.data('selectize').setValue(originalProjectId, true);
						return;
					}

					if(inputEl.data('selectize').$control[0].getElementsByClassName('item').length > 0){
						if(selectionId !== originalProjectId && selectionId !== originalProjectName){
							inputEl.data('selectize').setValue(selectionId, true);
							updateRowUnsavedChanges(tr, 'push', 'project');
						}
						else{
							inputEl.val(originalProjectName);
							inputEl.data('selectize').setValue(originalProjectId, true);
							updateRowUnsavedChanges(tr, 'pull', 'project');
						}
					}
				}

			});
			break;

		case 'category':
			_.each(selectedLogs, function(trEl, k){
				let tr = $(trEl);

				var originalCategoryId = tr.attr('data-categoryid');
				var originalCategoryName = tr.attr('data-categorylabel');
				
				var inputEl = tr.find('.categoryInput');
				var item = inputEl.data('selectize').$control[0].getElementsByClassName('item');

				if(typeof item === 'undefined'){
					inputEl.val(originalCategoryName);
					inputEl.data('selectize').setValue(originalCategoryId, true);
					return;
				}

				if(inputEl.data('selectize').$control[0].getElementsByClassName('item').length > 0){
					if(selectionId !== originalCategoryId && selectionId !== originalCategoryName){
						inputEl.data('selectize').setValue(selectionId, true);
						updateRowUnsavedChanges(tr, 'push', 'category');
					}
					else{
						inputEl.val(originalCategoryName);
						inputEl.data('selectize').setValue(originalCategoryId, true);
						updateRowUnsavedChanges(tr, 'pull', 'category');
					}
				}
			});
			break;
	}

}