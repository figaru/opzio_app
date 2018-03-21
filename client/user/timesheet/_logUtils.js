getSelectedLogs = function(scope, targetEl){
	
	switch(scope){
		case 'panel':
			var selectedLogs = targetEl.closest('.panel').find('tr.selected');
			break;

		case 'global':
			var selectedLogs = $('tr.selected');
			break;
	}
	
	//console.log(selectedLogs.length)
	return selectedLogs;
}

getUnsavedLogs = function(scope, targetEl){
	
	switch(scope){
		case 'panel':
			var selectedLogs = targetEl.closest('.panel').find('tr.hasUnsavedChanges');
			break;

		case 'global':
			var selectedLogs = $('tr.hasUnsavedChanges');
			break;
	}
	
	if(selectedLogs.length > 0){
		Session.set('hasUnsavedLogs', true);
	}
	else Session.set('hasUnsavedLogs', false);
	
	return selectedLogs;
}

getValidatedLogs = function(scope, targetEl){
	
	switch(scope){
		case 'panel':
			var validLogs = targetEl.closest('.panel').find('tr[data-validated="true"]');
			break;

		case 'global':
			var validLogs = $('tr.selected');
			break;
	}
	
	return validLogs;
}