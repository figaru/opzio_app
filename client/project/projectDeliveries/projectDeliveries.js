Template.projectDeliveries.helpers({
	//Returns whether or not we want the tasklist to 
	//be responsive (when the lsit is empty of very small)
	'rwdTasklistLength': function(tasklists){
		if(tasklists.length >= 4){
			if(parseInt(Session.get('deviceWidth')) <= 976){ return false; }
			else{ return true; }
		}
	}
})