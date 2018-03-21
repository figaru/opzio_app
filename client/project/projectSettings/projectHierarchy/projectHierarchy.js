Template.projectHierarchy.onRendered(function(){
	var p = Template.instance().data.project;
	
	if(typeof p.hierarchy !== 'undefined' && p.hierarchy !== null){
		$('#actionType').text(p.hierarchy.type);
		$('#hierarchyType').attr('data-action', p.hierarchy.type)
		if(p.hierarchy.type === 'child'){
			hierarchySingleItemSelector(p.hierarchy.projects);
		}
		else{
			hierarchyMultiItemSelector(p.hierarchy.projects);
		}
		$('.hidable-layer').addClass('inline');
	}
	else{
		$('#actionType').text('none');
		$('#hierarchyType').attr('data-action', 'none')
		hierarchySingleItemSelector();
		$('.hidable-layer').removeClass('inline');
	}
});

Template.projectHierarchy.helpers({
	'currentHierarchy': function(){
		var p = Template.instance().data.project;
		
		if($('#hierarchyType').attr('data-userset') !== 'true'){
			if(typeof p.hierarchy !== 'undefined' && p.hierarchy !== null){
				$('#hierarchyType').attr('data-action', p.hierarchy.type)
				$('#actionType').text(p.hierarchy.type);
			}
			else{
				$('#hierarchyType').attr('data-action', 'none')
				$('#actionType').text('none');
			}
		}
	}
});

