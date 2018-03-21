Meteor.methods({
	'integrations.getMovesToken': function(code){
		check(code, String);
		const response = HTTP.call('POST',
			'https://api.moves-app.com/oauth/v1/access_token?grant_type=authorization_code&code='+code+'&client_id='+Meteor.settings.moves.client_id+'&client_secret='+Meteor.settings.moves.client_secret+'&redirect_uri=http://localhost:3000/integrations/moves');

		if('error' in response){

		}
		else{
			var userObj = Meteor.users.findOne({
				_id: this.userId,
				'trackers.tracker': 'moves',
			});

			//Already has tracker
			if(typeof userObj !== 'undefined'){

				var trackerSetting = userObj.trackers.filter(function( obj ) {
					return obj.tracker === 'moves';
				});

				if(trackerSetting.length > 0){
					if(trackerSetting[0].active){
						Meteor.users.update({
							_id: this.userId,
							'trackers.tracker': 'moves',
						},
						{
							$set:{
								'trackers.$.updateDate': new Date(),
								'trackers.$.access_token': response.data.access_token,
								'trackers.$.token_type': response.data.token_type,
								'trackers.$.expires_in': response.data.expires_in,
								'trackers.$.refresh_token': response.data.refresh_token,
								'trackers.$.user_id': response.data.user_id,
							}
						});
					}
					else{
						valid = false;
					}
				}
				else{
					Meteor.users.update({
						_id: this.userId,
					},
					{
						$push:{
							'trackers':{
								'tracker':	'moves',
								'updateDate': new Date(),
								'createDate': new Date(),
								'access_token': response.data.access_token,
								'token_type': response.data.token_type,
								'expires_in': response.data.expires_in,
								'refresh_token': response.data.refresh_token,
								'user_id': response.data.user_id,
								'active': true
							}
						}
					});
				}

			}
			else{
				Meteor.users.update({
					_id: this.userId,
				},
				{
					$push:{
						'trackers':{
							'tracker':	'moves',
							'updateDate': new Date(),
							'createDate': new Date(),
							'access_token': response.data.access_token,
							'token_type': response.data.token_type,
							'expires_in': response.data.expires_in,
							'refresh_token': response.data.refresh_token,
							'user_id': response.data.user_id,
							'active': true
						}
					}
				});
			}
		}

		return  response;
	},

	'integrations.revokeMoves': function(){
		let userObj = Meteor.users.findOne({ _id: this.userId });
		var trackers = userObj.trackers;
		let index = trackers.findIndex(x => x.tracker == "moves");
		trackers.splice(index,1);

		Meteor.users.update({
			_id: this.userId
		},
		{
			$set:{
				'trackers': trackers
			}
		});

	},
});