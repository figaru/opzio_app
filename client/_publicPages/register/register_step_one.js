Template.registerAccount.onRendered(function(){
	$('.side-content').removeClass('display');
	$('.gn-menu-main').removeClass('expanded');
	
	Meteor.setTimeout(function(){
		$('.side-content').addClass('display');
	}, 100);
});


Template.registerAccount.events({
	'blur #email': function(e){
		var email = e.currentTarget.value;
		if(email.length > 0){
			if(validateEmail(email)){
				Meteor.call('checkForExistingEmail', email, function(err, data){
					if(data){
						$('.emailError').text('This email has been taken. Please chose another one.')
					}
					else{
						$('.emailError').text('')
					}
				});
			}
			else{
				toastr.error('Please provide a valid email.', 'Invalid form');
			}
		}
	},
	'submit #registerForm': function(e, t){
		e.preventDefault();
		var submitBtn = $('#createAccount');
		var form = t.$('#registerForm');

		submitBtn.attr('disabled','disabled').addClass('m-progress');

		var email = form.find('#email').val(),
			password = form.find('#password').val(),
			passwordConfirm = form.find('#passwordConfirm').val();
		
		var validForm = cleanRegisterForm(t, email, password, passwordConfirm);

		submitBtn.removeAttr('disabled').removeClass('m-progress');

		if(validForm){
			Session.set('registerEmail', email);
			Session.set('registerPassword', password);
			Router.go('finishRegister');
		}


	}
});