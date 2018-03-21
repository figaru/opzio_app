Template.projectFinance.onRendered(function(){
	console.log('projectFinance rendered')
	var t = Template.instance();

	this.autorun(function(){
		console.log('run tracker')
		var project = Projects.findOne({_id: t.data.project._id });
		
		Meteor.setTimeout(function(){
			if(project.hasSetupBudget){
				if(project.budgetType === 'fixedBudget' || typeof project.budgetType === 'undefined'){
					console.log('fixed cost')
					t.$('#fixedCostPanel').removeClass('hidden');
				}
				else{
					console.log('hour value')
					t.$('#hourValuePanel').removeClass('hidden');
					if(project.applyHourValuePerTeam){
						$('#projectRateSetupPanel').removeClass('hidden');
						$('#teamRateSetupPanel').addClass('hidden');
					}
					else{
						$('#projectRateSetupPanel').addClass('hidden');
						$('#teamRateSetupPanel').removeClass('hidden');
					}
				}
			}
		}, 250)
	});
});

Template.projectFinance.helpers({
	'isHourValue': function(project){
		if(project.budgetType === 'fixedBudget'){
			return false;
		}
		else{
			return true;
		}
	}
});

Template.projectFinance.events({

	'click #createBudget': function(e, t){
		e.preventDefault();
		console.log('create budget');
		var isHourValue = t.$('#budgetType').is(':checked');
		console.log(isHourValue);
		Meteor.call('project.saveBudgetType', t.data.project._id, isHourValue, function(err, data){
			if(!err){
				toastr.success('Budget type setup. Complete budget information.')
			}
		});
	},

	//Change billing option
	'change .changeBillingOption': function(e){
		var elId = $(e.currentTarget).attr('id');
		var budgetCard = $('#budget');

		var saveBtn = $('.saveChanges');

		//Apply each member's hour value to cost this project
		if(elId === 'individualMemberOption'){
			$('#teamRateSetupPanel').removeClass('hidden');
			$('#projectRateSetupPanel').addClass('hidden');
			
			if(budgetCard.attr('data-valueperteam') === 'true'){
				saveBtn.attr('data-valueperteam', 'false')
				saveBtn.removeClass('hidden').addClass('anim-shake');
			}
			else{
				saveBtn.addClass('hidden').removeClass('anim-shake');
			}
		}

		//Apply single hour rate to all members of the project
		else{
			$('#teamRateSetupPanel').addClass('hidden');
			$('#projectRateSetupPanel').removeClass('hidden');
			
			if(budgetCard.attr('data-valueperteam') === 'false'){
				saveBtn.attr('data-valueperteam', 'true')
				saveBtn.removeClass('hidden');
			}
			else{
				saveBtn.addClass('hidden');	
			}
		}
	},

	//Change user hourRate for project
	'change .userHourRate': function(e, t){
		var el = $(e.currentTarget);
		var userId = el.closest('tr').attr('data-userid');
		
		var currentHourRate = parseFloat(el.attr('data-currentvalue'));
		var newHourRate = parseFloat(el.val());

		var saveBtn = $('.saveChanges');
		
		console.log(currentHourRate, newHourRate)
		

		if(currentHourRate !== newHourRate){
			console.log('change userHourRate for ' + userId + ' to ' + newHourRate);
			el.closest('tr').attr('data-changed', true);
			el.closest('tr').attr('data-newvalue', newHourRate);
		}
		else{
			el.closest('tr').attr('data-changed', false);
			el.closest('tr').removeAttr('data-newvalue');
		}
		
		//Check there are no other user hour rate that have been changed and hide/show save button accordingly
		if($('#teamRateSetupPanel').find('tr[data-changed="true"]').length > 0){
			saveBtn.attr('data-updatememberrates', true);
			saveBtn.removeClass('hidden').addClass('anim-shake');
		}
		else{
			saveBtn.removeAttr('data-updatememberrates');
			saveBtn.addClass('hidden').removeClass('anim-shake');
		}

	},

	//Click hourly billing changes
	'click #saveHourBillingChanges': function(e, t){
		var budgetCard = $('#budget');
		var saveBtn = $(e.currentTarget);

		//Change specific hour rates of billing option
		if(typeof saveBtn.attr('data-valueperteam') === 'undefined'){
			if(saveBtn.attr('data-updatememberrates') === 'true'){
				var tr = $('#teamRateSetupPanel').find('tr[data-changed="true"]');
				if(tr.length > 0){
					var userData = [];
					for(var i=0; i<tr.length; i++){
						userData.push({
							user: $(tr[i]).attr('data-userid'),
							value: $(tr[i]).attr('data-newvalue'),
						});
					}

					if(userData.length > 0){

						toastr.options.timeOut = 0;
						toastr.options.extendedTimeOut = 0;
						toastr.options.tapToDismiss = false;
						toastr.options.preventDuplicates = true;

						var body = '\
							How do you want to apply this change?\
							<div style="text-align:left;">\
							<button type="button" id="applyPast" class="btn btn-outline-primary btn-sm my-1 text-left border-0">Past (non-billed work only)<br> and future work</button>\
							<button type="button" id="applyFuture" class="btn btn-outline-primary btn-sm my-1 border-0">Future work only</button>\
							<br>\
							<button type="button" class="btn btn-link btn-sm clear text-muted mt-1">Cancel</button>\
							</div>';

						var toast = toastr.info(body, 'Change billing option');

						resetToastrOptions();

						//Bind toast events
						if(typeof toast !== 'undefined'){
							//When user chooses to apply changes to past logs as well
						    if (toast.find('#applyPast').length) {
						        toast.delegate('#applyPast', 'click', function () {

						        	Meteor.call('project.updateTeamHourRate', t.data.project._id, userData, function(err, data){
						        		if(!err){
						        			saveBtn.removeAttr('data-updatememberrates').addClass('hidden').removeClass('anim-shake');
						        			toastr.success('Changed team member(s) hour rate.')
											
											//Also change pass non billed hour logs
											Meteor.call('userLogs.updateBillingOption', t.data.project, "false", function(err, data){
												if(!err){
													toastr.success('Changed hour rate for past logs.');
												}
												else{
													toastr.error('Error changing hour rate for past logs!');
												}
											});
						        		}
						        		else{
						        			toastr.error('Error changing team member(s) hour rate!')
						        		}
						        	});
					            	
						            toast.remove();
						        });
						    }

						    //When user chooses to apply changes to future logs only
						    if (toast.find('#applyFuture').length) {
						        toast.delegate('#applyFuture', 'click', function () {	
			        	        	Meteor.call('project.updateTeamHourRate', t.data.project._id, userData, function(err, data){
			        	        		if(!err){
			        	        			saveBtn.removeAttr('data-updatememberrates').addClass('hidden').removeClass('anim-shake');
			        	        			toastr.success('Changed team member(s) hour rate.')
			        	        		}
			        	        		else{
			        	        			toastr.error('Error changing team member(s) hour rate!')
			        	        		}
			        	        	});
									toast.remove();
						        });
						    }

							if (toast.find('.clear').length) {
							    toast.delegate('.clear', 'click', function () {
							        toast.remove();
							    });
							}
						}
					}

				}
			}
		}
		//Change whole billing option and hour rates
		else if(saveBtn.attr('data-valueperteam') != budgetCard.attr('data-valueperteam')){
			var applyHourValuePerTeam = saveBtn.attr('data-valueperteam');
			console.log('valueperteam: ' + applyHourValuePerTeam)

			toastr.options.timeOut = 0;
			toastr.options.extendedTimeOut = 0;
			toastr.options.tapToDismiss = false;
			toastr.options.preventDuplicates = true;

			var body = '\
				How do you want to apply this change?\
				<div style="text-align:left;">\
				<button type="button" id="applyPast" class="btn btn-outline-primary btn-sm my-1 text-left border-0">Past (non-billed work only)<br> and future work</button>\
				<button type="button" id="applyFuture" class="btn btn-outline-primary btn-sm my-1 border-0">Future work only</button>\
				<br>\
				<button type="button" class="btn btn-link btn-sm clear text-muted mt-1">Cancel</button>\
				</div>';

			var toast = toastr.info(body, 'Change billing option');

			resetToastrOptions();

			//Bind toast events
			if(typeof toast !== 'undefined'){
				//When user chooses to apply changes to past logs as well
			    if (toast.find('#applyPast').length) {
			        toast.delegate('#applyPast', 'click', function () {
		            	
		            	updateBillingOption(t, applyHourValuePerTeam, saveBtn);

		            	Meteor.call('userLogs.updateBillingOption', t.data.project, applyHourValuePerTeam, function(err, data){
		            		if(!err){
		            			toastr.success('Changed hour rate for past logs.');
		            		}
		            		else{
		            			toastr.error('Error changing hour rate for past logs!');
		            		}
		            	});
			            toast.remove();
			        });
			    }

			    //When user chooses to apply changes to future logs only
			    if (toast.find('#applyFuture').length) {
			        toast.delegate('#applyFuture', 'click', function () {	
			        	updateBillingOption(t, applyHourValuePerTeam, saveBtn);
						toast.remove();
			        });
			    }

				if (toast.find('.clear').length) {
				    toast.delegate('.clear', 'click', function () {
				        toast.remove();
				    });
				}
			}
		}
	},
});

updateBillingOption = function(t, applyHourValuePerTeam, saveBtn){
	console.log('updateBillingOption: ' + applyHourValuePerTeam);
	if(applyHourValuePerTeam === 'true'){
		console.log('same value for all team members')
		var projectHourValue = $('#projectHourValue').val();
		Meteor.call('project.updateHourBillingOption', t.data.project._id, applyHourValuePerTeam, projectHourValue, function(err, data){
			if(!err){
				saveBtn.removeAttr('data-valueperteam').addClass('hidden');
				toastr.success('Changed billing option to same hour rate for all team members.')
			}
			else{
				toastr.error('Error changing billing option');
			}
		});
	}
	else{
		console.log('individual value per§ team members')
		Meteor.call('project.updateHourBillingOption', t.data.project._id, applyHourValuePerTeam, 0, function(err, data){
			if(!err){
				saveBtn.removeAttr('data-valueperteam').addClass('hidden');
				toastr.success('Changed billing option to individual team members\' hour rate.')
			}
			else{
				toastr.error('Error changing billing option');
			}
		});
	}
}