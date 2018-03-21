Template.projectDashboard.onRendered(function(){
	initMasonry();

	initTooltips();
})

Template.projectDashboard.onDestroyed(function(){
	Session.set('currentProject');
})