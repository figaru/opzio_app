Router.route('/thanks',{
	name: 'thankYou',
	controller: 'PublicController',
	action: function(){

		this.render();

		var className = 'purple';

		this.render('thankYou',{
			to: 'mainContentArea',
			data: function(){
				return {
					className: className,
				}
			}
		});
	},
});