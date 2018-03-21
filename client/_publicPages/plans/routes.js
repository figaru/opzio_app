Router.route('/plans',{
	name: 'plans',
	controller: 'PublicController',
	action: function(){
		this.render();

		if(typeof Session.get('billingCycle') === 'undefined'){
			Session.set('billingCycle', 'monthly');
		}

		this.render('plans',{
			to: 'mainContentArea',
		});
	}

});