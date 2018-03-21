Router.route('/plugins',{
	name: 'choosePlugins',
	controller: 'PrivateController',
	action: function(){		
		document.title = 'Browse Plugins - Opz.io';
		
		this.render();

		Session.set('currentHash','browsePlugins');
		
		Session.set('menuTitle', 'Plugins');
		//Render menu with actions
		this.render('pluginsMenu',{
			to: 'secondaryMenuArea',
		});
	},
});