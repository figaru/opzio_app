_buildSaveTooltip = function(tr, unsavedChanges){

	var changedProject = (unsavedChanges.indexOf('project') >= 0) ? true : false;
	var changedCategory = (unsavedChanges.indexOf('category') >= 0) ? true : false;
	var isValid = (tr.attr('data-validated') === 'true') ? true : false;

	//Create content of tooltip
	
	var saveAdvice = 'Click the <b>Validated</b> checkbox to save it.';
	var tooltipContent = '<i class="fa fa-floppy-o unsavedChanges tooltipster" title="<p>You have made changes to this log.<br>Click the <b>Validated</b> checkbox to save.<br><br>Note that once you save a log\'s project you <em>cannot change</em> it so be sure to validate to the correct project when saving.</p>"></i>';

	
	//Project only
	if(changedProject && !changedCategory){
		tooltipContent = '<i class="fa fa-floppy-o unsavedChanges tooltipster" title="<p>You changed the <em>project</em> of this log.<br><br>'+saveAdvice+'<br><br>Note that once you save a log\'s project you <em>cannot change</em> it so be sure to validate to the correct project when saving.</p>"></i>';
	}
	//Category only
	if(!changedProject && changedCategory){
		saveAdvice = 'Click <b>Save</b> under <span style=\'background-color: #fff; border:1px solid #ccc; color:#263238; padding:6px 12px; border-radius:0; margin-bottom:5px; box-shadow:inset 0px -2px 0px rgba(0, 0, 0, 0.075);\'><i class=\'fa fa-cog\'></i> <i class=\'fa fa-caret-down\'></i></span> to save its category.';

		tooltipContent = '<i class="fa fa-floppy-o unsavedChanges tooltipster" title="<p>You changed the <em>category</em> of this log.<br><br>'+saveAdvice+'<br><br>Note that once you save a log\'s project you <em>cannot change</em> it so be sure to validate to the correct project when saving.</p>"></i>';
	}
	//Both Project & Category
	if(changedProject && changedCategory){
		saveAdvice = 'Click <b>Save</b> under <span style=\'background-color: #fff; border:1px solid #ccc; color:#263238; padding:6px 12px; border-radius:0; margin-bottom:5px; box-shadow:inset 0px -2px 0px rgba(0, 0, 0, 0.075);\'><i class=\'fa fa-cog\'></i> <i class=\'fa fa-caret-down\'></i></span> to save all changes.';

		tooltipContent = '<i class="fa fa-floppy-o unsavedChanges tooltipster" title="<p>You changed the <em>category</em> and <em>project</em> of this log.<br><br>'+saveAdvice+'<br><br>Note that once you save a log\'s project you <em>cannot change</em> it so be sure to validate to the correct project when saving.</p>"></i>';
	}
	

	tr.find('.hasUnsavedChanges').addClass('anim-shake').html(tooltipContent);
	tr.find('.unsavedChanges').tooltipster({
		delay: 0,
		contentAsHTML: true,
		//trigger: 'click'
	});
}