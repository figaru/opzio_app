$('body').click(function(e){

	//console.log(e.target)

	//Hide daterange input on mobile
	if(e.target.id !== 'dateRangeAnchor' && e.target.id !== 'dateRangeInput' && !$(e.target).hasClass('fa-calendar') && !$(e.target).hasClass('range-shifter')){
		if( $('.dateRange-group').hasClass('shown') ) $('.dateRange-group').delay(1000).removeClass('shown')
	}

	//Hide notification menu
	// if(!$(e.target).hasClass('notifications-anchor') && !$(e.target).hasClass('fa-bell') && !$(e.target).hasClass('notification-tab') && !$(e.target).hasClass('notification-list-item')){
	// 	if( $('#notificationMenu').hasClass('expanded') ) $('#notificationMenu').removeClass('expanded');
	// }
	
	//Collapse Panels
	if($(e.target).hasClass('collapse-panel') /*|| $(e.target).hasClass('fa-angle-up') || $(e.target).hasClass('fa-angle-down')*/){
		$(e.target).closest('.panel').toggleClass('collapsed');
		reloadMasonry();
	}
});