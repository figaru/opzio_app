Router.route('/login',{
	name: 'login',
	controller: 'PublicController',
	action: function(){
		this.render();

		this.render('login',{
			to: 'mainContentArea',
		});

		this.render('publicFooter', {
			to: 'footerArea',
			data: function(){
				return {
					'fixed': false,
					'simple': true
				}
			}
		});
	}

});