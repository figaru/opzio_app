Meteor.methods({
	'signupUser': function(email){
		Meteor.defer(function(){
			check(email, String);

			if(validateEmail(email)){
				console.log('valid email');

				//var rootUrl = process.env.ROOT_URL;
				var missingDays = moment().to(moment().month(10).date(30), true);

				var body = buildSignupEmail(missingDays);

				Signups.insert({
					createDate: new Date(),
					email: email,
				});

				try{
					Email.send({
						to: email,
						from: 'info@opz.io',
						subject: 'Opz.io Signup',
						html: body
					});

					Email.send({
						to: 'law@opz.io',
						from: 'info@opz.io',
						subject: 'New Signup',
						html: 'A user signed up on '+ moment().format('DD @ HH:mm') +' with the email ' + email
					});
				}
				catch(err){
					console.log('ERR: error sending signup email!')
				}

			}
		})
	},
	'registerDemoRequest': function(firstName, lastName, email){
		check(email, String);
		
		Signups.insert({
			createDate: new Date(),
			firstName: 'firstName', 
			lastName: 'lastName',
			email: email,
			type: 'demoRequest',
			revoked: false
		});

		var body = buildDemoEmail(firstName);

		try{
			Email.send({
				to: email,
				from: 'info@opz.io',
				subject: 'Opz.io Demo Request',
				html: body
			});

			Email.send({
				to: 'lawbraun.almeida@gmail.com',
				from: 'info@opz.io',
				subject: 'Demo Request - Opz.io',
				html: 'A user requested a DEMO on '+ moment().format('DD @ HH:mm') +' with the email ' + email
			});
		}
		catch(err){
			console.log('ERR: error sending signup email!')
		}
	},
});