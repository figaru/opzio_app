//*******
// ROW UTILS
//*******
//Update a trow's data-unsavedchanges 
updateRowUnsavedChanges = function(tr, action, updateType){
	//console.log('in updateRowUnsavedChanges')
	var unsavedChanges = JSON.parse(tr.attr('data-unsavedchanges'));
	var index = unsavedChanges.indexOf(updateType);


	switch(action){
		case 'push':
			if(index < 0){
				unsavedChanges.push(updateType);
				
				tr.attr('data-unsavedchanges', JSON.stringify(unsavedChanges));
				tr.find('.saveAction').removeClass('disabled');
				//Place/remove save icon
				
				if(unsavedChanges.length > 0){

					_buildSaveTooltip(tr, unsavedChanges);

					tr.addClass('hasUnsavedChanges');
					
				}
				//Clear row unsaved sates/styles & disable save dropdown action
				else{
					tr.removeClass('hasUnsavedChanges').find('.hasUnsavedChanges').removeClass('anim-shake').html('');
					tr.find('.saveAction').addClass('disabled');
				}
			}
			break;

		case 'pull':
			if (index > -1) {
				console.log('remove ' + updateType)
			    unsavedChanges.splice(index, 1);
			    tr.attr('data-unsavedchanges', JSON.stringify(unsavedChanges));
			    //Place/remove save icon
			    if(unsavedChanges.length > 0){
					
					_buildSaveTooltip(tr, unsavedChanges);

					tr.addClass('hasUnsavedChanges');
					tr.find('.saveAction').removeClass('disabled');
				}
				//Clear row unsaved sates/styles & disable save dropdown action
				else{
					tr.removeClass('hasUnsavedChanges').find('.hasUnsavedChanges').removeClass('anim-shake').html('');
					tr.find('.saveAction').addClass('disabled');
				}
			}
			break;

		default:
			toastr.error('ERR: unknown update type for project change');
	}
};