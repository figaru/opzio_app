/*
	The Top Activity badge for User Main Dashboard
*/
/*
refreshUserTopActivity = function(el){
	//console.log('Refresh user activity')
	//console.log(Router.current().params.userId)

	var dateRange = Session.get('dateRange');
	var metric = el.find('.metric');
	var description = el.find('.description');

	var callData = {
		'userId': Router.current().params.userId,
		'startDate': dateRange.startDate,
		'endDate': dateRange.endDate,
		'range': dateRange.range,
		'offset': moment().utcOffset() / 60,
	}

	Meteor.call('users.getUserTopActivity', callData, function(err, data){
		//console.log(data)
		if(!err){
			if(typeof data !== 'undefined' && data.length > 0){
				//console.log(data)
				if(data.length >= 2){
					//Set metric content
					metric.html(data[0].label + ' <i class="fa fa-clock-o tooltipster" title="Total time: '+ getStringFromEpoch(data[0].totalTime) +'"></i>');
					
					//description.html(prettyCount(data.validatedCount) +'/'+ prettyCount(data.totalCount));
					description.html(data[1].label + ' <i class="fa fa-clock-o tooltipster" title="Total time: '+ getStringFromEpoch(data[1].totalTime) +'"></i>');

				}
				else if(data.length === 1){
					//Set metric content
					metric.html(data[0].label + ' <i class="fa fa-clock-o tooltipster" title="Total time: '+ getStringFromEpoch(data[0].totalTime) +'"></i>');
				}
				initTooltips();
			}
		}
	});
};

Template.userActivityBadge.onRendered(function(){
	//console.log('render user top project')
	var el = Template.instance().$('.no-gauge');

	this.userTopActivity = Meteor.setInterval(function(){
		refreshUserTopActivity(el);
	}, 60 * 1000);

	Tracker.autorun(function(c) {
		var dateRange = Session.get('dateRange');
		
		if(typeof Router.current().params.userId !== 'string' || Router.current().params.hash !== 'dashboard'){
			//console.log('kill user top activity badge')
			//Kill computation
			c.stop();
		}
		else{ refreshUserTopActivity(el); }
	});

});


Template.userActivityBadge.onDestroyed(function(){
	Meteor.clearInterval(this.userTopActivity)
});
*/