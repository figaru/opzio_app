Meteor.methods({
	/* General projects */
	'getProjectsActivity': function(params){
		if(!this.userId){ return; }

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


		//Get all project IDs the user is able to see. Use it to then limit userLogs aggregation
		if(isAdmin(this.userId)){
			var projectMatch = {
				'$or': [
				    { 'owner': {'$in': [this.userId] } },
				    { 'visibility': 2 },
				    { 'visibility': 1 },
				    { '$and': [
				    	{'visibility': 0 }, 
				    	{'team.user': this.userId}
				    ]},
				]
			}
		}
		else{
			var projectMatch = {
				'$or': [
				    { 'owner': {'$in': [this.userId] } },
				    { 'visibility': 2 },
				    { '$and': [
				    	{'visibility': 1 },
				    	{ 'team.user': this.userId }
				    ]},
				    { '$and': [
						{ 'visibility': 0 },
						{ 'team.user': this.userId }
			    	]},
				]
			}
		}

		//Exclude 'personal' projects
		projectMatch['type'] = { '$ne': 'personal' };

		var visibleProjectIDs = Projects.aggregate([
			{
			    $match: projectMatch
			},
			{
			    $group:{
			        _id: null,
			        visibleIDs:{
			            $addToSet: '$_id'
			        }
			    }
			}
		])[0].visibleIDs;


		//General aggregation by hour
		if(range === 'day'){
			
			var logs = UserLogs.aggregate([
				{
				    $match:{
						'project._id':{ 
							$in: visibleProjectIDs
						},
						'createDate':{
							$gte: new Date(startDate),
							$lt: new Date(endDate)
						},
				    	'organization': organization,
				    	'$or': [
				    		{ 'private': false, },
				    		{ 'validated': true, },
							{ $and:[
									{ 'private': true },
									{ 'user': this.userId },
								]
							},
						],
				    }
				},
				{
				    $project:{
				        _id: '$_id',
				        project : '$project',
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
							'project': '$project._id',
							'hour': {'$hour': '$createDate'},
							'dayOfYear': {'$dayOfYear': '$createDate'}
						},
						totalTime:{
							'$sum': '$totalTime'
						},
						validatedTime:{
							'$sum': '$validatedTime'
						},
						/*
						avgTime: {
							'$avg': '$totalTime'
						},
						*/
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
						projects:{
							$push:{
								project: '$_id.project',
								totalTime: '$totalTime',
								validatedTime: '$validatedTime'
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
					$match:{
						'project._id':{ 
							$in: visibleProjectIDs
						},
						'createDate':{
							$gte: new Date(startDate),
							$lt: new Date(endDate)
						},
						'organization': organization,
		    	    	'$or': [
		    				{ 'private': false },
		    				{'validated': true },
		    				{ $and:[
		    						{ 'private': true },
		    						{ 'user': this.userId },
		    					]
		    				},
		    			],
					}
				},
				{
				    $project:{
				        _id: '$_id',
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
				        project : '$project._id',
				        totalTime : '$totalTime',
				        validated: '$validated',
				    }
				},
				{
				    $project:{
				        _id:{ 
				        	'day': {'$dayOfMonth': '$localDate' },
				        	'month': {'$month': '$localDate' },
				        	'year': {'$year': '$localDate' },
				        },
				        project : '$project',
				        localDate : '$localDate',
				        totalTime : '$totalTime',
				        validatedTime:{
				            $cond: {
				                if: { $eq: ['$validated', true] },
				                then: '$totalTime',
				                else: 0,
				            }
				        },
				        //uri : '$uri',
				        //type : '$type',
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
				        validatedTime:{
				            $sum: '$validatedTime'
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
				        /*
				        totalTime:{
				            '$sum': '$totalTime'
				        },
				        avgTime:{
				            '$avg': '$totalTime'
				        },
				        */
				        projects:{
							$push:{
								project: '$_id.project',
								totalTime: '$totalTime',
								validatedTime: '$validatedTime',
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
		}
		//End range if
		return logs;
	},
	'getProjectsDistribution': function(params){
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

		if(isAdmin(this.userId)){
			var projectMatch = {
				'$or': [
				    { 'owner': {'$in': [this.userId] } },
				    { 'visibility': 2 },
				    { 'visibility': 1 },
				    { '$and': [{'visibility': 0, 'team.user': this.userId}]},
				]
			}
		}
		else{
			var projectMatch = {
				'$or': [
				    { 'owner': {'$in': [this.userId] } },
				    { 'visibility': 2 },
				    { '$and': [{'visibility': 1, 'team.user': this.userId}]},
				    { '$and': [{'visibility': 0, 'team.user': this.userId}]},
				]
			}
		}

		//Exclude 'personal' projects
		projectMatch['type'] = { '$ne': 'personal' };

		//Get all project IDs the user is able to see. Use it to then limit userLogs aggregation
		var visibleProjectIDs = Projects.aggregate([
			{
			    $match: projectMatch
			},
			{
			    $group:{
			        _id: null,
			        visibleIDs:{
			            $addToSet: '$_id'
			        }
			    }
			}
		])[0].visibleIDs;

		var logs = UserLogs.aggregate([
			{
			    $match:{
			        createDate:{
	                    $gte: new Date(startDate),
	                    $lt: new Date(endDate)
	                },
			    	'organization': organization,
	                'project._id':{ 
	                	$in: visibleProjectIDs
	                },
			    	'$or': [
						{ private: false },
						{ $and:[
								{ private: true },
								{ user: this.userId },
							]
						},
					],
	                /*
			    	'$or': [
						{ private: false },
						{ $and:[
								{ private: true },
								{ user: this.userId },
							]
						},
					],
					*/
			    }
			},
			{
			    $project:{
			        _id: '$project._id',
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
})