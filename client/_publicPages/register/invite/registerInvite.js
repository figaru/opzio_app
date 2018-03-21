Template.registerInvite.onRendered(function(){
	Meteor.setTimeout(function(){
		new MaterialLabel();
	}, 100)
})

Template.registerInvite.events({
	'submit #registerForm': function(e, t){
		e.preventDefault();
		var submitBtn = $('#createAccount');
		var form = t.$('#registerForm');

		submitBtn.removeAttr('disabled').addClass('m-progress');
		
		var	firstName = form.find('#firstName').val(),
			lastName = form.find('#lastName').val(),
			email = form.find('#email').val(),
			orgId = form.attr('data-organization'),
			inviteToken = form.attr('data-invitetoken'),
			password = form.find('#password').val(),
			passwordConfirm = form.find('#passwordConfirm').val();
		
		var validForm = cleanRegisterInviteForm(t, firstName, lastName, email, password, passwordConfirm);

		if(validForm){
			if(!$('#acceptTerms').is(':checked')){
				toastr.error('You must accept the terms & conditions of the service.')
				return;
			}
			console.log('valid')

			if(orgId.length > 0){
				var data = {
					firstName: firstName, 
					lastName: lastName, 
					email: email, 
					password: password, 
					orgId: orgId, 
					inviteToken: inviteToken,
					userDate: moment().hour(18).minute(0).second(0).millisecond(0).toDate()
				}

				Meteor.call('auth.registerInvitedUser', data, function(err, userOrgId){
					if(!err){
						// After successful registration, login user and redirect home.
						Meteor.call('getOrganizationName', userOrgId, function(err, data){
						    Session.setDefault('organizationName', data);
						    Session.set('menuTitle', data);
						});

						Meteor.loginWithPassword(email, password, function(err){
							
							var dateRange = {
								'startDate': moment().startOf('day').toISOString(),
								'endDate': moment().endOf('day').toISOString(),
								'range': 'day',
							    'verbosePeriod': 'Today',
							    'altVerbosePeriod': 'Daily',
							}
							Session.set('dateRange', dateRange);

							submitBtn.removeClass('m-progress').removeAttr("disabled");
														
							Router.go('userDashboard', {userId: Meteor.userId(), section:'dashboard'});

							toastr.success('Welcome to Opz.io!');

							
							// Meteor.setTimeout(function(){
							// 	checkForPlugins();
							// }, 8000);

						});
					}
					else{
						toastr.error('There was an erro processing your signup.');
						console.log(err);
					}
				})
			}
			else{
				toastr.warning('This invite no longer seems valid. Get in touch with your organization administrator to send a new account invitation.')
				Router.go('register');
			}

		}

	}
})