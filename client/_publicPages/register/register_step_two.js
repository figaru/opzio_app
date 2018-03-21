Template.finishRegisterAccount.onRendered(function(){
	var email = Session.get('registerEmail');
	var password = Session.get('registerPassword');
	if(typeof email === 'undefined' || typeof email === 'undefined'){
		toastr.error('Please provide your email/password again.')
		Router.go('register');
	}
});

Template.finishRegisterAccount.events({
	//set data attribute when use choses plan
	'click .planOption': function(e){
		var optn = $(e.currentTarget);
		var dropdown  = optn.parent().parent();
		
		console.log(dropdown)

		dropdown.find('button').attr('data-plan', optn.attr('data-plan'));
		dropdown.find('.planText').text(optn.text());
	},
	'click #finishAccount': function(e, t){
		e.preventDefault();
		var submitBtn = $(e.currentTarget);
		var form = t.$('#registerForm');
		
		var email = Session.get('registerEmail');
		var password = Session.get('registerPassword');

		if(typeof email === 'undefined' || typeof email === 'undefined'){
			toastr.error('Please provide your email/password again.')
			Router.go('register');
		}

		var	firstName = form.find('#firstName').val(),
			lastName = form.find('#lastName').val(),
			organizationName = form.find('#organizationName').val(),
			planType = form.find('#teamSizeDropdown').attr('data-plan');

		console.log(firstName)
		console.log(lastName)
		console.log(email)
		console.log(password)
		console.log(password)
		console.log(organizationName)

		var validForm = cleanRegisterFinalStep(t, firstName, lastName, email, password, password, organizationName);

		console.log(planType)

		if(validForm){
			submitBtn.attr('disabled','disabled').addClass('m-progress');
			
			var userDate = moment().hour(18).minute(0).second(0).millisecond(0).toDate();
			
			Meteor.call('auth.registerUserAndOrganization', firstName, lastName, email, password, organizationName, planType, userDate, function(err, newOrgId){
				if (err) {
					submitBtn.removeClass('m-progress').removeAttr("disabled");
					console.log(err)
					if('error' in err){
						if(err.error === 403){
							toastr.error('This email has been taken, please choose another one to register.');
						}
					}
					else{
						toastr.error(err.reason, 'Registration error');
					}
				}
				else{
					//console.log('proceed to dashboard');
					
					// After successful registration, login user and redirect home. 
					Meteor.call('getOrganizationName', newOrgId, function(err, data){
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
													
						toastr.success('Thank you for registering!', 'Welcome to Opz.io');
						
						Router.go('userDashboard', {userId: Meteor.userId(), section:'dashboard'});

					});
				};
			});
		}
	}
	/*
	'click #createAccount': function(e, t){
		console.log('submitting form');
		e.preventDefault();

		var submitBtn = $(e.currentTarget);
		var form = t.$('#registerForm');

		submitBtn.attr('disabled','disabled').addClass('m-progress');

		var	firstName = form.find('#firstName').val(),
			lastName = form.find('#lastName').val(),
			email = form.find('#email').val(),
			password = form.find('#password').val(),
			organization = form.find('#organization').val(),
			orgIdInput = form.find('#orgId').val(),
			inviteToken = form.find('#inviteToken').val();

		//console.log('orgIdInput: ' + orgIdInput)

		var validForm = cleanRegisterForm(firstName, lastName, email, password)

		if(validForm){
			//console.log('valid form');
			$('#registerForm').slideUp();
			$('.panel-description').append('<div class="registerSuccess align-center" style="margin-top: 25px;"><i class="twa twa-tada twa-4x anim-shake"></i><h3>Welcome aboard!</h3><h4>We\'re initializing your account, you\'ll be redirected in a couple of seconds.</h4></div>')

			if(orgIdInput.length > 0){
				var data = {
					firstName: firstName, 
					lastName: lastName, 
					email: email, 
					password: password, 
					orgId: orgIdInput, 
					inviteToken: inviteToken
				}

				//console.log(data);

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
														
							Router.go('userDashboard', {userId: Meteor.userId()}, {hash:'dashboard'});

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
				Meteor.call('registerUserAndOrganization', firstName, lastName, email, password, organization, function(err, newOrgId){
					if (err) {
						submitBtn.removeClass('m-progress').removeAttr("disabled");
						console.log(err)
						if('error' in err){
							if(err.error === 403){
								toastr.error('Please choose another email to register.', 'This email has been taken');
							}
						}
						else{
							toastr.error(err.reason, 'Registration error');
						}
					}
					else{
						//console.log('proceed to dashboard');
						
						// After successful registration, login user and redirect home. 
						Meteor.call('getOrganizationName', newOrgId, function(err, data){
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
														
							toastr.success('Thank you for registering!', 'Welcome to Opz.io');
							
							
							// Meteor.setTimeout(function(){
							// 	checkForPlugins();
							// }, 8000);
							

							Router.go('userDashboard', {userId: Meteor.userId()}, {hash:'dashboard'});
						});
					};
				});
			}
		}
		else{
			submitBtn.removeAttr('disabled').removeClass('m-progress');
		}
	},
	*/
})