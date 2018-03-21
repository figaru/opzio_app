//import { moment } from 'meteor/momentjs:moment';

Meteor.methods({
	//Badges
	'getOrganizationActivity': function(params){
		this.unblock();
		//console.log('\n--- getOrganizationActivity ---')
		if(!this.userId){ return; }

		var user = Meteor.users.findOne({_id: this.userId});
		if(typeof user !== 'undefined'){
			var organization = user.profile.organization;
		}
		else{
			return;
		}
		var logs = [];
		var startDate = params.startDate;
		var endDate = params.endDate;
		var range = params.range;
		var offset = params.offset;

		//console.log('range: ' + range)
		/*
		console.log('startDate ' + startDate)
		console.log('startDate ' + new Date(startDate))
		console.log('endDate ' + endDate)
		console.log('endDate ' + new Date(endDate))
		console.log('offset is ' + offset)
		console.log('-------------------------------')
		*/

		//General aggregation by hour
		if(range === 'day'){
			
			logs = UserLogs.aggregate([
				{
					/*
					Match logs between date A and B, with non null/empty project field 
					for organization X, that are either validated or where private
					is set to true but current user is owner of log.
					*/
				    $match:{
				    	organization: organization,
				    	'$or': [
							{ validated: true},
							{ project:{ $nin: ['', 'null'] } },
							{ $and:[
									{ private: true },
									{ user: this.userId },
								]
							},
						],
				        createDate:{
				            $gte: new Date(startDate),
				            $lt: new Date(endDate)
				        }
				    }
				},
				{
					$project:{
						_id: '$_id',
						user: '$user',
						createDate: '$createDate',
						totalTime: '$totalTime',
						validatedTime:{
						    $cond: {
						        if: { $eq: ['$validated', true] },
						        then: '$totalTime',
						        else: 0,
						    }
						},
						unknownTime:{
						    $cond: {
						        if: { $eq: ['$validated', false] },
						        then: '$totalTime',
						        else: 0,
						    }
						},
					}
				},
				/*
				Group by user and hour (so we can later push the user values to an array).
				Sum total, validated & unknown
				*/
				{
					'$group':{
						_id: {
							'user': '$user',
							'hour': {'$hour': '$createDate'},
						},
						totalTime:{
						    '$sum': '$totalTime'
						},
						validatedTime:{
						    '$sum': '$validatedTime'
						},
						unknownTime:{
						    '$sum': '$unknownTime'
						},
						date:{
						    '$min': '$createDate'
						},
					}
				},
				/*
				Finally, group by hour (becomes id of document).
				Sum total, validated & unknown (represents the organization as a whole),
				calculate hourly avg from totalTime (organization avg) and push to an array
				the user values.
				*/
				{
					'$group':{
						_id: '$_id.hour',
						totalTime:{
						    '$sum': '$totalTime'
						},
						validatedTime:{
						    '$sum': '$validatedTime'
						},
						unknownTime:{
						    '$sum': '$unknownTime'
						},
						avgTime:{
						    '$avg': '$totalTime'
						},
						date:{
						    '$min': '$date'
						},
						users:{
							$push:{
								user: '$_id.user',
								totalTime: '$totalTime'
							}
						}
					}
				},
				/*
				{
					$sort:{
						_id: 1
					}
				}
				*/
			]);
		}
		//General aggregation by day
		else{
			logs = UserLogs.aggregate([
				{
				    $match:{
						organization: organization,
						createDate:{
						    $gte: new Date(startDate),
						    $lte: new Date(endDate)
						},
						'$or': [
							{ validated: true},
							{ project:{ $nin: ['', 'null'] } },
							{ $and:[
									{ private: true },
									{ user: this.userId },
								]
							},
						],
				    }
				},
				//Projection simply to correct date with user timezone offset
				{
				    $project:{
				        _id: '$_id',
				        createDate: '$createDate',
				        localDate : {      
				            "$add" : [      
				                "$createDate",
				                {      
				                    "$add" : [
				                        {     
				                            "$multiply" : [      
				                                 offset, //hour
				                                 60, //minute
				                                 60, //second
				                                 1000 //millisecond
				                            ]      
				                        }      
				                    ]      
				                }      
				            ]      
				        },
				        totalTime : '$totalTime',
				        validated: '$validated',
				    }
				},
				//Projection to retrieve day of month, month and year, as well as calculate the total known and unknown time
				{
				    $project:{
				        _id:{ 
							'day': {'$dayOfMonth': '$localDate' },
							'month': {'$month': '$localDate' },
							'year': {'$year': '$localDate' },
				        },
				        createDate : '$createDate',
				        localDate : '$localDate',
				        totalTime : '$totalTime',
				        validatedTime:{
				            $cond: {
				                if: { $eq: ['$validated', true] },
				                then: '$totalTime',
				                else: 0,
				            }
				        },
				        unknownTime:{
				            $cond: {
				                if: { $eq: ['$validated', false] },
				                then: '$totalTime',
				                else: 0,
				            }
				        },
				    }
				},
				{
				    $group:{
				        _id: {
				            //Group by user to get user's totalTime
				            //'user': '$user',
				            'day':'$_id.day',
				            'month':'$_id.month',
				            'dayOfYear': {'$dayOfYear': '$localDate'},
				        },
				        totalTime:{
				            $sum: '$totalTime'
				        },
				        validatedTime:{
				            '$sum': '$validatedTime'
				        },
				        unknownTime:{
				            '$sum': '$unknownTime'
				        },
				        date:{
				                $max: '$createDate',
				        },
				        localDate:{
				                $max: '$localDate',
				        },
				    },
				},
				/*
				{
				    $group:{
				        _id: {
				            'day':'$_id.day',
				            'month':'$_id.month',
				            'dayOfYear': '$_id.dayOfYear'
				        },
				        totalTime:{
				            '$sum': '$totalTime'
				        },
				         validatedTime:{
				            '$sum': '$validatedTime'
				        },
				        unknownTime:{
				            '$sum': '$unknownTime'
				        },
				        date:{
				            '$max': '$date',
				        },
				        localDate:{
				            '$max': '$localDate',
				        },
				        objectList:{
							$addToSet: '$_id.user',
						},
				        users:{
				            $push:{
				                user: '$_id.user',
				                totalTime: '$totalTime'
				            }
				        }
				    },
				},
				*/
				{
				    $sort:{
				        '_id.month': 1,
				        '_id.dayOfYear': 1,
				    }
				},
			]);
		}
		//End range if
		
		//console.log('Returning aggregation')
		//console.log(logs.length)

		return logs;
	},
	'getOrganizationTime': function(params){

		if(!this.userId){ throw new Meteor.Error(500, 'No user found. Please login again.'); }

		var user = Meteor.users.findOne({_id: this.userId});
		
		if(typeof user !== 'undefined'){
			var organization = user.profile.organization;
		}
		else{
			return;
		}

		var startDate = params.startDate;
		var endDate = params.endDate;
		var range = params.range;
		var offset = params.offset;
		
		var logs = UserLogs.aggregate([
			{
				$match:{
					organization: organization,
					'$or': [
						{ validated: true},
						{ project:{ $nin: ['', 'null'] } },
						{ $and:[
								{ private: true },
								{ user: this.userId },
							]
						},
						{ $and:[
								{ validated: false },
								{ user: this.userId },
							]
						},
					],
				    createDate:{
				        $gte: new Date(startDate),
				        $lt: new Date(endDate)
				    }
				}
				/*
			    $match:{
			    	organization: organization,
			    	private: false,
			        createDate:{
	                    $gte: new Date(startDate),
	                    $lt: new Date(endDate)
	                }
			    }
			    */
			},
			{
			    $project:{
			        _id: '$_id',
			        organization: '$organization',
			        validated: '$validated',
			        priave: '$private',
			        totalTime: '$totalTime',
			        utcDate: '$createDate',
			        localDate : {      
			            "$add" : [      
			                 "$createDate",
			                 {      
			                      "$add" : [
			                           {     
			                                "$multiply" : [      
			                                     offset, //hour
			                                     60, //minute
			                                     60, //second
			                                     1000 //millisecond
			                                ]      
			                           }      
			                      ]      
			                 }      
			            ]      
			        },
			    }
			},
			{
			    $project:{
			        _id:{
			            'day': {'$dayOfMonth': '$localDate' },
			        },
			        organization: '$organization',
			        totalTime: '$totalTime',
			        createDate: '$utcDate',
			        validatedTime:{
			            $cond: {
			                if: { $eq: ['$validated', true] },
			                then: '$totalTime',
			                else: 0,
			            }
			        },
			        unknownTime:{
			            $cond: {
			                if: { $eq: ['$validated', false] },
			                then: '$totalTime',
			                else: 0,
			            }
			        },
			    }
			},
			{
			    $group:{
			        _id: {
			            day: '$day',
			            organization: '$organization'
			        },
			        totalTime:{
			            '$sum': '$totalTime'
			        },
			        validatedTime:{
			            '$sum': '$validatedTime'
			        },
			        unknownTime:{
			            '$sum': '$unknownTime'
			        },
			    }
			}
		]);//End aggregation

		if(logs.length > 0){
			return logs[0];	
		}
		else{
			return {
				totalTime: 0,
				totalCount: 0,
				validatedTime: 0,
				validatedCount: 0,
				unknownTime: 0,
				unknownCount: 0,
			}
		}
	},
	'getOrganizationVariation': function(params){
		if(!this.userId){ throw new Meteor.Error(500, 'No user found. Please login again.'); }

		var user = Meteor.users.findOne({_id: this.userId});
		
		if(typeof user !== 'undefined'){
			var organization = user.profile.organization;
		}
		else{
			return;
		}

		var startDate = params.startDate;
		var endDate = params.endDate;
		var range = params.range;
		var offset = params.offset;

		//console.log('get variation for range ' + range)

		switch(range){
			case 'day':
				var prevStartDate = moment(startDate).subtract(1, 'days').startOf('day').toISOString();
				var prevEndDate = moment(endDate).subtract(1, 'days').endOf('day').toISOString();
				break;
			case 'week':
				var prevStartDate = moment(startDate).subtract(6, 'days').startOf('day').toISOString();
				var prevEndDate = moment(endDate).subtract(6, 'days').endOf('day').toISOString();
				break;
			case 'month':
				var prevStartDate = moment(startDate).subtract(1, 'months').startOf('day').toISOString();
				var prevEndDate = moment(endDate).subtract(1, 'months').endOf('day').toISOString();
				break;
		}

		//console.log(startDate)
		//console.log(prevStartDate)
		//console.log(endDate)
		//console.log(prevEndDate)

		var periodData = UserLogs.aggregate([
			{
			    $match:{
			    	organization: organization,
			    	private: false,
			        createDate:{
	                    $gte: new Date(prevStartDate),
	                    $lt: new Date(endDate)
	                }
			    }
			},
			{
			    $project:{
			        _id: '$_id',
			        validated: '$validated',
			        totalTime: '$totalTime',
			        createDate: '$createDate',
			        group:{
			        	$cond:{
			        		if:{ $lte: ['$createDate', new Date(prevEndDate)] },
			        		then: 'previous',
			        		else: 'current'
			        	}
			        },
			        localDate : {      
			            "$add" : [      
			                 "$createDate",
			                 {      
			                      "$add" : [
			                           {     
			                                "$multiply" : [      
			                                     offset, //hour
			                                     60, //minute
			                                     60, //second
			                                     1000 //millisecond
			                                ]      
			                           }      
			                      ]      
			                 }      
			            ]      
			        },
			    }
			},
			{
			    $project:{
			        _id:{
			            'day': {'$dayOfMonth': '$localDate' },
			        },
			        totalTime: '$totalTime',
			        group: '$group',
			        createDate: '$createDate',
			        validatedTime:{
			            $cond: {
			                if: { $eq: ['$validated', true] },
			                then: '$totalTime',
			                else: 0,
			            }
			        },
			    }
			},
			{
			    $group:{
			        _id: '$group',
			        minDate: {
			        	$min: '$createDate'
			        },
			        maxDate: {
			        	$max: '$createDate'
			        },
			        totalTime:{
			            '$sum': '$totalTime'
			        },
			        validatedTime:{
			            '$sum': '$validatedTime'
			        },
			    }
			}
			/**/
		]);//End aggregation

		return periodData;
	},
	'organization.getLastActiveUser': function(params){
		if(!this.userId){ return; }
		var startDate = params.startDate;

		var user = Meteor.users.findOne({_id:this.userId});
		var orgId = user.profile.organization;

		var log = UserLogs.find({
			organization: orgId,
			private: false,
			createDate:{
				$gte: new Date(startDate)
			}
		},
		{
			sort:{
				updateDate: -1
			},
			fields:{
				user: 1,
				updateDate: 1
			},
			limit: 1
		}).fetch();

		return log;
	},
	'getActiveUsers': function(params){
		if(!this.userId){
			return;
		}

		var user = Meteor.users.findOne({_id: this.userId});
		if(typeof user !== 'undefined'){
			var organization = user.profile.organization;
		}
		else{
			return;
		}

		var totalUsers = Meteor.users.find({
			'active': true,
			'profile.organization':organization
		}).count();

		var startDate = params.startDate;
		var endDate = params.endDate;
		var range = params.range;
		//var offset = params.offset;

		var activeUsers = UserLogs.aggregate([
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
			            organization: '$organization',
			        },
			        count:{
			            $sum: 1
			        },
			        date:{
			            $min: '$createDate',
			        },
			    },
			},
			{
			    $group:{
			        _id: '$_id.organization',
			        count:{
			            $sum: 1
			        }
			    }
			},
		]);


		if(activeUsers.length > 0){
			var count = activeUsers[0].count
		}
		else{
			var count = 0;
		}

		return {
			'active': count,
			'total': totalUsers
		};

	},
	//Pie Chart
	'getOrganizationActivities': function(params){
		if(!this.userId){ throw new Meteor.Error(500, 'No user found. Please login again.'); }

		var user = Meteor.users.findOne({_id: this.userId});
		
		if(typeof user !== 'undefined'){
			var organization = user.profile.organization;
		}
		else{
			return;
		}

		let startDate = params.startDate;
		let endDate = params.endDate;
		let range = params.range;
		let offset = params.offset;

		//Check visibility authorization
		if(params.userId !== this.userId){
			if(isAdmin(this.userId)){
				var matchQuery = {
					organization: organization,
					category:{
						$ne: null
					},
					createDate:{
						$gte: new Date(startDate),
						$lt: new Date(endDate)
					}
				};
			}
			else{
				var matchQuery = {
					organization: organization,
					private: false,
					category:{
						$ne: null
					},
					createDate:{
						$gte: new Date(startDate),
						$lt: new Date(endDate)
					}
				};
			}
		}
		else{
			var matchQuery = {
				organization: organization,
				category:{
					$ne: null
				},
				createDate:{
					$gte: new Date(startDate),
					$lt: new Date(endDate)
				}
			};
		}

		var logs = UserLogs.aggregate([
			{
			    $match: matchQuery
			},
			{
			    $group:{
			        _id: '$category.category',
			        label: {
			        	$max: '$category.label'
			        },
			        totalCount:{ '$sum': 1 },
			        totalTime:{ '$sum': '$totalTime' },
			    }
			},
			{
				$sort:{
					totalTime: -1
				}
			}
		]);//End aggregation

		return logs;
	},
});