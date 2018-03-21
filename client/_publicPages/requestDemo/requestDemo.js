Template.requestDemo.onRendered(function(){
	$('.side-content').removeClass('display');
	$('.gn-menu-main').removeClass('expanded');
	
	Meteor.setTimeout(function(){
		$('.side-content').addClass('display');
	}, 100);
});


Template.requestDemo.events({
	'blur #email': function(e){
		var email = e.currentTarget.value;
		if(!validateEmail(email)){
			toastr.error('Please provide a valid email.', 'Invalid form');
		}
	},
	'click #requestDemo': function(e, t){
		console.log('submitting form');
		e.preventDefault();

		var submitBtn = $(e.currentTarget);
		var form = t.$('#demoForm');

		submitBtn.attr('disabled','disabled').addClass('m-progress');

		var	firstName = form.find('#firstName').val(),
			lastName = form.find('#lastName').val(),
			email = form.find('#email').val();

		var validForm = cleanDemoForm(firstName, lastName, email)

		if(validForm){
			console.log('valid form');
			$(".bottom-background").animate({ 
				'padding-top' : '200%',
				'padding-right' : 0,
				'padding-bottom' : 0,
				'padding-left' : 0,
			}, 2500);
			Meteor.call('registerDemoRequest', firstName, lastName, email, function(err){
				if(!err) {
					toastr.success('You request has been submitted.', 'Thank you!');
				}
				Meteor.setTimeout(function(){
					Router.go('thankYou');
				}, 2500);
			});
		}
		else{
			submitBtn.removeAttr('disabled').removeClass('m-progress');
		}
	}
});

var cleanDemoForm = function(firstName, lastName, email){
	var reNames = new RegExp('^[A-Za-z ]+$');
	
	//Names validation (IMPROVE)
	if(firstName != "" && firstName != " " && firstName.length > 0){
		if(!reNames.test(firstName)){
			$('#firstName').focus();
			toastr.error('Please insert a valid first name (letters and numbers).', 'Invalid form');
			return false;
		}
	}
	else{
		toastr.error('Please provide a first name.', 'Invalid form');
		$('#firstName').focus();
		return false;
	}

	if(lastName != "" && lastName != " " && lastName.length > 0){
		if(!reNames.test(lastName)){
			$('#lastName').focus();
			toastr.error('Please insert a valid last name (letters and numbers).', 'Invalid form');
			return false;
		}
	}
	else{
		$('#lastName').focus();
		toastr.error('Please provide a last name.', 'Invalid form');
		return false;
	}

	//Email
	if(email.length === 0){
		$('#email').focus();
		toastr.error('Please provide an email.', 'Invalid form');
		return false;
	}
	else{
		if(!validateEmail(email)){
			$('#email').focus();
			toastr.error('Please provide a valid email.', 'Invalid form');
		}
	}
	return true;
}