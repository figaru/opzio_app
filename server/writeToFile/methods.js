import fs from 'fs';

Meteor.methods({
	'writeToFile': function(){

		var minDate = '2016-08-01T00:00:00.000Z';
		var maxDate = '2016-08-31T23:59:59.000Z';

		var verboseMonth = moment(minDate).format('MMM_YYYY');

		console.log('for ' + verboseMonth)
		
		var logs = UserLogs.aggregate([
			{
				$match:{
					organization: 'XJTna8qD8JPxajsNz',
					createDate:{
						'$gte': new Date(minDate),
						'$lt': new Date(maxDate),
					},
					type: 'browser'
				}
			},
			{
				$group:{
					_id: {
						user: '$user',
						domain: '$domain',
					},
					totalTime: {
						$sum: '$totalTime'
					}
				}
			},
			{
				$sort:{
					totalTime: -1
				}
			},
			{
				$group:{
					_id: '$_id.user',
					totalTime:{
						$sum: '$totalTime'
					},
					domains:{
						$push:{
							domain: '$_id.domain',
							totalTime: '$totalTime'
						}
					}
				}
			},
			{
				$group:{
					_id: null,
					users:{
						$push:{
							user: '$_id',
							totalTime: '$totalTime',
							domains: '$domains'
						}
					},
					allDomains:{
						$addToSet: '$domains.domain'
					}
				}
			},
			{
				$unwind: '$users'
			},
			{
				$project:{
					_id: '$users.user',
					totalTime: '$users.totalTime',
					domains: '$users.domains',
					allDomains: '$allDomains'
				}
			},
			{
				$sort:{
					totalTime: -1
				}
			}
		]);

		var allDomains = [].concat.apply([], logs[0].allDomains);
		//We must see which domains are actually relevant
		//and remove those who aren't from allDomains array
		//We consider the first 20 domains in the user's array
		var usableDomains = [];
		_.each(logs, function(log, key){
			var userDomains = [];
			for(var i=0;i<20;i++){
				userDomains.push({
					'domain': log.domains[i].domain,
					'totalTime': log.domains[i].totalTime
				});
				usableDomains.push(log.domains[i].domain);
			}
			//Replace log domains by the top 20 in userDomains
			log.domains = userDomains;
		});

		//Trim duplicates
		usableDomains = _.uniq(usableDomains);

		//Fill each user domains array with missing domains
		for(var j=0; j<logs.length; j++){
			console.log('user ' + logs[j]._id)
			for(var i=0; i<usableDomains.length; i++){
				var obj = _.find(logs[j].domains, function(obj) { return obj.domain === usableDomains[i] });
				if(typeof(obj) === 'undefined'){
					logs[j].domains.push({
						'domain': usableDomains[i],
						'totalTime': 0
					});
				}
			};
			//Remove property allDomains which we don't need anymore
			delete logs[j].allDomains;
		};

		console.log('done');


		var file = '';

		var firstLine = 'User';
		var userLines = '';

		_.each(logs, function(log, key){
			var user = Meteor.users.findOne({ _id: log._id });
			var userLine = user.profile.firstName + ' ' + user.profile.lastName;

			for(var d=0; d<usableDomains.length;d++){
				var userDomain = _.find(log.domains, function(obj) { return obj.domain === usableDomains[d] });
				userLine += ',' + userDomain.totalTime / 60; //Return minutes, not seconds
			}
			userLines += userLine+'\n';
		});

		for(var i=0; i<usableDomains.length; i++){
			firstLine += ','+usableDomains[i];
		}
		firstLine += '\n';

		file += firstLine;

		file += userLines;

		var filename = 'opzio_'+verboseMonth+'.csv'

		fs.writeFile("/tmp/"+filename, file, function(err) {
		    if(err) { return console.log(err); }
		    console.log("The file was saved!");
		});

		return logs;
	},
	'getLawTime': function(){
		var minDate = '2016-09-01T00:00:00.000Z';
		var maxDate = '2016-09-30T23:59:59.599Z';

		var data = UserLogs.aggregate([
			{
			    $match:{
			        user: 'ov7wgeBLkbvwfXgA3',
			        createDate:{
			            '$gte': new Date(minDate),
			            '$lt': new Date(maxDate),
			        },
			    }
			},
			{
			    $group:{
			        _id: '$project',
			        total: {
			            '$sum': '$totalTime'
			        }
			    }
			},
			{
			    $sort:{
			        total: -1
			    }
			}
		]);

		var totalTime = 0;
		var results = [];
		_.each(data, function(val, key){
			totalTime += val.total;
			console.log(val._id)
			if(val._id !== null && val._id.length > 0){
				var project = Projects.findOne({
					_id: val._id
				}).name;
				var time = getStringFromEpoch(val.total, true);
				results.push({
					'project': project,
					'time': time,
					'in_minutes': val.total / 60
				});
			}
			else{
				var time = getStringFromEpoch(val.total, true);
				results.push({
					'project': 'OTHER/UNKNOWN',
					'time': time,
					'in_minutes': val.total / 60
				});
			}
		});
		console.log('total: ' + getStringFromEpoch(totalTime, true));
		for(var i=0; i<results.length;i++){
			console.log(results[i]);
		}
	}
});