Template.projectHierarchy.events({
	'click .hierarchy-option': function(e){
		e.preventDefault();
		var dropdownEl = $('#hierarchyType');
		var action = e.currentTarget.getAttribute('data-action');
		var currentProject = Template.instance().data.project;
		var projectId = $('#assignToProject').val();

		switch(action){
			case 'none':
				dropdownEl.find('#actionType').text(action);
				dropdownEl.attr('data-action', action);
				dropdownEl.attr('data-userset', 'true');
				
				if(projectId.length < 1){
					$('.hidable-layer').removeClass('inline');	
				}

				break;

			case 'child':
				dropdownEl.find('#actionType').text(action);
				dropdownEl.attr('data-action', action);
				dropdownEl.attr('data-userset', 'true');
				$('.hidable-layer').addClass('inline');

				$('#assignToProject').val('').data('selectize').destroy();
				hierarchySingleItemSelector();

				break;

			case 'parent':
				dropdownEl.find('#actionType').text(action);
				dropdownEl.attr('data-action', action);
				dropdownEl.attr('data-userset', 'true');
				$('.hidable-layer').addClass('inline');

				$('#assignToProject').val('').data('selectize').destroy();
				hierarchyMultiItemSelector();

				break;

			default:
				toastr.error('Unknown hierarchy action.')

		}

	},

	'click #assignHierarchy': function(e){
		e.preventDefault();
		var action = $('#hierarchyType').attr('data-action');
		var projectId = $('#assignToProject').val();
		var currentProject = Template.instance().data.project;

		//console.log(action)
		//console.log(projectId)
		//console.log(currentProject)

		switch(action){
			case 'none':
				if(projectId.length > 0){
					var selectedProject = Projects.findOne({
						_id: projectId
					});

					if(selectedProject.hierarchy !== null){

						toastr.options.timeOut = 0;
						toastr.options.extendedTimeOut = 0;
						toastr.options.tapToDismiss = false;

						var body = '<div>'
										+'<p>Are you sure you remove hierarchy between ' + currentProject.name + ' and ' + selectedProject.name + '?</p>'
										+'<button type="button" class="btn clear">Cancel</button>'
										+'<button type="button" id="setNullHierarchy" class="btn btn-primary pull-right">Yes</button>'
									+'</div>';

						var toast = toastr.warning(body, 'Remove hierarchy?');
						
						resetToastrOptions();

						toast.delegate('#setNullHierarchy', 'click', function () {
						    toast.remove();
						   	
						   	Meteor.call('updateProjectHierarchy', currentProject._id, projectId, 'null', function(err, data){
						   		if(!err){
									$('#assignToProject').val('').data('selectize').destroy();
									hierarchySingleItemSelector();
									
									$('.hidable-layer').removeClass('inline');
						   			
						   			toastr.success('Removed hierarchy between ' + currentProject.name + ' and ' + selectedProject.name);
						   		}
						   		else{
						   			toastr.error('Error removing hierarchy!')
						   		}
						   	});

						});

						toast.delegate('.clear', 'click', function () { toast.remove(); });
					}

				}
				break;

			case 'child':
				if(projectId.length > 0){
					if(currentProject._id === projectId){
						toastr.warning('Cannot assign to self.');
						return;
					}


					var selectedProject = Projects.findOne({ _id: projectId });
					//Check if there's a previous hierarchy set
					var currentParent = Projects.findOne({
						'hierarchy.type': 'parent',
						'hierarchy.projects':{
							$in: [currentProject._id]
						}
					});

					if(currentProject.hierarchy !== null && typeof currentParent !== 'undefined'){
						toastr.options.timeOut = 0;
						toastr.options.extendedTimeOut = 0;
						toastr.options.tapToDismiss = false;

						var body = '<div>'
										+'<p>'+currentProject.hierarchy.type +' is set as the child of ' + currentParent.name+'.<br>'
										+'Do you wish to replace it as the child of '+ selectedProject.name +'?</p>'
										+'<button type="button" class="btn clear">Cancel</button>'
										+'<button type="button" id="replaceChild" class="btn btn-primary pull-right">Yes</button>'
									+'</div>';

						var toast = toastr.warning(body, 'Remove hierarchy?');
						
						resetToastrOptions();

						toast.delegate('#replaceChild', 'click', function () {
						    toast.remove();
						   	
						   	Meteor.call('updateProjectHierarchy', currentProject._id, projectId, 'child', function(err, data){
						   		if(!err){
									$('#assignToProject').val('').data('selectize').destroy();
									hierarchySingleItemSelector(projectId);
						   			
						   			toastr.success('Replaced ' + currentProject.name + ' to child of ' + selectedProject.name);
						   		}
						   		else{
						   			toastr.error('Error removing hierarchy!')
						   		}
						   	});

						});

						toast.delegate('.clear', 'click', function () { toast.remove(); });
					}
					else{
						Meteor.call('updateProjectHierarchy', currentProject._id, projectId, 'child', function(err, data){
							if(!err){
								toastr.success('Set ' + currentProject.name + ' as child of ' + selectedProject.name);
							}
							else{
								toastr.error('Error setting child!')
							}
						});
					}
				}
				else{
					toastr.error('You must specify a project to assign as parent.')
					$('#assignToProject').data('selectize').$control.click()
				}
				break;

			case 'parent':
				if(projectId.length > 0){

					var selectedProjects = [];
					var multiProjects = projectId.split(',');

					if(multiProjects.indexOf(currentProject._id) !== -1){
						toastr.warning('Cannot assign to self.');
						return;
					}

					if(multiProjects.length > 1){
						selectedProjects = Projects.find({
							_id:{
								$in: multiProjects
							}
						}).fetch();
					}
					else{
						selectedProjects = Projects.find({
							_id: multiProjects[0]
						}).fetch();
					}

					var projectsToUpdate = [];
					var otherChilds = [];
					var otherParents = [];

					for(var i=0; i<selectedProjects.length; i++){
						console.log(selectedProjects[i].hierarchy);

						if(selectedProjects[i].hierarchy === null){
							projectsToUpdate.push(selectedProjects[i]._id);
						}
						else{
							//Project is child but assigned project is not selectedProject
							if(selectedProjects[i].hierarchy.type === 'child' && selectedProjects[i].hierarchy.projects[0] !== currentProject._id){
								projectsToUpdate.push(selectedProjects[i]._id);
								otherChilds.push(selectedProjects[i]._id);
							}
							else if(selectedProjects[i].hierarchy.type === 'parent'){
								projectsToUpdate.push(selectedProjects[i]._id);
								otherParents.push(selectedProjects[i]._id);
							}
						}
					}

					console.log(projectsToUpdate)

					if(projectsToUpdate.length > 0 && otherChilds.length > 0 || otherParents.length > 0){
						toastr.options.timeOut = 0;
						toastr.options.extendedTimeOut = 0;
						toastr.options.tapToDismiss = false;

						var body = '<div>'
										+'<p>Multi-hierarchy not supported. Some of the projects you have selected are children/parents of other projects.<br>'
										+'Proceeding will unset parenthood of these projects.<br>'
										+'Do you wish to proceed?</p>'
										+'<button type="button" class="btn clear">Cancel</button>'
										+'<button type="button" id="changeHierarchies" class="btn btn-primary pull-right">Yes</button>'
									+'</div>';

						var toast = toastr.warning(body, 'Change hierarchies?');
						
						resetToastrOptions();

						toast.delegate('#changeHierarchies', 'click', function () {
						    toast.remove();
						   	
						   	Meteor.call('updateProjectHierarchy', currentProject._id, projectsToUpdate, 'parent', function(err, data){
						   		if(!err){
									$('#assignToProject').val('').data('selectize').destroy();
									hierarchyMultiItemSelector(projectsToUpdate);
						   			var selectedProjectsNames = [];
						   			for(var i=0;i<selectedProjects.length;i++){
						   				selectedProjectsNames.push(selectedProjects[i].name)
						   			}
						   			var strNames = selectedProjectsNames.join(', ')
						   			toastr.success('Set ' + currentProject.name + ' as parent of ' + strNames);
						   		}
						   		else{
						   			toastr.error('Error removing hierarchy!')
						   		}
						   	});

						});

						toast.delegate('.clear', 'click', function () { toast.remove(); });
					}
					else{

					}

					return;
					
					$('#assignToProject').val('').data('selectize').destroy();
					hierarchyMultiItemSelector();
				}
				else{
					toastr.error('You must specify a project to assign as child.')
					$('#assignToProject').data('selectize').$control.click()
				}
				break;

			default:
				toastr.error('Unknown hierarchy action.')

		}
	}
});

