Router.route('/request-demo',{
	name: 'requestDemo',
	controller: 'PublicController',
	action: function(){

		params = this.getParams();
		hash = params.hash;

		var welcomeChoices = [
			{
				title: 'Ahoy!',
				body: 'Thanks for wanting to give us a try!'
			},
			{
				title: 'Hey there!',
				body: 'Glad to see you willing to join us.'
			},
			{
				title: 'Well hello!',
				body: 'We\'re glad you want to give it a try!'
			}
		];

		var randIndex = Math.floor(Math.random() * welcomeChoices.length);

		var welcomeText = welcomeChoices[randIndex];

		this.render();

		var className = 'purple';

		this.render('requestDemo',{
			to: 'mainContentArea',
			data: function(){
				return {
					className: className,
					title: welcomeText.title,
					body: welcomeText.body,
				}
			}
		});
	},
});