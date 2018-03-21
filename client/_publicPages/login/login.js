Template.login.onRendered(function(){
	new MaterialLabel();
	return;
	$('#password').on('change', function(){
		var el = $(this);
		if(el.val() > 0){

			console.log(el.val())
			el.focus()
			Meteor.setTimeout(function(){
				el.blur()
			}, 500)
		}
	});
});

Template.login.events({
	'submit #login-form' : function(e, t){
		e.preventDefault();
		
		var loginForm = $(e.currentTarget),
			submitBtn = loginForm.find('#loginButton');
		
		if (!submitBtn.is("[disabled]")) {

			var email = t.find('#email').value, 
				password = t.find('#password').value,
				validEmail = true,
				validPassword = true;

			// Todo-> Trim and validate input here
			if(email == '' || password == '') {
				//Materialize.toast('Please provide your email and password.', 4000, 'red');
				validEmail=false;
				validPassword=false;
			};

		  
			// If validation passes, supply the appropriate fields to the
			if (validEmail && validPassword) {
				submitBtn.attr('disabled','disabled').addClass('m-progress');
				
				Meteor.loginWithPassword(email, password, function(err){
					if (err){
						console.log(err)
						if (err.message = 'Incorrect password [403]') {
							submitBtn.removeClass('m-progress').removeAttr("disabled");
		        	  		toastr.error('Please check that your email/password are correct.');
		        		}
						else{
							submitBtn.removeClass('m-progress').removeAttr("disabled");
							toastr.error('Error loggin in.');
						}
					}
					else{
						submitBtn.removeClass('m-progress').removeAttr("disabled");
						_initDefaults();
						var userName = Meteor.user().profile.firstName + ' ' + Meteor.user().profile.lastName
						apiWorker.call('timeline.addEvent', Meteor.userId(), 'user_login', userName+' logged in', 'info');
						Router.go('userDashboard', { userId: Meteor.userId() }, { hash: 'dashboard' });
					}
				});
			}
			else{
				submitBtn.removeClass('m-progress').removeAttr("disabled");
				toastr.error('Plase insert your login credentials.');
			}
		}

	return false; 
	
	}
});