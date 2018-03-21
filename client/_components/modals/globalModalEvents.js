$(document).on('click touchstart', '.modal-trigger', function(e){
	e.preventDefault();
	var modalType = $(e.currentTarget).data('name');

	if(process.env.NODE_ENV === 'production'){
		try{
			Tawk_API.hideWidget();
		}
		catch(err){
			console.log('Some extension blocking Tawk.to')
		}
	}

	switch(modalType){
		
		case 'addProject':
			//console.log('ADD PROJECT!')

			//Accordion panels
			$('#projectInfoSettings').collapse('toggle');

			if(!isAdmin(Meteor.userId())){
				toastr.warning('Only Administrators can create a project.')
				return;
			} 

			var modal = $('#projectModal');
			modal.removeAttr('data-project');
			modal.find('.modal-action').removeClass('m-progress');
			
			//Remove errors from fields
			modal.find('.error').removeClass('error');

			//Show create button by default
			modal.find('#updateProject').hide();
			modal.find('#createProject').show();
			
			//resetProjectModal();

			modal.modal('show',{
				keyboard: true,
				backdrop: 'static',
			});

			/*

			modal.on('shown.bs.modal', function(e){
				resetProjectModal();
				console.log('show modal')
				if(Meteor.user().joyrides.projectCreation){
					launchProjectJoyride();
				}
			});
			*/

			/*
			modal.find('form').find('input')[0].focus();
			
			modal.on('hide.bs.modal', function(){
				$(this).removeClass('in');
				$(this).find('form')[0].reset();

				//Reiniti datetime pickers
				initProjectDatepickers(false, false);
				
				//Remove active from tab nav & panes (otherwise on next time modal opens, 1st tab is not visible)
				$('#projectModal li').removeClass('active');
				$('.tab-pane').removeClass('active in');
				
				//Destroy any joyride
				$(window).joyride('destroy');

				//Remove any toast dialog if present
				var toasts = $(document).find('.toast');
				if(typeof toasts !== 'undefined'){
					toasts.remove();
				}
			});
			*/

			break;
		
		case 'addTasklist':
			var modal = $('#newTasklistModal');
			
			modal.find('.modal-action').removeClass('m-progress');
			//Check if modal has data-info and update form fields

			//Remove errors from fields
			modal.find('.error').removeClass('error');

			//Show create button by default
			modal.find('#updateTasklist').hide();
			modal.find('#createNewTasklist').show();

			//Reset modal
			modal.find('#tasklistCodeName').text('New Task');

			//Remove form id (when present, indicates we're using the modal to update a tasklist)
			modal.find('#newTasklistForm').removeAttr('data-tasklist');

			//Reset fields
			//Reset priority menu
			var buttonEl = modal.find('#tasklistPriority');
			buttonEl.removeClass('very-high high normal low very-low');
			buttonEl.addClass('normal');
			buttonEl.find('.submenu-title').html('<i class="fa normal"></i> Normal');
			buttonEl.attr('data-priority', 'normal');
			buttonEl.attr('data-value', 0);
			
			//Reset state menu
			var buttonEl = modal.find('.tasklistState');
			buttonEl.removeClass('to-do doing done paused');
			buttonEl.addClass('to-do');
			buttonEl.find('.submenu-title').html('<i class="fa to-do"></i> To do');
			buttonEl.attr('data-state', 'to-do');
			buttonEl.attr('data-value', 0);
			
			modal.find('form')[0].reset();
			
			//Reinit taskilist datepickers
			initTasklistDatepickers(false, false);

			//Finally, open modal
			modal.openModal();
			
			modal.find('form').find('input')[0].focus();

			
			break;
		/*case 'addClient':
			$('#clientModal').find('.modal-action').removeClass('m-progress');
			$('#clientModal').openModal();
			$('#clientModal').find('form').find('input')[0].focus();
			break;
		*/
		case 'addUser':
			if(isAdmin(Meteor.userId())){
				var modal = $('#newUserModal');
				modal.find('.modal-action').removeClass('m-progress');

				modal.modal('show',{
					keyboard: true,
					backdrop: true,
				});

				//modal.find('form').find('input')[0].focus();

				modal.on('hide.bs.modal', function(){
					$(this).find('form')[0].reset();
					modal.find('#availableUserSlots').text('');
					var toasts = $(document).find('.toast');
					var submitBtn = $('#inviteUser');
					submitBtn.removeClass('m-progress').attr('disabled', false);
					if(typeof toasts !== 'undefined'){ toasts.remove(); }
				});
			}

			break;

		case 'editProject':
			//console.log('EDIT PROJECT')

			//Accordion panels
			
			$('#projectInfoSettings').collapse('toggle');

			var modal = $('#projectModal');
			var projectId = $(e.currentTarget).attr('data-project');
			//console.log('EDIT PROJECT ' + projectId)
			modal.attr('data-project', projectId);
			
			modal.find('.modal-action').removeClass('m-progress');
			
			//Remove errors from fields
			modal.find('.error').removeClass('error');

			//Show create button by default
			modal.find('#updateProject').show();
			modal.find('#createProject').hide();
			
			resetProjectModal();

			modal.modal('show',{
				keyboard: true,
				backdrop: true,
			});

			modal.find('form').find('input')[0].focus();

			modal.on('hide.bs.modal', function(){
				modal.removeAttr('data-project');
				$(this).find('form')[0].reset();
				resetProjectModal();
				$('#projectModal .panel-collapse').collapse('hide');
				var toasts = $(document).find('.toast');
				if(typeof toasts !== 'undefined'){
					toasts.remove();
				}
			});
			break;

		/*
		case 'sendFeedback':
			//console.log('send feedback')
			var modal = $('#feedbackModal');
			modal.find('.modal-action').removeClass('m-progress');

			modal.modal('show',{
				keyboard: true,
				backdrop: true,
			});

			//modal.find('form').find('input')[0].focus();

			modal.on('hide.bs.modal', function(){
				$(this).find('form')[0].reset();
				var toasts = $(document).find('.toast');
				if(typeof toasts !== 'undefined'){ toasts.remove(); }
			});
			break;
		*/
		default:
			console.log('Err: couldn\'t call specified modal.')
			break;	
	}

	new MaterialLabel();
});

$(document).on('click touchstart', '.modal .close-modal', function(e){
	if(process.env.NODE_ENV === 'production'){
		try{
			if(Router.current().route.getName() === 'userDashboard' && Router.current().params.hash !== 'timesheet'){
				Tawk_API.showWidget();
			}
		}
		catch(err){
			console.log('Some extension blocking Tawk.to')
		}
	}
});

$(document).on('click touchstart', '.modal .modal-action', function(e){
	if(process.env.NODE_ENV === 'production'){
		try{
			if(Router.current().route.getName() === 'userDashboard' && Router.current().params.hash !== 'timesheet'){
				Tawk_API.showWidget();
			}
		}
		catch(err){
			console.log('Some extension blocking Tawk.to')
		}
	}
});