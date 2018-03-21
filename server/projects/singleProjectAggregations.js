/*Single project */
Meteor.methods({
	'getProjectPeriodTime': function(params){
		if(!this.userId){ return; }

		var projectId = params.projectId;
		var startDate = params.startDate;
		var endDate = params.endDate;
		var projectCreateDate = params.projectCreateDate;
		var currentDate = params.currentDate;

		//console.log(projectId)

		var totalTime = UserLogs.aggregate([
			{
			    $match:{
					'project._id': projectId,
					private: false,
					/*
					'createDate':{
						$gte: new Date(projectCreateDate),
						$lt: new Date(currentDate)
					},
					*/
				}
			},
			{
			    $project:{
					totalHourRate:{ 
						$multiply: [ "$hourRate", {$divide:["$totalTime", 3600]} ] 
					},
					billedTime:{
					    $cond: {
					        if: { 
					        	$and:[
					            	{ $eq: ['$validated', true] },
					            	{ $eq: ['$billed', true] }
					            ]
					    	},
					        then: { $multiply: [ "$hourRate", {$divide:["$totalTime", 3600]} ] },
					        else: 0,
					    }
					},
			        certainBillableTime:{
			            $cond: {
			                    if: { 
			                    	$and:[
			                        	{ $eq: ['$validated', true] },
			                        	{ $eq: ['$billed', false] }
			                        ]
			                	},
			                then: { $multiply: [ "$hourRate", {$divide:["$totalTime", 3600]} ] },
			                else: 0,
			            }
			        },
			        uncertainBillableTime:{
			            $cond: {
			                    if: { 
			                    	$and:[
			                        	{ $eq: ['$validated', false] },
			                        	{ $eq: ['$billed', false] }
			                        ]
			                	},
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
			        uncertainTime:{
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
			        _id: '$project._id',
			        //totalTime:{ '$sum': '$totalTime' },
			        validatedTime:{ '$sum': '$validatedTime' },
			        uncertainTime:{ '$sum': '$uncertainTime' },
			        
			        totalBillableTime: { '$sum': '$totalHourRate' },
			        
			        billedTime:{ '$sum': '$billedTime' },
			        certainBillableTime:{ '$sum': '$certainBillableTime' },
			        uncertainBillableTime:{ '$sum': '$uncertainBillableTime' },
			    }
			}
		]);

		var periodTime = UserLogs.aggregate([
			{
			    $match:{
					'project._id': projectId,
					'createDate':{
						$gte: new Date(startDate),
						$lt: new Date(endDate)
					},
					private: false,
					//'validated': true
				}
			},
			{
			    $project:{
			        totalHourRate:{ 
			        	$multiply: [ "$hourRate", {$divide:["$totalTime", 3600]} ] 
			        },
					billedTime:{
					    $cond: {
					        if: { 
					        	$and:[
					            	{ $eq: ['$validated', true] },
					            	{ $eq: ['$billed', true] }
					            ]
					    	},
					        then: { $multiply: [ "$hourRate", {$divide:["$totalTime", 3600]} ] },
					        else: 0,
					    }
					},
			        certainBillableTime:{
			            $cond: {
			                    if: { 
			                    	$and:[
			                        	{ $eq: ['$validated', true] },
			                        	{ $eq: ['$billed', false] }
			                        ]
			                	},
			                then: { $multiply: [ "$hourRate", {$divide:["$totalTime", 3600]} ] },
			                else: 0,
			            }
			        },
			        uncertainBillableTime:{
			            $cond: {
			                    if: { 
			                    	$and:[
			                        	{ $eq: ['$validated', false] },
			                        	{ $eq: ['$billed', false] }
			                        ]
			                	},
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
			        uncertainTime:{
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
			        //totalTime:{ '$sum': '$totalTime' },
			        validatedTime:{ '$sum': '$validatedTime' },
			        uncertainTime:{ '$sum': '$uncertainTime' },
			        
			        totalBillableTime: { '$sum': '$totalHourRate' },
			        
			        billedTime:{ '$sum': '$billedTime' },
			        certainBillableTime:{ '$sum': '$certainBillableTime' },
			        uncertainBillableTime:{ '$sum': '$uncertainBillableTime' },
			    }
			}
		]);

		return {
			'periodTime': periodTime,
			'totalTime': totalTime
		};
	},

	'getProjectActivity': function(params){
		this.unblock();
		//console.log('getProjectActivity aggregation')
		if(!this.userId){ return; }

		//console.log(params)

		var startDate = params.startDate;
		var endDate = params.endDate;
		var range = params.range;
		var offset = params.offset;
		var projectId = params.projectId;

		//General aggregation by hour
		if(range === 'day'){
			
			var logs = UserLogs.aggregate([
				{
				    $match:{
						'project._id': projectId,
						createDate:{
							$gte: new Date(startDate),
							$lt: new Date(endDate)
						},
						'validated': true
						/*
						'$or': [
							{  },
							{ 'user': this.userId },
							{ '$and':[
									{ 'validated': false },
									{ 'user': this.userId },
								]
							},
							{ '$and':[
									{ 'private': true },
									{ 'user': this.userId },
								]
							},
						],
						*/
					}
				},
				{
				    $project:{
				        _id: '$_id',
				        user : '$user',
				        createDate : '$createDate',
				        totalTime : '$totalTime',
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
				    '$group':{
						_id: {
							'user': '$user',
							'hour': {'$hour': '$createDate'},
							'dayOfYear': {'$dayOfYear': '$createDate'}
						},
						totalTime:{
							'$sum': '$totalTime'
						},
						/*
						avgTime: {
							'$avg': '$totalTime'
						},
						*/
						validatedTime:{
							'$sum': '$validatedTime'
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
						/*
						totalTime:{
							'$sum': '$totalTime'
						},
						avgTime:{
							'$avg': '$totalTime'
						},
						*/
						date:{
							'$min': '$date'
						},
						users:{
							$push:{
								user: '$_id.user',
								totalTime: '$validatedTime'
							}
						},
						objectList:{
							$addToSet: '$_id.user',
						},
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
					$match:{
						'project._id': projectId,
						createDate:{
							$gte: new Date(startDate),
							$lt: new Date(endDate)
						},
						'validated': true
						/*
						'$or': [
							{  },
							{ 'user': this.userId },
							{ '$and':[
									{ 'validated': false },
									{ 'user': this.userId },
								]
							},
							{ '$and':[
									{ 'private': true },
									{ 'user': this.userId },
								]
							},
						],
						*/
					}
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
				        user: '$user',
				        updateDate: '$updateDate',
				        totalTime: '$totalTime',
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
				    $project:{
				        _id:{ 
				        	'day': {'$dayOfMonth': '$localDate' },
				        	'month': {'$month': '$localDate' },
				        },
				        user: '$user',
				        validatedTime: '$validatedTime',
				        createDate: '$utcDate',
				        localDate: '$localDate',
				        totalTime: '$totalTime',
				    }
				},
				{
				    $group:{
				        _id: {
				        	//Group by project to get project's totalTime
				        	'user': '$user',
				        	'day':'$_id.day',
				        	'month':'$_id.month',
				        	'dayOfYear': {'$dayOfYear': '$localDate'}
				        },
				        /*
				        totalTime:{
				            $sum: '$totalTime'
				        },
				        */
				        validatedTime:{
				        	$sum: '$validatedTime'
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
				        date:{
				            '$min': '$date',
				        },
				        localDate:{
				            '$min': '$localDate',
				        },
				        users:{
							$push:{
								user: '$_id.user',
								totalTime: '$validatedTime'
							}
						},
						objectList:{
							$addToSet: '$_id.user',
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

		return logs;
	},

	'getProjectDistribution': function(params){
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
		var projectId = params.projectId;

		var logs = UserLogs.aggregate([
			{
			    $match:{
			    	organization: organization,
			    	project: projectId,
			        createDate:{
	                    $gte: new Date(startDate),
	                    $lt: new Date(endDate)
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
	},
	//Gets project total time (valid time only)
	'projects.getProjectTotalTime': function(projectId){
		if(!this.userId){ throw new Meteor.Error(500, 'No user found. Please login again.'); }

		check(projectId, String);

		var logs = UserLogs.aggregate([
			{
			    $match:{
			    	'project._id': projectId,
			        validated: true,
			        private: false,
			    }
			},
			{
			    $group:{
			        _id: '$project._id',
			        totalTime:{
			            $sum: '$totalTime'
			        },
			        unknownTime:{
			            $sum: '$unknownTime'
			        },
			    }
			},
		])[0];//End aggregation


		return logs;
	},
	'projects.crunchTotalTime': function(projectId){
		this.unblock()
		check(projectId, String);

		var logs = UserLogs.aggregate([
			{
			    $match:{
			    	'project._id': projectId,
			        validated: true,
			        private: false,
			    }
			},
			{
			    $group:{
			        _id: '$project._id',
			        totalTime:{
			            $sum: '$totalTime'
			        },
			        unknownTime:{
			            $sum: '$unknownTime'
			        },
			    }
			},
		])[0];//End aggregation

		if(typeof logs !== 'undefined'){
			Projects.update({
				_id: logs._id
			},
			{
				$set:{
					totalTime: logs.totalTime
				}
			});
		}
	}
});