Meteor.methods({
	'getUserHourLogs': function(dateRange, userId){
		console.log('[AGGREGATION] getUserHourLogs for ' + this.userId)
		if(isAdmin(this.userId)){
			var user = userId;
		}
		else{
			var user = this.userId;	
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
						$gte: 1
					}
				}
			},
			{
			    $project:{
			        _id: '$_id',
			        user: '$user',
			        logHour: '$logHour',
			        createDate: '$createDate',
			        uri: '$uri',
			        domain: '$domain',
			        pageTitle: '$pageTitle',
			        updateDate: '$updateDate',
			        project: '$project',
			        matchedProjects:{
			            $cond:[
			                {$eq: ['$matchedProjects', []] },
			                [{_id:null,name:null}],
			                '$matchedProjects'
			            ]
			        },
			        category: '$category',
			        private: '$private',
			        validated: '$validated',
			        usedForTraining: '$usedForTraining',
			        type: '$type',
			        relatedLog: '$relatedLog',
			        idleTime: '$idleTime',
			        totalTime: '$totalTime'
			    }
			},
			{
			    $sort:{
			        totalTime: -1
			    }
			},
			{
			    $unwind: '$matchedProjects'
			},
			{
				$sort:{
					'matchedProjects.name': 1
				}
			},
			{
			    $group:{
			        _id: null,
			        logs:{
			            $addToSet: {
			                _id: '$_id',
			                user: '$user',
			                logHour: '$logHour',
			                createDate: '$createDate',
			                uri: '$uri',
			                domain: '$domain',
			                pageTitle: '$pageTitle',
			                updateDate: '$updateDate',
			                project: '$project',
			                category: '$category',
			                private: '$private',
			                validated: '$validated',
			                usedForTraining: '$usedForTraining',
			                type: '$type',
			                relatedLog: '$relatedLog',
			                idleTime: '$idleTime',
			                totalTime: '$totalTime'
			            }
			        },
			        matchedProjects: {
			            $addToSet:{
			                $cond: [
			                    {$ne: ['$matchedProjects._id', null]},
			                    {
			                        _id:'$matchedProjects._id',
			                        name:'$matchedProjects.name'
			                    },
			                    ''
			                ]
			            }
			        },
			    }
			},
			{
			    $unwind: '$logs'
			},
			{
			    $project:{
			        _id: '$logs._id',
			        user: '$logs.user',
			        logHour: '$logs.logHour',
			        createDate: '$logs.createDate',
			        uri: '$logs.uri',
			        domain: '$logs.domain',
			        pageTitle: '$logs.pageTitle',
			        updateDate: '$logs.updateDate',
			        project: '$logs.project',
			        category: '$logs.category',
			        private: '$logs.private',
			        validated: '$logs.validated',
			        usedForTraining: '$logs.usedForTraining',
			        type: '$logs.type',
			        relatedLog: '$logs.relatedLog',
			        idleTime: '$logs.idleTime',
			        totalTime: '$logs.totalTime',
			        matchedProjects: '$matchedProjects'
			    }
			},
			{
				$sort:{
					totalTime: -1
				}
			},
			{
			    $group:{
			        _id: '$logHour',
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
			        validTime:{
			            $sum:{
			                $cond: [
			                    {$eq: ['$validated', true]}, '$totalTime', 0
			                ]
			            }
			        },
			        totalTime:{
			                $sum: '$totalTime',
			        },
			        uris:{
			            $addToSet:{
			                $cond: [
			                    {$eq: ['$type', 'browser']},
			                    '$uri',
			                    ''
			                ]
			            }
			        },
			        systemProjects:{
			             $addToSet:{
			                $cond: [
			                    {$eq: ['$type', 'browser']},
			                    '$matchedProjects._id',
			                    ''
			                ]
			            }
			        },
			        logs:{
			            $push:{
			                _id: '$_id',
			                logHour: '$logHour',
			                uri: '$uri',
			                domain: '$domain',
			                pageTitle: '$pageTitle',
			                updateDate: '$updateDate',
			                project: '$project',
			                matchedProjects: '$matchedProjects',
			                private: '$private',
			                category: '$category',
			                validated: '$validated',
			                usedForTraining: '$usedForTraining',
			                type: '$type',
			                relatedLog: '$relatedLog',
			                idleTime: '$idleTime',
			                totalTime: '$totalTime'
			            }
			        }
			    }
			},
			{
			    $sort:{
			        _id: 1
			    }
			},
		]);

		return logs;
	}
});

/*
Old query
{
	$sort:{
		totalTime: -1
	}
},
{
    $group:{
        _id: '$logHour',
        validCount:{
            $sum:{
                $cond: [
                    {$eq: ['$validated', true]},~1, 0
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
        validTime:{
            $sum:{
                $cond: [
                    {$eq: ['$validated', true]}, '$totalTime', 0
                ]
            }
        },
        totalTime:{
        	$sum: '$totalTime',
        },
        uris:{
            $addToSet:{
                $cond: [
                    {$eq: ['$type', 'browser']},
                    '$uri',
                    ''
                ]
            }
        },
        
        //files:{
        //    $addToSet:{
        //        $cond: [
        //            {$ne: ['$type', 'browser']},
        //            '$pageTitle',
        //            ''
        //        ]
        //    }
        //},
        pageTitles:{
             $addToSet:{
                $cond: [
                    {$eq: ['$type', 'browser']},
                    '$pageTitle',
                    ''
                ]
            }
        },
        systemProjects:{
             $addToSet:{
                $cond: [
                    {$eq: ['$type', 'browser']},
                    '$project._id',
                    ''
                ]
            }
        },
        logs:{
            $push:{
                _id: '$_id',
                logHour: '$logHour',
                uri: '$uri',
                pageTitle: '$pageTitle',
                updateDate: '$updateDate',
                project: '$project',
                matchedProjects: '$matchedProjects',
                private: '$private',
                validated: '$validated',
                usedForTraining: '$usedForTraining',
                type: '$type',
                relatedLog: '$relatedLog',
                idleTime: '$idleTime',
                totalTime: '$totalTime'
            }
        }
    }
},
{
	$sort:{ _id: 1, }
}
*/

