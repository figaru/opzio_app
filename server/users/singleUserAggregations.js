import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';


// Add rule to avoid overwhelming server with requests
/*
var perMinuteThreshold = {
	// userId: function (userId) {
	// 	return typeof userId === 'String';
	// },
	type: 'method', 
	name: 'users.getUserVariation'
}
*/

//DDPRateLimiter.addRule(perMinuteThreshold, 5, 60000);


/*Single user */
Meteor.methods({
	//Badges
	'users.getUserVariation': function(params){
		if(!this.userId){ throw new Meteor.Error(500, 'No user found. Please login again.'); }

		//console.log('[AGGREGATION] getUserVariation for ' + this.userId)

		if(typeof params.user === 'undefined'){
			var user = Meteor.users.findOne({_id: this.userId});
		}
		else{
			var user = params.user;
		}
		
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

		//console.log('startDate ' + startDate)
		//console.log('endDate ' + endDate)
		//console.log('prevStartDate ' + prevStartDate)
		//console.log('prevEndDate ' + prevEndDate)
		//console.log('----------------')

		if(params.userId !== this.userId){
			if(isRoot(this.userId)){
				var matchQuery = {
					organization: organization,
					user: params.userId,
					createDate:{
						$gte: new Date(prevStartDate),
						$lt: new Date(endDate)
					}
				};
			}
			else{
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
				var matchQuery = {
					organization: organization,
					user: params.userId,
					private: false,
					'project._id':{
						$in: sharedProjects[0].projectIDs
					},
					createDate:{
						$gte: new Date(prevStartDate),
						$lt: new Date(endDate)
					}
				};
			}
		}
		else{
			var matchQuery = {
				organization: organization,
				user: params.userId,
				createDate:{
					$gte: new Date(prevStartDate),
					$lt: new Date(endDate)
				}
			};
		}

		var periodData = UserLogs.aggregate([
			{
			    $match: matchQuery
			},
			{
			    $project:{
			        _id: '$_id',
			        validated: '$validated',
			        totalTime: '$totalTime',
			        createDate: '$createDate',
			        group:{
			        	$cond:{
			        		if:{ $lte: ['$createDate', new Date(startDate)] },
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
	'getUserTime': function(params){
		if(!this.userId){ throw new Meteor.Error(500, 'No user found. Please login again.'); }

		//console.log('[AGGREGATION] getUserTime for ' + this.userId)

		let startDate = params.startDate;
		let endDate = params.endDate;
		let range = params.range;
		let offset = params.offset;

		//Check visibility authorization
		if(params.userId !== this.userId){
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

			if(isRoot(this.userId)){
				var matchQuery = {
					user: params.userId,
					createDate:{
						$gte: new Date(startDate),
						$lt: new Date(endDate)
					}
				};
			}
			else{
				
				var matchQuery = {
					user: params.userId,
					private: false,
					'project._id':{
						$in: sharedProjects[0].projectIDs
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
				user: this.userId,
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
			    $project:{
			        validated: '$validated',
			        totalTime: '$totalTime',
			        hourRate: '$hourRate',
			    }
			},
			{
			    $project:{
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
			{
			    $group:{
			        _id: null,
			        totalCount:{ '$sum': 1 },
			        totalTime:{ '$sum': '$totalTime' },
			        validatedTime:{ '$sum': '$validatedTime' },
			        unknownTime:{ '$sum': '$unknownTime' },
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
	'users.getUserPerformance': function(params){
		if(!this.userId){ throw new Meteor.Error(500, 'No user found. Please login again.'); }

		//console.log('[AGGREGATION] getUserTime for ' + this.userId)

		let startDate = params.startDate;
		let endDate = params.endDate;
		let range = params.range;
		let offset = params.offset;

		//Check visibility authorization
		if(params.userId !== this.userId){
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

			if(isRoot(this.userId)){
				var matchQuery = {
					user: params.userId,
					createDate:{
						$gte: new Date(startDate),
						$lt: new Date(endDate)
					}
				};
			}
			else{
				
				var matchQuery = {
					user: params.userId,
					private: false,
					'project._id':{
						$in: sharedProjects[0].projectIDs
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
				user: this.userId,
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
			    $project:{
			        validated: '$validated',
			        totalTime: '$totalTime',
			        hourRate: '$hourRate',
			    }
			},
			{
			    $project:{
			        totalTime: '$totalTime',
			        totalHourRate:{ 
			        	$multiply: [ "$hourRate", {$divide:["$totalTime", 3600]} ] 
			        },
			        certainHourRate:{
			            $cond: {
			                if: { $eq: ['$validated', true] },
			                then: { $multiply: [ "$hourRate", {$divide:["$totalTime", 3600]} ] },
			                else: 0,
			            }
			        },
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
			        uncertainHourRate:{
			            $cond: {
			                if: { $eq: ['$validated', false] },
			                then: { $multiply: [ "$hourRate", {$divide:["$totalTime", 3600]} ] },
			                else: 0,
			            }
			        },
			    }
			},
			{
			    $group:{
			        _id: null,
			        totalCount:{ '$sum': 1 },
			        totalTime:{ '$sum': '$totalTime' },
			        validatedTime:{ '$sum': '$validatedTime' },
			        unknownTime:{ '$sum': '$unknownTime' },
			        totalBillableTime: { '$sum': '$totalHourRate' },
			        certainBillableTime:{ '$sum': '$certainHourRate' },
			        uncertainBillableTime:{ '$sum': '$uncertainHourRate' },
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
				totalBillableTime: 0,
				certainBillableTime: 0,
				uncertainBillableTime: 0,
			}
		}
	},
	'getUserTotalTime': function(userId, projectId){
		if(!this.userId){ throw new Meteor.Error(500, 'No user found. Please login again.'); }

		//console.log('[AGGREGATION] getUserTotalTime for ' + this.userId)

		/*
		var user = Meteor.users.findOne({_id: this.userId});
		if(typeof user !== 'undefined'){ var organization = user.profile.organization; }
		else{ return; }
		*/
		this.unblock();
		var userData = UserLogs.aggregate([
			{
			    $match:{
			    	user: userId,
			    	project: projectId,
		            private: false,
			    }
			},
			{
				$project:{
					_id: '$user',
					totalTime: '$totalTime',
					user: '$user',
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
					_id: '$_id',
					totalTime:{
						$sum: '$totalTime'
					},
					validatedTime:{
						$sum: '$validatedTime'
					},
					unknownTime:{
						$sum: '$unknownTime'
					},
				}
			},
		]);

		return userData;
	},
	'users.getUserTopAllocation': function(params){
			if(!this.userId){ throw new Meteor.Error(500, 'No user found. Please login again.'); }

			//console.log('[AGGREGATION] getUserTopAllocation for ' + this.userId)

			let startDate = params.startDate;
			let endDate = params.endDate;
			let range = params.range;
			let offset = params.offset;

			//console.log(params)

			//Check visibility authorization
			if(params.userId !== this.userId){

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

				if(isRoot(this.userId)){
					var matchQuery = {
						user: params.userId,
						createDate:{
							$gte: new Date(startDate),
							$lt: new Date(endDate)
						}
					};
				}
				else{
					var matchQuery = {
						user: params.userId,
						'project._id':{
							$in: sharedProjects[0].projectIDs
						},
						private: false,
						createDate:{
							$gte: new Date(startDate),
							$lt: new Date(endDate)
						}
					};
				}
			}
			else{
				var matchQuery = {
					user: this.userId,
					project:{ $ne: '' },
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
				    $project:{
				        _id: '$_id',
				        project: '$project',
				        validated: '$validated',
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
				    $group:{
				        _id: '$project._id',
				        project:{
				        	$max: '$project'
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
	'users.getUserTopActivity': function(params){
			if(!this.userId){ throw new Meteor.Error(500, 'No user found. Please login again.'); }

			//console.log('[AGGREGATION] getUserTopActivity for ' + this.userId)

			let startDate = params.startDate;
			let endDate = params.endDate;
			let range = params.range;
			let offset = params.offset;

			//Check visibility authorization
			if(params.userId !== this.userId){

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

				if(isRoot(this.userId)){
					var matchQuery = {
						user: params.userId,
						createDate:{
							$gte: new Date(startDate),
							$lt: new Date(endDate)
						}
					};
				}
				else{
					var matchQuery = {
						user: params.userId,
						private: false,
						'project._id':{
							$in: sharedProjects[0].projectIDs
						},
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
					user: this.userId,
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
				    $project:{
				        _id: '$_id',
				        category: '$category',
				        totalTime: '$totalTime',
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
	//Charts
	'users.getUserProjectActivity': function(params){
		//if(!this.userId){ throw new Meteor.Error(500, 'No user found. Please login again.'); }
		if(typeof params.userId !== undefined){
			this.userId = params.userId;
		}

		//console.log('[AGGREGATION] getUserProjectActivity for ' + this.userId)

		//var startQuery = moment();
		var startDate = params.startDate;
		var endDate = params.endDate;
		var range = params.range;
		var offset = params.offset;

		//Check visibility authorization
		if(params.userId !== this.userId){
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


			if(isRoot(this.userId)){
				var matchQuery = {
					user: params.userId,
					createDate:{
						$gte: new Date(startDate),
						$lt: new Date(endDate)
					}
				};
			}
			else{
				
				var matchQuery = {
					user: params.userId,
					private: false,
					validated: true,
					'project._id':{
						$in: sharedProjects[0].projectIDs
					},
					'project._id':{
						$nin: ['', null]
					},
					createDate:{
						$gte: new Date(startDate),
						$lt: new Date(endDate)
					}
				};
			}
		}
		//Owner is viewing himself
		else{
			var matchQuery = {
				user: this.userId,
				'project._id':{
					$nin: ['', null]
				},
				createDate:{
					$gte: new Date(startDate),
					$lt: new Date(endDate)
				}
			};
		}

		//General aggregation by hour
		if(range === 'day'){
			
			var logs = UserLogs.aggregate([
				{
				    $match: matchQuery
				},
				{
				    '$group':{
						_id: {
							'project': '$project._id',
							'hour': {'$hour': '$createDate'},
							'dayOfYear': {'$dayOfYear': '$createDate'}
						},
						totalTime:{
							'$sum': '$totalTime'
						},
						avgTime: {
							'$avg': '$totalTime'
						},
						date:{
							'$min': '$createDate'
						},
				    }
				},
				{
				    '$group':{
						_id: {
							hour :'$_id.hour',
							dayOfYear: '$_id.dayOfYear'
						},
						totalTime:{
							'$sum': '$totalTime'
						},
						avgTime:{
							'$avg': '$totalTime'
						},
						date:{
							'$min': '$date'
						},
						projects:{
							$push:{
								project: '$_id.project',
								totalTime: '$totalTime'
							}
						}
				    }
				},
				{
					$sort:{
						'_id.dayOfYear': 1,
						'_id.hour': 1,
					}
				},
			]);
		}
		//General aggregation by day
		else{
			var logs = UserLogs.aggregate([
				{
					$match: matchQuery
				},
				{
				    $project:{
				        _id: '$_id',
				        utcDate: '$createDate',
				        localDate: {      
				            "$add": [      
								"$createDate",
								{      
									"$add": [
										{     
									        "$multiply": [      
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
				        project: '$project._id',
				        updateDate: '$updateDate',
				        totalTime: '$totalTime',
				        uri: '$uri',
				        type : '$type',
				    }
				},
				{
				    $project:{
				        _id:{ 
				        	'day': {'$dayOfMonth': '$localDate' },
				        	'month': {'$month': '$localDate' },
				        },
				        project: '$project',
				        createDate: '$utcDate',
				        localDate: '$localDate',
				        totalTime: '$totalTime',
				        uri: '$uri',
				        type: '$type',
				    }
				},
				{
				    $group:{
				        _id: {
				        	//Group by project to get project's totalTime
				        	'project': '$project',
				        	'day':'$_id.day',
				        	'month':'$_id.month',
				        	'dayOfYear': {'$dayOfYear': '$localDate'}
				        },
				        totalTime:{
				            $sum: '$totalTime'
				        },
				        date:{
				        	$min: '$createDate',
				        },
				        localDate:{
				        	$min: '$localDate',
				        },
				    },
				},
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
				        avgTime:{
				            '$avg': '$totalTime'
				        },
				        date:{
				            '$min': '$date',
				        },
				        localDate:{
				            '$min': '$localDate',
				        },
				        projects:{
							$push:{
								project: '$_id.project',
								totalTime: '$totalTime'
							}
						},
						objectList:{
							$addToSet: '$_id.project',
						}
				    },
				},
				{
				    $sort:{
				        '_id.month': 1,
				        '_id.dayOfYear': 1,
				    }
				},
			]);
		}//End range if
		//var endQuery = moment();
		//var queryDif = endQuery.subtract(startQuery.toISOString()).milliseconds();
		//console.log('executed '+ range +' getUserActivity in ' + queryDif);
		return logs;
	},
	'users.getUserActivityTypes': function(params){
		//console.log('[AGGREGATION] getUserActivityTypes')

		//var startQuery = moment();
		var startDate = params.startDate;
		var endDate = params.endDate;
		var range = params.range;
		var offset = params.offset;

		//Check visibility authorization
		if(params.userId !== this.userId){
			if(isRoot(this.userId)){
				var matchQuery = {
					user: params.userId,
					createDate:{
						$gte: new Date(startDate),
						$lt: new Date(endDate)
					}
				};
			}
			else{
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
				
				var matchQuery = {
					user: params.userId,
					private: false,
					'project._id':{
						$in: sharedProjects[0].projectIDs
					},
					'project._id':{
						$nin: ['', null]
					},
					createDate:{
						$gte: new Date(startDate),
						$lt: new Date(endDate)
					}
				};
			}
		}
		//Owner is viewing himself
		else{
			var matchQuery = {
				user: this.userId,
				'project._id':{
					$nin: ['', null]
				},
				createDate:{
					$gte: new Date(startDate),
					$lt: new Date(endDate)
				}
			};
		}

		//General aggregation by hour
		if(range === 'day'){
			
			var logs = UserLogs.aggregate([
				{
				    $match: matchQuery
				},
				{
				    '$group':{
						_id: {
							'category': '$category._id',
							'hour': {'$hour': '$createDate'},
							'dayOfYear': {'$dayOfYear': '$createDate'}
						},
						totalTime:{
							'$sum': '$totalTime'
						},
						avgTime: {
							'$avg': '$totalTime'
						},
						date:{
							'$min': '$createDate'
						},
				    }
				},
				{
				    '$group':{
						_id: {
							hour :'$_id.hour',
							dayOfYear: '$_id.dayOfYear'
						},
						totalTime:{
							'$sum': '$totalTime'
						},
						avgTime:{
							'$avg': '$totalTime'
						},
						date:{
							'$min': '$date'
						},
						categories:{
							$push:{
								category: '$_id.category',
								totalTime: '$totalTime'
							}
						}
				    }
				},
				{
					$sort:{
						'_id.dayOfYear': 1,
						'_id.hour': 1,
					}
				},
			]);
		}
		//General aggregation by day
		else{
			var logs = UserLogs.aggregate([
				{
					$match: matchQuery
				},
				{
				    $project:{
				        _id: '$_id',
				        utcDate: '$createDate',
				        localDate: {      
				            "$add": [      
								"$createDate",
								{      
									"$add": [
										{     
									        "$multiply": [      
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
				        category: '$category._id',
				        updateDate: '$updateDate',
				        totalTime: '$totalTime',
				        uri: '$uri',
				        type : '$type',
				    }
				},
				{
				    $project:{
				        _id:{ 
				        	'day': {'$dayOfMonth': '$localDate' },
				        	'month': {'$month': '$localDate' },
				        },
				        category: '$category',
				        createDate: '$utcDate',
				        localDate: '$localDate',
				        totalTime: '$totalTime',
				        uri: '$uri',
				        type: '$type',
				    }
				},
				{
				    $group:{
				        _id: {
				        	//Group by project to get project's totalTime
				        	'category': '$category',
				        	'day':'$_id.day',
				        	'month':'$_id.month',
				        	'dayOfYear': {'$dayOfYear': '$localDate'}
				        },
				        totalTime:{
				            $sum: '$totalTime'
				        },
				        date:{
				        	$min: '$createDate',
				        },
				        localDate:{
				        	$min: '$localDate',
				        },
				    },
				},
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
				        avgTime:{
				            '$avg': '$totalTime'
				        },
				        date:{
				            '$min': '$date',
				        },
				        localDate:{
				            '$min': '$localDate',
				        },
				        categories:{
							$push:{
								category: '$_id.category',
								totalTime: '$totalTime'
							}
						},
						objectList:{
							$addToSet: '$_id.category',
						}
				    },
				},
				{
				    $sort:{
				        '_id.month': 1,
				        '_id.dayOfYear': 1,
				    }
				},
			]);
		}//End range if
		//var endQuery = moment();
		//var queryDif = endQuery.subtract(startQuery.toISOString()).milliseconds();
		//console.log('executed '+ range +' getUserActivity in ' + queryDif);
		return logs;
	},
	//Top Activities Pie chart
	'getUserActivities': function(params){
		if(!this.userId){ throw new Meteor.Error(500, 'No user found. Please login again.'); }

		//console.log('[AGGREGATION] getUserActivities for ' + this.userId)

		let startDate = params.startDate;
		let endDate = params.endDate;
		let range = params.range;
		let offset = params.offset;

		//Check visibility authorization
		if(params.userId !== this.userId){
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

			
			if(isRoot(this.userId)){
				var matchQuery = {
					user: params.userId,
					createDate:{
						$gte: new Date(startDate),
						$lt: new Date(endDate)
					}
				};
			}
			else{
				var matchQuery = {
					user: params.userId,
					private: false,
					'project._id':{
						$in: sharedProjects[0].projectIDs
					},
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
				user: this.userId,
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
	//Top Projects Pie chart
	'users.getUserProjects': function(params){
		if(!this.userId){ throw new Meteor.Error(500, 'No user found. Please login again.'); }

		//console.log('[AGGREGATION] getUserProjects for ' + this.userId)

		let startDate = params.startDate;
		let endDate = params.endDate;
		let range = params.range;
		let offset = params.offset;

		//Check visibility authorization
		if(params.userId !== this.userId){
			var sharedProjects = Projects.aggregate([
				{
					$match:{
						'$or': [
						    { 'owner': {'$in': [this.userId] } },
						    //{ 'visibility': 2 },
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

			
			if(isRoot(this.userId)){
				var matchQuery = {
					user: params.userId,
					createDate:{
						$gte: new Date(startDate),
						$lt: new Date(endDate)
					}
				};
			}
			else{
				var matchQuery = {
					user: params.userId,
					private: false,
					//validated: true,
					'project._id':{
						$in: sharedProjects[0].projectIDs
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
				user: this.userId,
				//validated: true,
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
			        _id: '$project._id',
			        label: {
			        	$max: '$project.name'
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

	//User Logs Aggregation
	'users.getUserHourLogs': function(dateRange, groupOptions, userId){
		if(isAdmin(this.userId)){
			var user = userId;
		}
		else{
			var user = this.userId;	
		}

		//console.log('[AGGREGATION] getUserHourLogs2 for ' + this.userId)

		//console.log('getting user hourLogs')

		switch(groupOptions){
			default:
			case 'source':
				var groupPipeline = {
					_id: '$domain',
					totalTime: {
						$sum: '$totalTime'
					},
					totalCount:{
						$sum: 1
					},
					validCount:{
					    $sum:{
					        $cond: [
					            {$eq: ['$validated', true]}, 1, 0
					        ]
					    }
					},
					invalidCount:{
					    $sum:{
					        $cond: [
					            {$eq: ['$validated', false]}, 1, 0
					        ]
					    }
					},
					minDate:{
						$min: '$createDate'
					},
					maxDate:{
						$max: '$updateDate'
					},
					logTypes:{
						$addToSet: '$type'
					},
					logs:{
						$push: {
							_id: '$_id',
							project: '$project',
							matchedProjects: '$matchedProjects',
							totalTime: '$totalTime',
							classified: '$classified',
							validated: '$validated',
							private: '$private',
							category: '$category',
							pageTitle: '$pageTitle',
							uri: '$uri',
							domain: '$domain',
							type: '$type',
							usedForTraining: '$usedForTraining',
						}
					}
				};
				var sortPipeline = {
					totalTime: -1
				};
				break;

			case 'project':
				var groupPipeline = {
					_id: '$project._id',
					totalTime: {
						$sum: '$totalTime'
					},
					totalCount:{
						$sum: 1
					},
					validCount:{
					    $sum:{
					        $cond: [
					            {$eq: ['$validated', true]}, 1, 0
					        ]
					    }
					},
					invalidCount:{
					    $sum:{
					        $cond: [
					            {$eq: ['$validated', false]}, 1, 0
					        ]
					    }
					},
					minDate:{
						$min: '$createDate'
					},
					maxDate:{
						$max: '$updateDate'
					},
					logTypes:{
						$addToSet: '$type'
					},
					logs:{
						$push: {
							_id: '$_id',
							project: '$project',
							matchedProjects: '$matchedProjects',
							totalTime: '$totalTime',
							classified: '$classified',
							validated: '$validated',
							private: '$private',
							category: '$category',
							pageTitle: '$pageTitle',
							uri: '$uri',
							domain: '$domain',
							type: '$type',
							usedForTraining: '$usedForTraining',
						}
					}
				};
				var sortPipeline = {
					totalTime: -1
				};
				break;

			case 'hour':
				var groupPipeline = {
					_id: { $hour: '$logHour' },
					totalTime: {
						$sum: '$totalTime'
					},
					logHour:{
						$min: '$logHour'
					},
					totalCount:{
						$sum: 1
					},
					validCount:{
					    $sum:{
					        $cond: [
					            {$eq: ['$validated', true]}, 1, 0
					        ]
					    }
					},
					invalidCount:{
					    $sum:{
					        $cond: [
					            {$eq: ['$validated', false]}, 1, 0
					        ]
					    }
					},
					minDate:{
						$min: '$createDate'
					},
					maxDate:{
						$max: '$updateDate'
					},
					logTypes:{
						$addToSet: '$type'
					},
					logs:{
						$push: {
							_id: '$_id',
							project: '$project',
							matchedProjects: '$matchedProjects',
							totalTime: '$totalTime',
							classified: '$classified',
							validated: '$validated',
							private: '$private',
							category: '$category',
							pageTitle: '$pageTitle',
							uri: '$uri',
							domain: '$domain',
							type: '$type',
							usedForTraining: '$usedForTraining',
						}
					}
				};
				var sortPipeline = {
					_id: 1
				};
				break;
		}


		var logs = UserLogs.aggregate([
			{
				$match:{
					user: user,
					createDate:{
						$gte: new Date(dateRange.startDate),
						$lt: new Date(dateRange.endDate),
					},
					//Only get logs with +1 second of time.
					totalTime:{
						$gt: 1
					}
				}
			},
			{
				$sort: {
					totalTime: -1
				}
			},
			{
				$group: groupPipeline,
			},
			{
				$sort: sortPipeline
			},
		]);

		//console.log('returning logs ' + logs.length)

		return logs;

	},
	'users.getDailyValidation': function(dateRange, userId){
		if(isAdmin(this.userId)){
			var user = userId;
		}
		else{
			var user = this.userId;	
		}

		//console.log('[AGGREGATION] getDailyValidation for ' + this.userId)

		var validationStats = UserLogs.aggregate([
			{
				$match:{
					user: user,
					createDate:{
						$gte: new Date(dateRange.startDate),
						$lt: new Date(dateRange.endDate),
					},
					//Only get logs with +1 second of time.
					totalTime:{
						$gt: 1
					}
				}
			},
			{
				$group:{
					_id: null,
					totalTime:{
						$sum: '$totalTime'
					},
					validTime:{
						$sum:{
						    $cond: [
						        {$eq: ['$validated', true]}, '$totalTime', 0
						    ]
						}
					},
					validCount:{
					    $sum:{
					        $cond: [
					            {$eq: ['$validated', true]}, 1, 0
					        ]
					    }
					},
					totalCount:{
						$sum: 1
					}
				}
			}
		]);

		return validationStats;

	},
	//Aggregate options for global bulk select dropdown (in timesheet page) 
	'users.getHourLogsSelectOptions': function(dateRange, userId){
		if(isAdmin(this.userId)){
			var user = userId;
		}
		else{
			var user = this.userId;	
		}

		//console.log('[AGGREGATION] getHourLogsSelectOptions for ' + this.userId)

		var logs = UserLogs.aggregate([
			{
				$match:{
					user: user,
					createDate:{
						$gte: new Date(dateRange.startDate),
						$lt: new Date(dateRange.endDate),
					},
					//Only get logs with +1 second of time.
					totalTime:{
						$gt: 1
					}
				}
			},
			{
				$project:{
					type: '$type',
					domain: '$domain',
					pageTitle: '$pageTitle',
					project: '$project._id',
					matchedProjects: '$matchedProjects',
				}
			},
			{
				$unwind: '$matchedProjects'
			},
			{
				$group: {
					_id: null,
					typeList:{
						$addToSet: '$type'
					},
					domainList:{
						$addToSet: '$domain'
					},
					pageTitleList:{
						$addToSet: '$pageTitle'
					},
					electedProjectList:{
						$addToSet: {
							id: '$project._id',
							name: '$project.name',
						}
					},
					matchedProjectsList:{
						$addToSet: {
							id: '$matchedProjects._id',
							name: '$matchedProjects.name'
						}
					},
				},
			},
			//Perform union of electedProjectList and matchedProjectsList
			{
				$project:{
					typeList: '$typeList',
					domainList: '$domainList',
					pageTitleList: '$pageTitleList',
					projectList:{
						$setUnion: ['$electedProjectList', '$matchedProjectsList']
					},
				}
			}
		]);

		return logs;

	},
	//User timeline aggregation
	//User Logs Aggregation
	'users.getUserTimelineActivity': function(dateRange, groupOptions, userId){
		if(isAdmin(this.userId)){
			var user = userId;
		}
		else{
			var user = this.userId;	
		}

		//console.log('in users.getUserTimelineActivity')
		//console.log(dateRange, groupOptions, userId)


		switch(groupOptions){
			//Grouped by FILE
			case 'source':
				var logs = UserLogs.aggregate([
					{
						$match:{
							//type: 'code',
							user: user,
							createDate:{
								$gte: new Date(dateRange.startDate),
								$lt: new Date(dateRange.endDate),
							},
							//Only get logs with +1 second of time.
							totalTime:{
								$gt: 1
							}
						}
					},
					{
						$sort: {
							createDate: 1
						}
					},
					{
						$group: {
							_id: '$pageTitle',
							type:{
								$max: '$type'
							},
							totalTime: {
								$sum: '$totalTime'
							},
							totalCount:{
								$sum: 1
							},
							minDate:{
								$min: '$createDate'
							},
							maxDate:{
								$max: '$updateDate'
							},
							logs:{
								$push: {
									_id: '$_id',
									project: '$project',
									matchedProjects: '$matchedProjects',
									createDate: '$createDate',
									updateDate: '$updateDate',
									totalTime: '$totalTime',
									classified: '$classified',
									validated: '$validated',
									private: '$private',
									category: '$category',
									pageTitle: '$pageTitle',
									uri: '$uri',
									domain: '$domain',
									type: '$type',
									usedForTraining: '$usedForTraining',
								}
							}
						},
					},
					{
						$unwind: '$logs'
					},
					{
						$group: {
							_id: '$type',
							name:{
								$max: '$_id'
							},
							totalTime: {
								$max: '$totalTime'
							},
							totalCount:{
								$max: '$totalCount'
							},
							minDate:{
								$min: '$minDate'
							},
							maxDate:{
								$max: '$maxDate'
							},
							logs:{
								$max: '$logs'
							}
						},
					},
					{
						$sort: {
							totalCount: -1
						}
					},
				]);
				break;
			//Grouped by Activity type
			case 'activity':
				var logs = UserLogs.aggregate([
					{
						$match:{
							//'category.category': 'technical',
							pageTitle:{
								$ne: ''
							},
							user: user,
							createDate:{
								$gte: new Date(dateRange.startDate),
								$lt: new Date(dateRange.endDate),
							},
							//Only get logs with +1 second of time.
							totalTime:{
								$gt: 1
							}
						}
					},
					{
						$sort: {
							createDate: 1
						}
					},
					{
						$group: {
							_id: '$category.category',
							totalTime: {
								$sum: '$totalTime'
							},
							totalCount:{
								$sum: 1
							},
							minDate:{
								$min: '$createDate'
							},
							maxDate:{
								$max: '$updateDate'
							},
							logs:{
								$push: {
									_id: '$_id',
									project: '$project',
									matchedProjects: '$matchedProjects',
									createDate: '$createDate',
									updateDate: '$updateDate',
									totalTime: '$totalTime',
									classified: '$classified',
									validated: '$validated',
									private: '$private',
									category: '$category',
									pageTitle: '$pageTitle',
									uri: '$uri',
									domain: '$domain',
									type: '$type',
									usedForTraining: '$usedForTraining',
								}
							}
						},
					},
					{
						$sort: {
							minDate: 1
						}
					},
				]);
				break;
			case 'project':
				var logs = UserLogs.aggregate([
					{
						$match:{
							//'category.category': 'technical',
							pageTitle:{
								$ne: ''
							},
							user: user,
							createDate:{
								$gte: new Date(dateRange.startDate),
								$lt: new Date(dateRange.endDate),
							},
							//Only get logs with +1 second of time.
							totalTime:{
								$gt: 1
							}
						}
					},
					{
						$sort: {
							createDate: 1
						}
					},
					{
						$group: {
							_id: '$project.name',
							id: {
								$max: '$project._id'
							},
							totalTime: {
								$sum: '$totalTime'
							},
							totalCount:{
								$sum: 1
							},
							minDate:{
								$min: '$createDate'
							},
							maxDate:{
								$max: '$updateDate'
							},
							logs:{
								$push: {
									_id: '$_id',
									project: '$project',
									matchedProjects: '$matchedProjects',
									createDate: '$createDate',
									updateDate: '$updateDate',
									totalTime: '$totalTime',
									classified: '$classified',
									validated: '$validated',
									private: '$private',
									category: '$category',
									pageTitle: '$pageTitle',
									uri: '$uri',
									domain: '$domain',
									type: '$type',
									usedForTraining: '$usedForTraining',
								}
							}
						},
					},
					{
						$sort: {
							minDate: 1
						}
					},
				]);
				break;

		}
		//console.log('returning logs ' + logs.length)

		return logs;

	},
	//User calendar aggregation
	'users.getUserDayActivity': function(startDate, endDate, groupOptions, userId, dateObj){
		if(isRoot(this.userId)){
			var user = userId;
		}
		else{
			var user = this.userId;	
		}

		//console.log('in users.getUserTimelineActivity')
		//console.log(dateRange, groupOptions, userId)


		switch(groupOptions){
			//Grouped by FILE
			case 'source':
				var logs = UserLogs.aggregate([
					{
						$match:{
							//type: 'code',
							user: user,
							createDate:{
								$gte: new Date(startDate),
								$lt: new Date(endDate),
							},
							//Only get logs with +1 second of time.
							totalTime:{
								$gt: 1
							}
						}
					},
					{
						$sort: {
							createDate: 1
						}
					},
					{
						$group: {
							_id: '$pageTitle',
							type:{
								$max: '$type'
							},
							totalTime: {
								$sum: '$totalTime'
							},
							totalCount:{
								$sum: 1
							},
							minDate:{
								$min: '$createDate'
							},
							maxDate:{
								$max: '$updateDate'
							},
							logs:{
								$push: {
									_id: '$_id',
									project: '$project',
									matchedProjects: '$matchedProjects',
									createDate: '$createDate',
									updateDate: '$updateDate',
									totalTime: '$totalTime',
									classified: '$classified',
									validated: '$validated',
									private: '$private',
									category: '$category',
									pageTitle: '$pageTitle',
									uri: '$uri',
									domain: '$domain',
									type: '$type',
									usedForTraining: '$usedForTraining',
								}
							}
						},
					},
					{
						$unwind: '$logs'
					},
					{
						$group: {
							_id: '$type',
							name:{
								$max: '$_id'
							},
							totalTime: {
								$max: '$totalTime'
							},
							totalCount:{
								$max: '$totalCount'
							},
							minDate:{
								$min: '$minDate'
							},
							maxDate:{
								$max: '$maxDate'
							},
							logs:{
								$max: '$logs'
							}
						},
					},
					{
						$sort: {
							totalCount: -1
						}
					},
				]);
				break;
			//Grouped by Activity type
			case 'activity':
				var logs = UserLogs.aggregate([
					{
						$match:{
							//'category.category': 'technical',
							pageTitle:{
								$ne: ''
							},
							user: user,
							createDate:{
								$gte: new Date(startDate),
								$lt: new Date(endDate),
							},
							//Only get logs with +1 second of time.
							totalTime:{
								$gt: 1
							}
						}
					},
					{
						$sort: {
							createDate: 1
						}
					},
					{
						$group: {
							_id: '$category.category',
							totalTime: {
								$sum: '$totalTime'
							},
							totalCount:{
								$sum: 1
							},
							minDate:{
								$min: '$createDate'
							},
							maxDate:{
								$max: '$updateDate'
							},
							logs:{
								$push: {
									_id: '$_id',
									project: '$project',
									matchedProjects: '$matchedProjects',
									createDate: '$createDate',
									updateDate: '$updateDate',
									totalTime: '$totalTime',
									classified: '$classified',
									validated: '$validated',
									private: '$private',
									category: '$category',
									pageTitle: '$pageTitle',
									uri: '$uri',
									domain: '$domain',
									type: '$type',
									usedForTraining: '$usedForTraining',
								}
							}
						},
					},
					{
						$sort: {
							minDate: 1
						}
					},
				]);
				break;
			case 'project':
				var logs = UserLogs.aggregate([
					{
						$match:{
							//'category.category': 'technical',
							pageTitle:{
								$ne: ''
							},
							user: user,
							createDate:{
								$gte: new Date(startDate),
								$lt: new Date(endDate),
							},
							//Only get logs with +1 second of time.
							totalTime:{
								$gt: 60
							}
						}
					},
					{
						$sort: {
							createDate: 1
						}
					},
				]);
				break;

		}
		//console.log('returning logs ' + logs.length)

		return {
			'logs': logs,
			'startDate': dateObj
		};

	},

	//USER REPORTS
	'users.getUserReport': function(params, range){
		if(typeof params.userId !== undefined){
			this.userId = params.userId;
		}

		//console.log('[AGGREGATION] getUserProjectActivity for ' + this.userId)

		//var startQuery = moment();
		var startDate = params.startDate;
		var endDate = params.endDate;
		var offset = params.offset;

		if(range === 'day' || range === 'week'){
			var currentPeriod = UserLogs.aggregate([
				{
					$match:{
						user: this.userId,
						'project._id':{
							$nin: ['', null]
						},
						createDate:{
							$gte: new Date(params.startDate),
							$lt: new Date(params.endDate)
						}
					}
				},
				{
					$project:{
						project: '$project',
						validated: '$validated',
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
				{
					$group:{
						_id: '$project.name',
						totalTime:{
							$sum: '$totalTime'
						},
						validTime:{
							$sum: '$validatedTime'
						},
						unknownTime:{
							$sum: '$unknownTime'
						},
					}
				},
				{
					$sort:{
						totalTime: -1
					}
				},
				{
					$group:{
						_id: null,
						totalTime:{
							$sum: '$totalTime'
						},
						validTime:{
							$sum: '$validTime'
						},
						unknownTime:{
							$sum: '$unknownTime'
						},
						avgTime:{
							$avg: '$totalTime'
						},
						projects:{
							$push: {
								name: '$_id',
								totalTime: '$totalTime',
								validTime: '$validTime',
								unknownTime: '$unknownTime',
							}
						}
					}
				}
			]);
		}
		else if(range === 'month'){
			console.log('TODO: check if user can have more than 7 days of data');
			var currentPeriod = UserLogs.aggregate([
				{
					$match:{
						user: this.userId,
						'project._id':{
							$nin: ['', null]
						},
						createDate:{
							$gte: new Date(params.startDate),
							$lt: new Date(params.endDate)
						}
					}
				},
				{
					$project:{
						project: '$project',
						validated: '$validated',
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
				{
					$group:{
						_id: '$project.name',
						totalTime:{
							$sum: '$totalTime'
						},
						validTime:{
							$sum: '$validatedTime'
						},
						unknownTime:{
							$sum: '$unknownTime'
						},
					}
				},
				{
					$sort:{
						totalTime: -1
					}
				},
				{
					$group:{
						_id: null,
						totalTime:{
							$sum: '$totalTime'
						},
						validTime:{
							$sum: '$validTime'
						},
						unknownTime:{
							$sum: '$unknownTime'
						},
						avgTime:{
							$avg: '$totalTime'
						},
						projects:{
							$push: {
								name: '$_id',
								totalTime: '$totalTime',
								validTime: '$validTime',
								unknownTime: '$unknownTime',
							}
						}
					}
				}
			]);
		}

		return {
			current: currentPeriod,
			//past: pastPeriod,
		};
	}
});