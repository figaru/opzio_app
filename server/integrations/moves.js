Meteor.methods({
	'moves.getCurrentDay': function(){

		var userObj = Meteor.users.findOne({_id:this.userId});

		var trackerSetting = userObj.trackers.filter(function( obj ) { return obj.tracker === 'moves'; })[0];

		const response = HTTP.call(
			'GET',
			'https://api.moves-app.com/api/1.1/user/storyline/daily/20170507?access_token=' + trackerSetting.access_token
		);

		console.log(response)

		return  response;
	},
});