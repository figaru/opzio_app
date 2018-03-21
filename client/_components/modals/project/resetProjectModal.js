resetProjectModal = function(){
	var form = $('#newProjectForm');
	var modal = form.closest('.modal');
	form[0].reset();
	$('.form-group').removeClass('focused force-focused-alt');

	//State button
	var stateBtn = modal.find('button.projectState');
	stateBtn.removeClass('initiate plan execute maintaing delivered paused dropped').addClass('initiate');
	stateBtn.attr('data-state', 'initiate').attr('data-value', '0');
	stateBtn.find('.submenu-title').html('<i class="fa initiate"></i> Initiate')

	//Priority button
	var priorityBtn = modal.find('button.priorityMenu');
	priorityBtn.removeClass('very-high high normal low very-low').addClass('normal');
	priorityBtn.attr('data-priority', 'normal').attr('data-value', '0');
	priorityBtn.find('.submenu-title').html('<i class="fa normal"></i> Normal');

	//Priority button
	var visibilityBtn = modal.find('button.visibilityMenu');
	visibilityBtn.attr('data-visibility', 'internal').attr('data-value', '1');
	visibilityBtn.find('.submenu-title').html('<i class="fa fa-low-vision"></i> Internal');

	//Reset team
	var selectEl = $('#teamSelect')[0].selectize;
	selectEl.setValue(Meteor.userId());

	$('#teamSelect').closest('.form-group').addClass('force-focused-alt')
	
}