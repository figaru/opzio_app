Meteor.methods({
	'getOranizationUserStats': function(params){
		if(!this.userId){ return; }

		var user = Meteor.users.findOne({_id: this.userId});
		if(typeof user !== 'undefined'){
			var organization = user.profile.organization;
		}
		else{
			return;
		}

		var totalUsers = Meteor.users.find({'profile.organization':organization}).count();

		var startDate = params.startDate;
		var endDate = params.endDate;
		var range = params.range;
		//var offset = params.offset;

		var users = UserLogs.aggregate([
			{
				$match:{
						organization: organization,
						createDate:{
							$gte: new Date(startDate),
							$lt: new Date(endDate)
					}
				}
			},
			{
			    $group:{
			        _id: {
			            user: '$user',
			        },
			        totalTime:{
			            $sum: '$totalTime'
			        },
			        date:{
			            $min: '$createDate',
			        },
			    },
			},
		]);

		return {
			'users': users,
		};
	},
	'users.getUsersLeaderboard': function(params){

			if(typeof this.userId === 'undefined'){
				return;
			}

			var user = Meteor.users.findOne({_id: this.userId });

			var startDate = params.startDate;
			var endDate = params.endDate;
			var range = params.range;
			var offset = params.offset;

			var sharedProjects = Projects.aggregate([
				{
					$match:{
						'$or': [
						    { 'owner': {'$in': [this.userId] } },
						    { 'visibility': 2 },
						    { '$and': [{'visibility': 1, 'team.user': this.userId}]},
						    { '$and': [{'visibility': 0, 'team.user': this.userId}]},
						],
					}
				},
				{
					$group:{
						_id: null,
						projectIDs:{
							$addToSet: '$_id'
						}
					}
				},
			]);

			var logs = UserLogs.aggregate([
				{
				    $match:{
				        createDate:{
		                    $gte: new Date(startDate),
		                    $lt: new Date(endDate)
		                },
		                'private': false,
						'validated': true,
		                'project._id':{
		                	$in: sharedProjects[0].projectIDs
		                },
		                'project._id':{
		                	$nin: ['', null]
		                },
				    	'organization': user.profile.organization,
				    }
				},
				{
				    $project:{
				        _id: '$user',
				        totalTime: '$totalTime',
				        validatedTime:{
				            $cond: {
				                if: { $eq: ['$validated', true] },
				                then: '$totalTime',
				                else: 0,
				            }
				        },
				        /*
				        unknownTime:{
				            $cond: {
				                if: { $eq: ['$validated', false] },
				                then: '$totalTime',
				                else: 0,
				            }
				        },
				        */
				    }
				},
				{
				    $group:{
				        _id: '$_id',
				        totalTime:{
				            $sum: '$totalTime'
				        },
				        validatedTime:{
				            $sum: '$validatedTime'
				        },
				        /*
				        unknownTime:{
				            $sum: '$unknownTime'
				        },
				        */
				    }
				},
				{
				    $sort:{
				        totalTime: -1,
				    }
				},
				{
					$limit: 10
				}
			]);//End aggregation

			return logs;
	}
});