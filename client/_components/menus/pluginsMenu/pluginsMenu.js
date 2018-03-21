Template.pluginsMenu.helpers({
	'menuTitle': function(){
		return Session.get('menuTitle')
	},
});

Template.pluginsMenu.events({
	'click #pluginsJoyride': function(e){
		e.preventDefault();
		
		var route = Router.current().route.getName();
		if(route === 'choosePlugins'){
			initPluginsJoyride(true);
		}
	}
});
