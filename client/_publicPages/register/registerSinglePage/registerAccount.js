Template.registerAccount_deprec.onRendered(function(){

	var t = Template.instance();

	Meteor.setTimeout(function(){
		drawPage();
		//$('.side-content').addClass('display');
	}, 100);

	$(window).on('resize', function(){
		drawPage();
	});

	if(typeof Session.get('userSignupEmail') !== 'undefined'){
		t.$('#email').val(Session.get('userSignupEmail'));
	}

	Meteor.setTimeout(function(){
		t.$('#firstName').focus()
	}, 1500);
});

Template.registerAccount_deprec.events({
	//Clean errors if fields have values and errors were shown
	'blur #firstName': function(e, t){
		if(e.currentTarget.value.length > 0 && t.$('.firstNameError').text().length > 0){
			t.$('.firstNameError').text('').hide();
		}
	},
	'blur #lastName': function(e, t){
		if(e.currentTarget.value.length > 0 && t.$('.lastNameError').text().length > 0){
			t.$('.lastNameError').text('').hide();
		}
	},
	//Make sure email hasn't been used already and show/hide errors accordingly
	'blur #email': function(e, t){
		var email = e.currentTarget.value;
		
		if(email.length > 0){
			if(validateEmail(email)){
				t.$('.spinning-loader').show();
				Meteor.call('checkForExistingEmail', email, function(err, takenEmail){
					t.$('.spinning-loader').hide();
					if(takenEmail){
						t.$('.emailError').text('This email has been taken. Please chose another one.').show()
						t.$('#registerForm').attr('data-emailtaken', true);
					}
					else{
						t.$('#registerForm').removeAttr('data-emailtaken');
						t.$('.emailError').text('').hide()
					}
				});
			}
			else{
				t.$('.emailError').text('This email has been taken. Please chose another one.').show()
			}
		}
		else{
			t.$('.emailError').text('Required field').show();
		}
	},
	'blur #password': function(e, t){
		if(e.currentTarget.value.length > 0 && t.$('.passwordError').text().length > 0){
			t.$('.passwordError').text('').hide();
		}
	},
	'blur #confirmPassword': function(e, t){
		if(e.currentTarget.value.length > 0 && t.$('.confirmPasswordError').text().length > 0){
			t.$('.confirmPasswordError').text('').hide();
		}
	},

	//Validate form and proceed to user account creation if possible
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
			passwordConfirmation = form.find('#confirmPassword').val(),
			//organization = form.find('#organization').val(),
			orgIdInput = form.find('#orgId').val(),
			inviteToken = form.find('#inviteToken').val();

		console.log('orgIdInput: ' + orgIdInput)

		if(typeof form.attr('data-emailtaken') === 'undefined'){
			var validForm = cleanAccountRegisterForm(t, firstName, lastName, email, password, passwordConfirmation)
		}
		else{
			t.$('.emailError').text('This email has been taken. Please chose another one.').show()
		}


		if(validForm){
			console.log('valid form');

			$('.signupOverlay').animate({
				'height': '100%'
			}, 500);

			Meteor.setTimeout(function(){
				$('.signupOverlay').animate({
					'height': '0%'
				}, 500);
			},2000);
			

			return;
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
						/* After successful registration, login user and redirect home. */
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

							/*
							Meteor.setTimeout(function(){
								checkForPlugins();
							}, 8000);
							*/

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
						
						/* After successful registration, login user and redirect home. */
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
							
							/*
							Meteor.setTimeout(function(){
								checkForPlugins();
							}, 8000);
							*/

							Router.go('userDashboard', {userId: Meteor.userId()}, {hash:'dashboard'});
						});
					};
				});
			}
		}
		else{
			submitBtn.removeAttr('disabled').removeClass('m-progress');
		}
	}
});

var cleanAccountRegisterForm = function(t, firstName, lastName, email, password, passwordConfirmation){
	var reNames = new RegExp('^[A-Za-z\u00C0-\u017F\p{L}]+');

	var validForm = true;
	t.$('.error').text('').hide();
	
	//Names validation (IMPROVE)
	if(firstName != "" && firstName != " " && firstName.length > 0){
		if(!reNames.test(firstName)){
			$('#firstName').focus();
			t.$('.firstNameError').text('Please insert a valid first name (letters and numbers)').show();
			validForm = false;
		}
	}
	else{
		t.$('.firstNameError').text('Required field').show();
		$('#firstName').focus();
		validForm = false;
	}

	if(lastName != "" && lastName != " " && lastName.length > 0){
		//console.log(reNames.test(lastName))
		if(!reNames.test(lastName)){
			t.$('.lastNameError').text('Please insert a valid last name (letters and numbers)').show();
			validForm = false;
		}
	}
	else{
		t.$('.lastNameError').text('Required field').show();
		validForm = false;
	}

	//Email
	if(email.length === 0){
		t.$('.emailError').text('Required field').show();
		validForm = false;
	}
	else{
		if(!validateEmail(email)){
			t.$('.emailError').text('Please provide a valid email').show();
			validForm = false;
		}
	}

	//Test for symbols in passowrd -> [/\\|;!?#=&$§€£*%@<>"'^~ºª,()«»\[\]]


	//Password validation
	if(password.length >= 6 && passwordConfirmation.length >= 6){
		if(password !== passwordConfirmation){
			t.$('.confirmPasswordError').text('Passwords do not match.').show()
			validForm = false;
		}
	}
	else{
		//Password
		if(password.length === 0 || password.length < 6){
			t.$('.passwordError').text('Password length must be at least 6 characters.').show()
			validForm = false;
		}

		if(passwordConfirmation.length === 0 || passwordConfirmation.length < 6){
			t.$('.confirmPasswordError').text('Password length must be at least 6 characters.').show()
			validForm = false;
		}
	}


	//Finally return valid state
	return validForm;
}