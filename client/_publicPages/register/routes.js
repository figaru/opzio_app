Router.route('/create-account',{
	name: 'register',
	controller: 'PublicController',
	action: function(){

		params = this.getParams();
		
		var hash = params.hash;
		
		var query = params.query;

		//query should hold email key with user email
		if(Object.keys(query).length > 0){
			if('email' in query){
				Session.set('userSignupEmail', query['email']);
			}
		}

		var welcomeChoices = [
			{
				title: 'Ahoy!',
				body: 'One step closer to awesomeness!'
			},
			{
				title: 'Hey there!',
				body: 'Glad to see you on board.'
			},
			{
				title: 'Well hello!',
				body: 'We\'re glad you want to give it a try!'
			}
		];

		var randIndex = Math.floor(Math.random() * welcomeChoices.length);

		var welcomeText = welcomeChoices[randIndex];

		this.render();

		var className = '';

		this.render('registerAccount',{
			to: 'mainContentArea',
			data: function(){
				return {
					className: className,
					title: welcomeText.title,
					body: welcomeText.body,
				}
			}
		});
		this.render('publicNav',{ to: 'menuArea' });
		/*
		this.render('register',{
			to: 'mainContentArea',
			data: function(){
				return {
					className: className,
					title: welcomeText.title,
					body: welcomeText.body,
				}
			}
		});
		*/
	},
});

Router.route('/finish-register',{
	name: 'finishRegister',
	controller: 'PublicController',
	action: function(){

		params = this.getParams();
		
		var hash = params.hash;
		
		var query = params.query;

		//query should hold email key with user email
		if(Object.keys(query).length > 0){
			if('email' in query){
				Session.set('userSignupEmail', query['email']);
			}
		}

		var welcomeChoices = [
			{
				title: 'Ahoy!',
				body: 'One step closer to awesomeness!'
			},
			{
				title: 'Hey there!',
				body: 'Glad to see you on board.'
			},
			{
				title: 'Well hello!',
				body: 'We\'re glad you want to give it a try!'
			}
		];

		var randIndex = Math.floor(Math.random() * welcomeChoices.length);

		var welcomeText = welcomeChoices[randIndex];

		this.render();

		var className = '';

		this.render('finishRegisterAccount',{
			to: 'mainContentArea',
			data: function(){
				return {
					className: className,
					title: welcomeText.title,
					body: welcomeText.body,
				}
			}
		});
		this.render('publicNav',{ to: 'menuArea' });
		/*
		this.render('register',{
			to: 'mainContentArea',
			data: function(){
				return {
					className: className,
					title: welcomeText.title,
					body: welcomeText.body,
				}
			}
		});
		*/
	},
});

//For users invited to register
Router.route('/register/:inviteToken',{
	name: 'registerInvite',
	controller: 'PublicController',
	action: function(){

		params = this.getParams();
		hash = params.hash;
		inviteToken = params.inviteToken;

		var welcomeChoices = [
			{
				title: 'Ahoy!',
				body: 'One step closer to awesomeness!'
			},
			{
				title: 'Hey there!',
				body: 'Glad to see you on board.'
			},
			{
				title: 'Well hello!',
				body: 'We\'re glad you want to give it a try!'
			}
		];

		var randIndex = Math.floor(Math.random() * welcomeChoices.length);

		var welcomeText = welcomeChoices[randIndex];

		this.render();

		var route = this;

		var className = '';

		try{
			if(hash !== null){				
				var orgId = hash.split('&')[0];
				var email = hash.split('&')[1];
				var inviteToken = inviteToken;
			}


			className = 'purple';
			
			//Check if 
			if(typeof orgId !== 'undefined' && typeof email !== 'undefined'){
				console.log('validate invite')
				Meteor.call('auth.validateInvite', inviteToken, function(err, data){
					if(data.valid){
						route.render('registerInvite', {
							to: 'mainContentArea',
							data: function(){
								return {
									'orgName': data.organization,
									'orgId': data.orgId,
									'email': data.email,
									'inviteToken': data.inviteToken
								};
							},
						});
					}
					else{
						route.render('invalidRegisterToken', {
							to: 'mainContentArea'
						});

						toastr.warning('This invite is no longer active. Contact your organization admin(s) to request a new invite.');
						/*
						Meteor.setTimeout(function(){
							Router.go('home');
						}, 5000);
						*/
					}
				});
			}
			else{
				this.render('registerAccount',{
					to: 'mainContentArea',
					data: function(){
						return {
							className: className,
							title: welcomeText.title,
							body: welcomeText.body,
						}
					}
				});
				
			}
		}
		catch(err){
			console.log(err)
			this.render('registerAccount',{
				to: 'mainContentArea',
				data: function(){
					return {
						className: className,
						title: welcomeText.title,
						body: welcomeText.body,
					}
				}
			});
			//toastr.warning('Something went wrong with this invite. Request a new invite to your organization admin(s).');
		}
	},
});