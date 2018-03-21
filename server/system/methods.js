Meteor.methods({
	'sendFeedbackMessage': function(message, wantSlack){
		check(message, String);
		check(wantSlack, Boolean);

		var user = Meteor.users.findOne({
			_id: this.userId
		});

		var userAddress = user.emails[0].address;

		console.log(message)
		console.log(wantSlack)

		if(message !== ''){
			try{
				Email.send({
					to: 'lawbraun.almeida@gmail.com',
					from: userAddress,
					subject: 'Opz.io User Feedback',
					html: 'On '+ moment().format('DD @ HH:mm') +':<br><br>'+'<p>'+message+'</p><br>Add to slack: ' + wantSlack
				});
				
				console.log('Feedback email dispatched');

			}
			catch(err){
				console.log('ERR: error sending user feedback email!');
			}
		}
	},
	'forceUsersLogout': function(){
		console.log('closing user connections')
		_.each(Meteor.default_server.sessions, function (session) {
			if(session.userId !== null){
				console.log('close session for ' + session.userId);
				
				var userId = session.userId;
				var newToken = Accounts._generateStampedLoginToken();

				console.log(newToken)
				console.log(Accounts._hashStampedToken(newToken))

				Meteor.users.update({
					_id: userId
				},{
					$set:{
						"services.resume.loginTokens": []
					},
				});

				Meteor.users.update({
					_id: userId
				},{
					$push: { 
						"services.resume.loginTokens": Accounts._hashStampedToken(newToken) 
					}
				});
			};
		});
	}
})