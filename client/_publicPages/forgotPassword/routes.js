Router.route('/forgot-password', {
	name: 'forgotPassword',
	controller: 'PublicController',
	action: function(){
		document.title = 'Forgot Password - Opz.io';

		this.render();

		this.render('forgotPassword',{
			to: 'mainContentArea',
		});
	}
});

Router.route('/reset-password/:token', {
	name: 'resetPassword',
	controller: 'PublicController',
	action: function(){
		Accounts._resetPasswordToken = this.params.token;

		document.title = 'Reset Password - Opz.io';

		this.render();

		this.render('resetPassword',{
			to: 'mainContentArea',
		});		
	}
});