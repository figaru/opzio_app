cleanRegisterForm = function(t, email, password, passwordConfirmation){
	var validForm = true;
	
	t.$('.error').text('').hide();
	t.$('.form-error').text('').hide();
	
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

cleanRegisterFinalStep = function(t, firstName, lastName, email, password, passwordConfirmation, organization){
	var reNames = new RegExp('^[A-Za-z\u00C0-\u017F\p{L}]+');
	var validForm = true;

	t.$('.error').text('').hide();
	t.$('.form-error').text('').hide();
	
	//Names validation (IMPROVE)
	if(firstName != "" && firstName != " " && firstName.length > 0){
		if(!reNames.test(firstName)){
			t.$('.firstNameError').text('Please insert a valid first name (letters and numbers).').show()
			validForm = false;
		}
	}
	else{
		t.$('.firstNameError').text('Please provide a first name.').show()
		validForm = false;
	}

	if(lastName != "" && lastName != " " && lastName.length > 0){
		console.log(reNames.test(lastName))
		if(!reNames.test(lastName)){
			t.$('.lastNameError').text('Please insert a valid last name (letters and numbers).').show()
			validForm = false;
		}
	}
	else{
		t.$('.lastNameError').text('Please provide a last name.').show()
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

	//Email
	if(organization.length === 0){
		t.$('.organizationError').text('Required field').show();
		validForm = false;
	}

	//Finally return valid state
	return validForm;
}

cleanRegisterInviteForm = function(t, firstName, lastName, email, password, passwordConfirmation){
	var reNames = new RegExp('^[A-Za-z\u00C0-\u017F\p{L}]+');
	var validForm = true;

	t.$('.error').text('').hide();
	t.$('.form-error').text('').hide();
	
	//Names validation (IMPROVE)
	if(firstName != "" && firstName != " " && firstName.length > 0){
		if(!reNames.test(firstName)){
			t.$('.firstNameError').text('Please insert a valid first name (letters and numbers).').show()
			validForm = false;
		}
	}
	else{
		t.$('.firstNameError').text('Please provide a first name.').show()
		validForm = false;
	}

	if(lastName != "" && lastName != " " && lastName.length > 0){
		console.log(reNames.test(lastName))
		if(!reNames.test(lastName)){
			t.$('.lastNameError').text('Please insert a valid last name (letters and numbers).').show()
			validForm = false;
		}
	}
	else{
		t.$('.lastNameError').text('Please provide a last name.').show()
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