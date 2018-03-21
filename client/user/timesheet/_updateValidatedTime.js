//We panel & global time validation badges
_updateValidatedTime = function(){
	
	var totalValidTime = 0;
	var totalValidLogs = 0;
	var totalLogs = 0;

	var panels = $('.panel.hourLog');


	_.each(panels, function(el, k){
		
		var validLogs = $(el).find('tr[data-validated="true"]');
		var totalPanelLogs = $(el).find('tr[id]');

		totalValidLogs += validLogs.length;
		totalLogs += totalPanelLogs.length;
		
		_.each(validLogs, function(log, y){
			totalValidTime += parseFloat($(log).attr('data-totaltime'));
		});

		var panelBadgeClass = getBadgeStateClass(validLogs.length, totalPanelLogs.length);


		$(el).find('.valid-percent').removeClass('very-incomplete incomplete half-complete mostly-complete very-complete').addClass(panelBadgeClass);
	});

	var dailyBadgeClass = getBadgeStateClass(totalValidLogs, totalLogs);

	var dailyBadge = $('.filter-badge .stat');
	var content = dailyBadge.text().split('/');

	dailyBadge.removeClass('very-incomplete incomplete half-complete mostly-complete very-complete').addClass(dailyBadgeClass);
	dailyBadge.text(getStringFromEpoch(totalValidTime, true) + '/' + content[1]);

	//Add a tada emoji and display a success toast
	if(dailyBadgeClass === 'very-complete' && !Session.get('dailyValidQuota')){

		var randomHead = [ 'Yeah!', 'Well done!', 'Excellent!', 'Brilliant!', 'Yey!' ];

		var randomQuotes = [
			'Most of your time is valid for the day.',
			'You\'ve validated most of your time for the day.',
			'You\'ve validated most of your time!',
			'You\'ve validated most of your time for today!',
			'Most of your time has been validated for the day!'
		]
		
		//Don't display any more message if already reached quota
		Session.set('dailyValidQuota', true);

		dailyBadge.after('<i class="twa twa-tada twa-2x tooltipster icon-tooltip anim-shake" title="'+randomQuotes[Math.floor(Math.random() * randomQuotes.length)]+'"></i>');

		var body = '<div>'
					+'<p>'+ randomQuotes[Math.floor(Math.random() * randomQuotes.length)] +'</p>'
				+'</div>';


		//toastr.options.timeOut = 0;
		//toastr.options.extendedTimeOut = 0;

		toastr.success(body, randomHead[Math.floor(Math.random() * randomHead.length)]+' <i class="twa twa-tada anim-shake"></i>');

		
		Meteor.setTimeout(function(){
			dailyBadge.next().tooltipster({
				delay: 500,
				contentAsHTML: true,
				//trigger: 'click',
				interactive: true,
			});
		},500);
	}

}