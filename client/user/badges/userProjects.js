/*
	The Activity Chart for Organization Main Dashboard
*/

refreshUserTopProject = function(el){
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

	Meteor.call('users.getUserTopAllocation', callData, function(err, data){
		//console.log(data);
		if(!err){
			if(typeof data !== 'undefined'){
				if(data.length >= 2){
					//console.log('project lenght is 2: ' + data[0]._id + ', ' + data[1]._id)
					//Set metric content
					metric.html('<a href="/project/'+data[0]._id+'#dashboard" >'+getProjectFromID(data[0]._id)+'</a>');
					
					//description.html(prettyCount(data.validatedCount) +'/'+ prettyCount(data.totalCount));
					description.html('<a href="/project/'+data[1]._id+'#dashboard" >'+getProjectFromID(data[1]._id)+'</a>');
				}
				else if(data.length === 1){
					//console.log('project lenght is 1: ' + data[0]._id)
					//Set metric content
					metric.html('<a href="/project/'+data[0]._id+'#dashboard" >'+getProjectFromID(data[0]._id)+'</a>');
				}
				else{
					metric.html('N/A');
					description.html('Nothing logged yet');
				}
				initTooltips();
			}
			else{
				metric.html('N/A');
				description.html('Nothing logged yet');
			}
		}
	});
};

Template.userProjects.onRendered(function(){
	var el = Template.instance().$('.no-gauge');

	this.userTopProjects = Meteor.setInterval(function(){
		refreshUserTopProject(el);
	}, 60 * 1000);

	this.autorun(function(c) {
		var dateRange = Session.get('dateRange');
		
		refreshUserTopProject(el);
	});

});


Template.userProjects.onDestroyed(function(){
	Meteor.clearInterval(this.userTopProjects)
});