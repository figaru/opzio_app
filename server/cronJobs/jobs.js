/*
	A job that runs every hour and performs multiple tasks
*/
hourlyJob = function(){
	console.log('*** CRN: RUNNNING HOURLY JOB')

	//Check wether or not we should send the daily report to every active user
	var users = Meteor.users.find({
		active: true
	}).fetch();

	//console.log('for ' + users.length + ' users: ')

	
	for(var i=0; i<users.length; i++){
	
		//For now only perform actions for root users for test purposes
		Meteor.call('cron.userReports', users[i]);
		// if(users[i]._id === 'ov7wgeBLkbvwfXgA3'){
		// }
		

	}

	return hourlyJob;
}

projectTotalJob = function(){
	console.log('*** CRN: RUNNNING PROJECT TOTAL HOURS');

	var projects = Projects.find({
		active: true
	}).fetch()

	for(var i=0; i<projects.length; i++){
		Meteor.call('projects.crunchTotalTime', projects[i]._id);
	}


	return projectTotalJob;
}