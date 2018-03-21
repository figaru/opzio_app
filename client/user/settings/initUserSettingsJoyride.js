initUserSettingsJoyride = function(dashboardOnly){
	
	$(window).joyride('destroy');

	
	if(Meteor.user().profile.hasTracker){
		$('body').append('<ol id="userSettingsJoyrideTipes">\
			<li>\
				<h4><i class="fa fa-info-circle"></i> User Settings</h4>\
				<br>\
				<p>This page lets you change your info as well as other personal settings.<br>You can access it by clicking on your name when viewing your personal dashboard.</p>\
			</li>\
			<li data-id="userToken">\
				<p>Your unique token to identify your hearteats. Use it when installing technical plugins. For browsing and OS plugins it is synced when you login.</p>\
				<p><b>Do not share this with anyone or they could impersonate you!</b></p>\
				<span class="pull-left">1/5</span>\
			</li>\
			<li data-id="plugins" class="mbottom" data-options="tipLocation:top;">\
				<p>Here you can see the plugin types you have installed and when was the last time any data was received for each.</p>\
				<span class="pull-left">2/5</span>\
			</li>\
			<li data-id="tipActive" class="mtop">\
				<p>At any moment you can turn off specific plugins. These will still try to send heartbeats but Opz.io won\'t receive or process them.</p>\
				<span class="pull-left">3/5</span>\
			</li>\
			<li data-id="periods" class="mbottom" data-options="tipLocation:top;">\
				<p>You can specify when should your activity be sent and processed by Opz.io.</p>\
				<p><b>Tip:</b> if you wish to be tracked 24/7, tick all week days and select from 00:00 to 23:00 hours.</p>\
				<span class="pull-left">4/5</span>\
			</li>\
			<li data-id="rules" class="mbottom" data-options="tipLocation:top;">\
				<p>Opz.io creates default rules for every activity you may do (ex. visit a website, open a file, etc).</p>\
				<p>You can edit the default rules applied for each domain or application you use. You can specify rules for specific activities in your Timesheet.</p>\
				<span class="pull-left">5/5</span>\
			</li>\
		</ol>');
	}
	else{
		$('body').append('<ol id="userSettingsJoyrideTipes">\
			<li>\
				<h4><i class="fa fa-info-circle"></i> User Settings</h4>\
				<br>\
				<p>This page lets you change your info as well as other personal settings.<br>You can access it by clicking on your name when viewing your personal dashboard.</p>\
			</li>\
			<li data-id="userToken">\
				<p>Your unique token to identify your hearteats. Use it when installing technical plugins. For browsing and OS plugins it is synced when you login.</p>\
				<p><b>Do not share this with anyone or they could impersonate you!</b></p>\
				<span class="pull-left">1/5</span>\
			</li>\
			<li data-id="plugins" class="mbottom" data-options="tipLocation:top">\
				<p>Here you can see the plugin types you have installed and when was the last time any data was received for each.</p>\
				<p><b>Note:</b> If you\'ve just installed a plugin, give it some seconds before you can see it appear here.</p>\
				<span class="pull-left">2/5</span>\
			</li>\
			<li data-id="tipActive" class="mtop">\
				<p>At any moment you can turn off specific plugins. These will still try to send heartbeats but Opz.io won\'t receive or process them.</p>\
				<span class="pull-left">3/5</span>\
			</li>\
			<li data-id="periods" class="mbottom" data-options="tipLocation:top;">\
				<p>You can specify when should your activity be sent and processed by Opz.io.</p>\
				<p><b>Tip:</b> if you wish to be tracked 24/7, tick all week days and select from 00:00 to 23:00 hours.</p>\
				<span class="pull-left">4/5</span>\
			</li>\
			<li data-id="rules" class="mbottom" data-options="tipLocation:top;">\
				<p>Opz.io creates default rules for every activity you may do (ex. visit a website, open a file, etc).</p>\
				<p>You can edit the default rules applied for each domain or application you use. You can specify rules for specific activities in your Timesheet.</p>\
				<span class="pull-left">5/5</span>\
			</li>\
		</ol>');
	}



	$("#userSettingsJoyrideTipes").joyride({
		autoStart: true,
		postRideCallback: function(e){
			Meteor.call('updateJoyride', 'userSettings', false);
		}
	});

	$("#userSettingsJoyrideTipes").remove();
	
	//Navigating to another page (i.e. going forward) will cause the tips to still be displayed
	//so we simply kill the curreny joyride instance and let the next template create a new one (if applicable)
	Tracker.autorun(function(c) {
		var route = Router.current();
		if(route.route.getName() !== 'userSettings'){
			$(window).joyride('destroy');
			c.stop();
		}
	});
}