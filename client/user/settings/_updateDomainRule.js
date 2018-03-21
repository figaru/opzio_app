updateDomainRule = function(updateType, objectId, ruleEl){
	switch(updateType){
		case 'project':
			//When selecting Auto, objectId comes as 'Auto', convert to 'null' string
			if(objectId === 'auto' || objectId === 'Auto') objectId = null;

			console.log('project ' + objectId)
			console.log('current ' + ruleEl.attr('data-projectname'))


			//User is setting project to its original value
			if(objectId === ruleEl.attr('data-projectname')){
				console.log('reset (update) project');
				Meteor.call('domains.updateDomainRule', ruleEl.attr('id'), 'project', ruleEl.attr('data-projectid'), function(err, data){
					if(!err){
						if(ruleEl.attr('data-projectid') === null){
							toastr.success('Changed rule for '+ ruleEl.attr('data-domain') +' to let Opz.io automatically classify project for this URL/App.');
						}
						else{
							var project = Projects.findOne({
								_id: ruleEl.attr('data-projectid')
							});
							
							if(project.type !== 'personal'){
								toastr.success('Changed rule for '+ ruleEl.attr('data-domain') +' to set to project as ' + project.name + '.');
							}
							else{
								toastr.success('Changed rule for '+ ruleEl.attr('data-domain') +' to classify as Personal time.');	
							}

						}
					}
					else{
						toastr.error('Error updating project for rule.')
					}
				});
			}
			else if(objectId !== ruleEl.attr('data-projectid')){
				console.log('update project');

				Meteor.call('domains.updateDomainRule', ruleEl.attr('id'), 'project', objectId, function(err, data){
					if(!err){
						if(objectId === null){
							toastr.success('Changed rule for '+ ruleEl.attr('data-domain') +' to let Opz.io automatically classify project for this URL/App.');
						}
						else{
							var project = Projects.findOne({
								_id: objectId
							});
							
							if(project.type !== 'personal'){
								toastr.success('Changed rule for '+ ruleEl.attr('data-domain') +' to set to project as ' + project.name + '.');
							}
							else{
								toastr.success('Changed rule for '+ ruleEl.attr('data-domain') +' to classify as Personal time.');	
							}

						}
					}
					else{
						toastr.error('Error updating project for rule.')
					}
				});
			}

			break;

		case 'category':
			
			//User is setting project to its original value
			if(objectId === ruleEl.attr('data-categoryname')){
				console.log('reset (update) category');
				Meteor.call('domains.updateDomainRule', ruleEl.attr('id'), 'category', ruleEl.attr('data-categoryid'), function(err, category){
					if(!err){
						toastr.success('Changed category to '+ category.label +' for '+ ruleEl.attr('data-domain'));
					}
					else{
						toastr.error('Error updating category for '+ ruleEl.attr('data-domain'))
					}
				});
			}
			else if(objectId !== ruleEl.attr('data-categoryid')){
				console.log('update category');

				Meteor.call('domains.updateDomainRule', ruleEl.attr('id'), 'category', objectId, function(err, category){
					
					if(!err){
						toastr.success('Changed category to '+ category.label +' for '+ ruleEl.attr('data-domain'));
					}
					else{
						toastr.error('Error updating category for rule.')
					}

				});
			}

			break;

		case 'privacy':
			console.log(objectId)
			console.log('update privacy to ' + objectId.privacy);
			Meteor.call('domains.updateDomainRule', ruleEl.attr('id'), 'privacy', objectId.privacy, function(err, private){
				if(!err){
					if(private){
						
						objectId.el.attr({ 'data-private': private }).find('i').removeClass('fa-eye fa-eye-slash').addClass('fa-eye-slash');
						objectId.el.tooltipster('content', '<p><u>Only you</u> can see activity from '+ ruleEl.attr('data-domain') +'.</p>');
						toastr.success('Changed visibility to <b>private</b> for <b>' + ruleEl.attr('data-domain') +'</b>, only you can see this activity.');

					}
					else{
						objectId.el.attr({ 'data-private': private }).find('i').removeClass('fa-eye fa-eye-slash').addClass('fa-eye');
						objectId.el.tooltipster('content', '<p><u>Anyone</u> can see activity from '+ ruleEl.attr('data-domain') +'.</p>');
						toastr.success('Changed visibility to <b>public</b> for <b>' + ruleEl.attr('data-domain') +'</b>, anyone can see this activity.');
					}
				}
				else{
					toastr.error('There was an error updating the rule\'s privacy.');	
				}
			});
			break;

		case 'validation':
			console.log(objectId)
			console.log('update validation to ' + objectId.validated);
			Meteor.call('domains.updateDomainRule', ruleEl.attr('id'), 'validation', objectId.validated, function(err){
				if(!err){
					
					objectId.el.attr('data-validated', objectId.validated);

					if(objectId.validated){
						toastr.success('Every time you navigate to <b>' + ruleEl.attr('data-domain') +'</b> the activity will be set as <b>validated</b>.');

					}
					else{
						toastr.success('Every time you navigate to <b>' + ruleEl.attr('data-domain') +'</b> the activity validation will be <b>unset</b>.');
					}
				}
				else{
					toastr.error('There was an error updating the rule\'s validation.');	
				}
			});
			break;
	}

	//console.log(updateType, objectId)
}