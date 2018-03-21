Template.inlineSignup.events({
	'mouseenter .signup-form': function(e, t){
		t.$('#email').focus();

		try{
			Meteor.clearTimeout(this.removeSmile);
		}
		catch(err){}

		t.$('.twa').removeClass('twa-cry twa-slightly-smiling-face twa-smile twa-smiling-face-with-sunglasses').addClass('twa-slightly-smiling-face');
		t.$('.twa').animate({
			'margin-left': '-20px',
			'opacity': '1'
		}, 500);
	},

	'mouseleave .signup-form': function(e, t){
		if(typeof t.$('#registerForm').attr('data-submitted') === 'undefined' || t.$('#registerForm').attr('data-submitted') === 'false'){
			t.$('.twa').removeClass('twa-slightly-smiling-face twa-smile twa-smiling-face-with-sunglasses').addClass('twa-cry');
		}
	},
	'mouseleave #inline-signup': function(e, t){
		if(t.$('#email').val() === ''){
			t.$('#email').blur();
		}

		if(typeof t.$('#registerForm').attr('data-submitted') === 'undefined' || t.$('#registerForm').attr('data-submitted') === 'false'){
			this.removeSmile = Meteor.setTimeout(function(){
				
				t.$('.twa').animate({
					'margin-left': '0px',
					'opacity': '0'
				}, 500);

				Meteor.setTimeout(function(){
					t.$('.twa').removeClass('twa-cry twa-smile twa-smiling-face-with-sunglasses').addClass('twa-slightly-smiling-face');
				}, 1000);
			}, 1000);
		}

	},
	'keyup #email': function(e, t){
		var email = e.currentTarget.value;
		var validIcon = t.$('.valid-form-icon');
		
		t.$('.twa').removeClass('twa-cry twa-slightly-smiling-face twa-smiling-face-with-sunglasses').addClass('twa-smile');
		
		if(validateEmail(email)){
			if(validIcon.hasClass('shown')){
				validIcon.removeClass('fa-close').addClass('fa-check');
			}
			else{
				validIcon.removeClass('fa-close').addClass('shown fa-check').slideDown();
			}
		}
		else{
			if(validIcon.hasClass('shown')){
				validIcon.removeClass('fa-check').addClass('fa-close');
			}
		}

	},
	'blur #email': function(e, t){
		var email = e.currentTarget.value;
		var form = t.$('#registerForm');
		var validIcon = t.$('.valid-form-icon');

		if(email.length > 0){
			

			if(validateEmail(email)){

				form.attr('data-valid', 'true');

				if(validIcon.hasClass('shown')){
					validIcon.removeClass('fa-close').addClass('fa-check');
				}
				else{
					validIcon.removeClass('fa-close').addClass('shown fa-check').slideDown();
				}

				t.$('.emailError').text('').hide();

				/*
				Meteor.call('checkForExistingEmail', email, function(err, data){
					
					//Taken email
					if(data){
						if(validIcon.hasClass('shown')){
							validIcon.removeClass('fa-close').addClass('fa-check');
						}

						t.$('.emailError').text('This email has been taken. Please chose another one.').show();

					}
					else{
						if(validIcon.hasClass('shown')){
							validIcon.removeClass('fa-close').addClass('fa-check');
						}
						else{
							validIcon.removeClass('fa-close').addClass('shown, fa-check').slideDown();
						}

						t.$('.emailError').text('').hide();
					}
				});
				*/
			}
			else{
				form.attr('data-valid', 'false');

				t.$('.emailError').text('This email doesn\'t seem to be valid.').show();

				if(validIcon.hasClass('shown')){
					validIcon.removeClass('fa-check').addClass('fa-close');
				}
				else{
					validIcon.addClass('shown, fa-close').removeClass('fa-check').slideDown();
				}
				//toastr.error('Please provide a valid email.', 'Invalid form');
			}
		}
		//Empty input
		else{
			
			t.$('.emailError').text('').hide();
			form.attr('data-valid', 'false');

			if(validIcon.hasClass('shown')){
				validIcon.removeClass('fa-check').addClass('fa-close').slideUp();
			}
		}
	},

	//Form submission
	'click #createAccount, submit #registerForm': function(e, t){
		
		var form = t.$('#registerForm');
		var validIcon = t.$('.valid-form-icon');
		var email = t.$('#email').val();

		if(form.attr('data-valid') === 'true'){
			
			form.attr('data-submitted', true);

			validIcon.parent().attr('disabled', true);

			validIcon.parent().css({'border-radius':'50%'}).html('<i class="fa valid-form-icon shown proceed-valid fa-check" style="display: inline-block;"></i>');



			t.$('.emailError').text('').hide();
			t.$('.twa').removeClass('twa-cry twa-smile twa-slightly-smiling-face').addClass('twa-smiling-face-with-sunglasses');
			

			var query = 'email='+email;

			Router.go('register', {}, {query: query, hash: 'inlineFreeRegistration'});
			

		}
		//Some error
		else{
			
			form.attr('data-submitted', false);

			if(validIcon.hasClass('shown')){
				validIcon.addClass('fa-close').removeClass('fa-check');
			}
			else{
				validIcon.removeClass('fa-check').addClass('shown fa-close').slideDown();
			}

			if(email.length <= 0){
				t.$('.emailError').text('Please provide an email.').show();
			}
		}

	}
});