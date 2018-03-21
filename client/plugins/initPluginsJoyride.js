initPluginsJoyride = function(dashboardOnly){

	$(window).joyride('destroy');

	if(dashboardOnly){
		$('body').append('<ol id="pluginsJoyrideTips">\
			<li data-options="nextButton:false;" class="hide-next-button">\
				<h4><i class="fa fa-info-circle"></i> Plugins</h4>\
				<br>\
				<p>Opz.io needs to be able to know about your activities so it can help you track your work. For that, you need to install one or more plugins depending on the type of work you do.</p>\
				'+currentBrowser()+'\
			</li>\
		</ol>');
	}
	else{
		$('body').append('<ol id="pluginsJoyrideTips">\
			<li data-options="nextButton:false;" class="hide-next-button">\
				<h4>Install Necessary Plugins</h4>\
				<br>\
				<p>Opz.io needs to be able to know about your activities so it can help you track your work. For that, you need to install one or more plugins depending on the type of work you do.</p>\
				'+currentBrowser()+'\
			</li>\
		</ol>');
	}

	$("#pluginsJoyrideTips").joyride({
		autoStart: true,
		postRideCallback: function(){
			console.log('finished plugins joyride');

			Meteor.call('updateJoyride', 'plugins', false);

			toastr.options.timeOut = 0;
			toastr.options.extendedTimeOut = 0;
			toastr.options.tapToDismiss = false;
			toastr.options.closeButton = true;

			if(Meteor.user().profile.hasTracker){
				var body = '<div>'
							+'<p>You can always check which plugins you are using by going to your user settings page.</p>'
							+'<button type="button" id="proceedToSettings" class="btn btn-primary pull-right">View my Settings</button>'
						+'</div>';
			}
			else{
				var body = '<div>'
							+'<p>After you finish installing your plugins, click the button below to go to your user settings page.</p>'
							+'<button type="button" id="proceedToSettings" class="btn btn-primary pull-right">View my Settings</button>'
						+'</div>';
				
			}

			var toast = toastr.info(body);
			
			resetToastrOptions();

			toast.delegate('#proceedToSettings', 'click', function () {
			    toast.remove();
			    $(window).joyride('destroy');
			   	Router.go('userSettings', { userId: Meteor.userId() });
			});

		}
	});

	$("#pluginsJoyrideTips").remove();

	Tracker.autorun(function(c) {
		var route = Router.current();
		if(route.route.getName() !== 'choosePlugins'){
			console.log('destroy plugins joyride')
			$(window).joyride('destroy');
			c.stop();
		}
	});

	$(document).on('click', '.close-modal-tip', function(){
		
		console.log('click close-modal-tip');

		$('.joyride-tip-guide').remove();
		$('.joyride-modal-bg').remove();

		Meteor.call('updateJoyride', 'plugins', false);
		//Display toastr to proceed to settings
		Meteor.setTimeout(function(){
			toastr.options.timeOut = 0;
			toastr.options.extendedTimeOut = 0;
			toastr.options.closeButton = true;
			toastr.options.tapToDismiss = false;

			if(Meteor.user().profile.hasTracker){
				var body = '<div>'
							+'<p>You can always check which plugins you are using by going to your user settings page.</p>'
							+'<button type="button" id="proceedToSettings" class="btn btn-primary pull-right">View my Settings</button>'
						+'</div>';
			}
			else{
				var body = '<div>'
							+'<p>After you finish installing your plugins, click the button below to go to your user settings page.</p>'
							+'<button type="button" id="proceedToSettings" class="btn btn-primary pull-right">View my Settings</button>'
						+'</div>';
				
			}


			var toast = toastr.info(body);
			
			resetToastrOptions();

			toast.delegate('#proceedToSettings', 'click', function () {
			    toast.remove();
			   	Router.go('userSettings', { userId: Meteor.userId() });
			});

		}, 2000);
	});

}

//Invistes the user to install a browser plugin if possible/not installed
currentBrowser = function(){
	var browser = Session.get('userBrowser');
	var hasBrowsing = hasBrowserTracker(Meteor.user());
	if(!hasBrowsing){
		if(typeof browser !== 'undefined'){
			switch(browser.name){
				case 'Chrome':
					return '<p>It looks you\'re using <span class="badge green">'+ browser.name +'</span> so why not <a class="close-modal-tip" href="#chrome-plugin">installing</a> it right away?</p>';
					break;

				case 'Firefox':
					return '<p>It looks you\'re using <span class="badge green">'+ browser.name +'</span> so why not <a class="close-modal-tip" href="#firefox-plugin">installing</a> it right away?</p>';
					break;

				case 'Opera':
					return '<p>It looks you\'re using <span class="badge green">'+ browser.name +'</span> so why not <a class="close-modal-tip" href="#opera-plugin">installing</a> it right away?</p>';
					break;

				default:
					return '<p><a class="close-modal-tip" href="#affix-plugins">Browse available plugins</a></p>';
					break;
			}
		}
	}
	else{
		return '<p>Looks you already have at least a browser plugin. You can <a class="close-modal-tip" href="#affix-plugins">browse other plugins</a>.</p>';
	}
};