hierarchySingleItemSelector = function(selectedProject){
	var $assignToProject = $('#assignToProject').selectize({
		maxItems: 1,
		plugins: ['remove_button'],
		create: false
	});

	var $projectSelectEl = $assignToProject[0].selectize;

	//TODO: get only non-archived projects
	var projects = Projects.find({}).fetch();

	//########
	//	POPULATE
	//########
	if(typeof projects !== 'undefined' && projects.length > 0){
		for (var i = 0; i < projects.length; i++){
			$projectSelectEl.addOption({
				value: projects[i]._id, 
				text: projects[i].name
			});
			$projectSelectEl.addItem(projects[i]);
		}
	}

	if(typeof selectedProject !== 'undefined'){
		$projectSelectEl.addItem(selectedProject)
	}

	/*
	$projectSelectEl.on('item_add', function(value, item){
		console.log('add single item ' + value)
	});
	*/

}

hierarchyMultiItemSelector = function(selectedProjects){
	var $assignToProject = $('#assignToProject').selectize({
		//maxItems: 1,
		plugins: ['remove_button'],
		create: false
	});

	var $projectSelectEl = $assignToProject[0].selectize;

	//TODO: get only non-archived projects
	var projects = Projects.find({}).fetch();

	//########
	//	POPULATE
	//########
	if(typeof projects !== 'undefined' && projects.length > 0){
		for (var i = 0; i < projects.length; i++){
			$projectSelectEl.addOption({
				value: projects[i]._id, 
				text: projects[i].name
			});
			$projectSelectEl.addItem(projects[i]);
		}
	}

	if(typeof selectedProjects !== 'undefined'){
		for(var i=0; i<selectedProjects.length;i++){
			$projectSelectEl.addItem(selectedProjects[i])
		}
	}

	/*
	$projectSelectEl.on('item_add', function(value, item){
		console.log('add multiple item ' + value)
	});
	*/
}