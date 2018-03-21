initUserDashboardJoyride = function(dashboardOnly){
	
	$(window).joyride('destroy');

	//A joyride centered on the dashboard only
	if(dashboardOnly){
		$('body').append('<ol id="userDashboardJoyrideTips">\
			<li>\
				<h4><i class="fa fa-info-circle"></i> User Dashboard</h4>\
				<br>\
				<p>This is your personal dashboard where you can see your activity.</p>\
				<p>Only you can have a complete overview of your activities, other users can only see what you set as public.</p>\
				<span class="pull-left">1/5</span>\
			</li>\
			<li data-id="secondary-menu" class="mtop">\
				<p>The secondary menu has dashboard specific navigation and actions.<br>Click here to go to your settings, timesheet or trigger this walkthrough again.</p>\
				<span class="pull-left">2/5</span>\
			</li>\
			<li data-id="dateRangeMenuArea-tip" class="mtop">\
				<p>You can change the time period you\'re viewing for this or any other dashboard using the arrows or selecting a specific range by clicking on the date.<br>You can use your keyboard arrows as well to navigate between periods.</p>\
				<span class="pull-left">3/5</span>\
			</li>\
			<li data-id="modal-menu" class="mtop" data-options="tipLocation:top;nubPosition:top-right" >\
				<p>Finally, the actions menu lets you create projects, tasks or invite users.</p>\
				<span class="pull-left">4/5</span>\
			</li>\
			<li data-button="Got it!">\
				<h4>That\'s it!</h4>\
				<p>You can also have a complete walkthrough of Opz.io by clicking Help on the side menu to your left.</p>\
				<span class="pull-left">5/5</span>\
			</li>\
		</ol>');
	}
	//The whole tour, starting here and finishing on another dashboard
	else{
		if(isAdmin(Meteor.userId())){
			var tipElements = [];

			tipElements.push('\
				<li data-button="Start" class="modal-guide welcome hide-next-button">\
					<h4><i class="fa fa-info-circle"></i> User Dashboard</h4>\
					<br>\
					<p>We\'ve prepared a quick walkthrough to get you acquainted with Opz.io and get you ready to start using it.</p>\
					<p>This is your personal dashboard where you can see your activity.</p>\
					<p>Only you can have a complete overview of your activities, other users can only see what you set as public.</p>\
					<br><br>\
					<div class="align-center full-width">\
						<a href="#" class="joyride-next-tip custom">Let\'s Go</a>\
					</div>\
				</li>\
			');

			tipElements.push('\
				<li data-id="menu-trigger" class="mtop">\
					<p>The main menu <i class="fa fa-bars" style="font-size: 1.4em;line-height: 2rem;display: inline-block;margin:6px 5px 0;font-weight: 300;"></i> lets you navigate around diferent dashboards.</p>\
					<span class="pull-left">1/5</span>\
				</li>\
			');

			tipElements.push('\
				<li data-id="secondary-menu" class="mtop">\
					<p>The secondary menu has dashboard specific navigation and actions.</p>\
					<span class="pull-left">2/5</span>\
				</li>\
			');

			if(isFreePlan()){
				tipElements.push('\
					<li data-id="dateRangeMenuArea-tip" class="mtop">\
						<p>You can change the time period you\'re viewing by clicking on the date and selecting a predefined range.</p>\
						<span class="pull-left">3/5</span>\
					</li>\
				');
				tipElements.push('\
					<li data-id="modal-menu" class="mtop" data-options="tipLocation:top;nubPosition:top-right" >\
						<p>Finally, the actions menu lets you create projects.</p>\
						<span class="pull-left">4/5</span>\
					</li>\
				');
			}
			else{
				tipElements.push('\
					<li data-id="dateRangeMenuArea-tip" class="mtop">\
						<p>You can change the time period you\'re viewing using the arrows or selecting a predefined range by clicking on the date. <br>You can use your keyboard arrows as well to navigate between periods.</p>\
						<span class="pull-left">3/5</span>\
					</li>\
				');
				tipElements.push('\
					<li data-id="modal-menu" class="mtop" data-options="tipLocation:top;nubPosition:top-right" >\
						<p>Finally, the actions menu lets you create projects, tasks or invite users.</p>\
						<span class="pull-left">4/5</span>\
					</li>\
				');
			}

			if(hasInstalledPlugins()){
				tipElements.push('\
					<li data-options="nextButton:false;" class="hide-next-button">\
						<h4>Next Step: privacy settings!</h4>\
						<br>\
						<p>You already have installed plugin(s) so now you can check your overall privacy settings.</p>\
						<span class="pull-left">5/5</span>\
						<a href="#" id="sendUserToSettings" class="joyride-next-tip final">View Settings</a>\
					</li>\
				');
			}
			else{
				tipElements.push('\
					<li data-options="nextButton:false;" class="hide-next-button">\
						<h4>Next Step: plugins!</h4>\
						<br>\
						<p>Now let\'s install some plugins to start tracking your time and you\'ll be ready to go.</p>\
						<span class="pull-left">5/5</span>\
						<a href="/plugins" class="joyride-next-tip final">Install plugins</a>\
					</li>\
				');
			}


			var tipsListElement = '<ol id="userDashboardJoyrideTips">'+ tipElements.join('') +'</ol>';
			$('body').append(tipsListElement);
		}
		else{
			$('body').append('<ol id="userDashboardJoyrideTips">\
				<li data-button="Start" class="modal-guide welcome hide-next-button">\
					<div class="align-center">\
						<i class="twa twa-tada twa-3x"></i>\
						<h2>Welcome '+ Meteor.user().profile.firstName +'!</h2>\
					</div>\
					<br>\
					<div class="align-center">\
						<h4>You made the right choice in joining us in our quest to end time registration frustration!</h4>\
						<br>\
						<h4>We\'ve prepared a quick walkthrough to get you acquainted with Opz.io and get you ready to start using it.</h4>\
						<br><br>\
						<div class="align-center full-width">\
							<a href="#" class="joyride-next-tip custom">Let\'s Go</a>\
						</div>\
					</div>\
				</li>\
				<li data-id="menu-trigger" class="mtop">\
					<p>The main menu <i class="fa fa-bars" style="font-size: 1.4em;line-height: 2rem;display: inline-block;margin:6px 5px 0;font-weight: 300;"></i> lets you navigate around diferent dashboards.</p>\
				</li>\
				<li data-id="secondary-menu" class="mtop">\
					<p>The secondary menu has dashboard specific navigation and actions.</p>\
				</li>\
				<li data-id="dateRangeMenuArea-tip" class="mtop">\
					<p>You can change the time period you\'re viewing using the arrows or selecting a predefined period by clicking on the date.<br>You can use your keyboard arrows as well to navigate between periods.</p>\
				</li>\
				<li data-options="nextButton:false;" class="hide-next-button">\
					<h4>Next Step: plugins!</h4>\
					<br>\
					<p>Now let\'s install some plugins to start tracking your time and you\'ll be ready to go.</p>\
					<a href="/plugins" class="joyride-next-tip final">Install plugins</a>\
				</li>\
			</ol>');
		}
		
	}

	$("#userDashboardJoyrideTips").joyride({
		autoStart: true,
		/*
		postStepCallback: function(index, el){
			$(el).addClass('viewed');
		},
		*/
		postRideCallback: function(){
			Meteor.call('updateJoyride', 'userDashboard', false);
			if(Router.current().route.getName() === 'userDashboard'){
				Meteor.setTimeout(function(){
					window.location.hash = 'dashboard';
				},1);
			}
		}
	});

	$("#userDashboardJoyrideTips").remove();
	
	//Navigating to another page (i.e. going forward) will cause the tips to still be displayed
	//so we simply kill the curreny joyride instance and let the next template create a new one (if applicable)
	Tracker.autorun(function(c) {
		var route = Router.current();
		if(typeof route.params.userId !== 'string'){
			$(window).joyride('destroy');
			c.stop();
		}
	});
}