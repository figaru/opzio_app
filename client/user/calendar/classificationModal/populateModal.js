populateModal = function(target){
	var personal = Projects.findOne({type:'personal'});
	var modal = $('#projectDropdownModal');
	var projectList = $('.projectListModal');

	projectList.html('');
	
	//If activity has been validated, dont's show any projects and disable validation/personal project
	if(target.attr('data-validated') === 'true'){
		modal.find('.validateProject').attr('disabled', true).addClass('disabled');
		//modal.find('.personalProject').attr('disabled', true).addClass('disabled');
		modal.find('.scroller').addClass('hidden');
		projectList.append('<div class="p-5 w-100 text-center"><h3><span class="font-weight-light">This activity has been assigned as</span><br />'+ getProjectFromID(target.attr('data-currentproject')) +'</h3></div>');
	}
	//Otherwise populate modal with available projects
	else{
		$('.global-options .personalProject').remove();
		$('.global-options').prepend('<a href="#" data-project="'+personal._id+'" class="btn btn-outline-primary option dropProject personalProject"><i class="fa fa-user"></i> <span class="hidden-xs-down">Personal activity</span></a>')
		var lastProjects = LastTouchedProject.find({
			project:{ $ne: personal._id }
		},
		{
			sort: { updateDate: -1},
			limit: 10
		}).fetch();

		var excludedIDs = [];

		projectList.html('').append('\
			<span class="scroller up"><i class="fa fa-chevron-up"></i></span>\
			<span class="scroller down"><i class="fa fa-chevron-down"></i></span>\
		');

		if(lastProjects.length > 0){
			projectList.append('<span class="mx-2 w-100">Recent</span>');
			//First append most recent projects
			for(var i=0; i<lastProjects.length; i++){
				projectList.append('<div data-project="'+lastProjects[i].project+'" class="p-2 option dropProject"><i class="fa fa-briefcase"></i>&nbsp;&nbsp;'+getProjectFromID(lastProjects[i].project)+'</div>');
				excludedIDs.push(lastProjects[i].project);
			}
			projectList.append('<hr class="m-2 w-100">');
		}

		//Then get rest of the projects
		var projects = Projects.find({
			_id:{ $nin: excludedIDs },
			type:{ $ne: 'personal' }
		},
		{
			sort: {  name: 1, updateDate: -1 },
		}).fetch();

		for(var i=0; i<projects.length; i++){
			projectList.append('<div data-project="'+projects[i]._id+'" class="p-2 option dropProject"><i class="fa fa-briefcase"></i>&nbsp;&nbsp;'+getProjectFromID(projects[i]._id)+'</div>');
		}
	}
}