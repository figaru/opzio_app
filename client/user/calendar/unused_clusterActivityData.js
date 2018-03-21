clusterActivityData = function(data){
	console.log('clusterActivityData')
	//var groups = new vis.DataSet();
	var items = [];
	var userOffset = moment().utcOffset() / 60;
	var individualLogs = {};

	//var colors = ['blue','aqua','green','orange','purple','red'];	
	//var randIndex = Math.floor(Math.random() * (colors.length - 1));

	for(var i=0; i<data.length;i++){
		// if(i & 1){
		// 	var groupColor = 'gray-lightest';	
		// }
		// else{
		// 	var groupColor = 'gray-lighter';
		// }
		
		var clusters = [];
		var dataPoints = [];

		//Build dataPoints for clustering
		if(data[i].logs.length > 0){
			let logs = data[i].logs;

			//Stores every log in an object for later easy retrieval
			var logsTmpHolder = {};
			
			for(var j=0; j<logs.length;j++){
				let log = logs[j];

				logsTmpHolder[log._id] = log;

				individualLogs[log._id] = log;

				//console.log(log)
				var startDate_epoch = moment(log.createDate).unix();
				
				//get end date by looking at duration and increase to start time
				var endDate_epoch = moment(log.createDate).add(log.totalTime, 'seconds').unix();

				dataPoints.push({
					id: log._id,
					startEpoch: startDate_epoch,
					endEpoch: endDate_epoch
				});
			}

			clusters.push({
				activity: data[i]._id,
				dataPoints: dataPoints,
			});
		}

		//Determine clusters
		if(clusters.length > 0){

			var clusterData = [];

			for(var j=0; j<clusters[0].dataPoints.length; j++){
				clusterData.push([
					clusters[0].dataPoints[j].startEpoch,
					clusters[0].dataPoints[j].endEpoch,
					{ id: clusters[0].dataPoints[j].id }
				])
			}

			var knn = new KNN(clusterData)

			knn.iterations(750);

			//data from which to identify clusters, defaults to []
			knn.data(clusterData);

		}
		
		clusters = knn.clusters();

		//Add clusters to timeline
		for(var j=0; j<clusters.length; j++){
			//Store items IDs for later referrence in top level groups
			var clusterItems = [];
			
			var minClusterEpoch = maxClusterEpoch = 0;

			for(var f=0; f<clusters[j].points.length; f++){

				clusterItems.push(clusters[j].points[f].id);

				//Check if is 0, otherwise replace when bigger
				if(maxClusterEpoch === 0) maxClusterEpoch = clusters[j].points[f].location[1];
				if(clusters[j].points[f].location[1] > maxClusterEpoch) maxClusterEpoch = clusters[j].points[f].location[1]; 
				
				if(minClusterEpoch === 0) minClusterEpoch = clusters[j].points[f].location[0];
				if(clusters[j].points[f].location[0] < minClusterEpoch) minClusterEpoch = clusters[j].points[f].location[0];

				//Add every point from the cluster to the items list
				var log = logsTmpHolder[clusters[j].points[f].id];
				var endDate = moment(log.createDate).add(log.totalTime, 'seconds');

				

				/*
				items.add({
					id: log._id,
					group: 'group_'+data[i]._id,
					subgroup: 'cluster_'+j+'_group_'+data[i]._id,
					content: '<span class="item-description tooltipster" title="<h4 class=\'title\'>Project Activity</h4><p>'+ log.pageTitle +'<br>Some stuff comes here</p>">'+log.pageTitle+'</span>',
					//Add hidden class so that individual items are hidden at first
					className: 'timeline-item blue hidden ' + log._id,
					name: log.pageTitle,
					start: log.createDate,
					totalTime: log.totalTime,
					end: endDate,
					inititalStart: log.createDate,
					inititalEnd: endDate,
					type: 'range',
					itemType: 'activity',
					editable: {
						updateTime: false
					}
				});
				*/
			}

			//Set cluster start/end dates
			var startTime = moment.unix(maxClusterEpoch)
			var endTime = moment.unix(minClusterEpoch)

			//Crunch cluster logs for totalTime, privacy, validation, etc
			//console.log('------crunching cluster items-----')
			var clusterInfo = {};
			var classifiedCount = 0;
			var clusterTotalTime = 0;
			var privateTime = 0;
			var clusterValidTime = 0;
			var matchedProjects = {};
			clusterInfo['logCount'] = clusters[j].points.length;

			for(var c=0; c<clusterItems.length; c++){

				clusterTotalTime += logsTmpHolder[clusterItems[c]].totalTime;

				if(logsTmpHolder[clusterItems[c]].classified) classifiedCount+=1;

				if(logsTmpHolder[clusterItems[c]].private) privateTime += logsTmpHolder[clusterItems[c]].totalTime;
				
				//console.log(logsTmpHolder[clusterItems[c]].project)
				
				//Source of time distribution
				if(logsTmpHolder[clusterItems[c]].type in clusterInfo){
					clusterInfo[logsTmpHolder[clusterItems[c]].type] += logsTmpHolder[clusterItems[c]].totalTime;
				}
				else{
					clusterInfo[logsTmpHolder[clusterItems[c]].type] = logsTmpHolder[clusterItems[c]].totalTime;
				}

				//Time validation distribution
				if(logsTmpHolder[clusterItems[c]].validated) clusterValidTime += logsTmpHolder[clusterItems[c]].totalTime;
			}

			clusterInfo['classifiedCount'] = classifiedCount;
			clusterInfo['clusterTotalTime'] = clusterTotalTime;
			clusterInfo['privateTime'] = privateTime;
			clusterInfo['clusterValidTime'] = clusterValidTime;
			clusterInfo['privatePercentage'] = Math.round(privateTime / clusterTotalTime * 100);
			clusterInfo['validPercentage'] = Math.round(clusterValidTime / clusterTotalTime * 100);

			//console.log(clusterInfo)
			//console.log('\n')

			//Add Clusters

			items.push({
				title: data[i]._id,
				start: endTime.toISOString(),
				end: startTime.toISOString(),
				backgroundColor: 'grey',
				//icon: 'fa-calendar-o'
			})

			/*
			items.add({
				id: 'cluster_'+j+'_group_'+data[i]._id,
				group: 'group_'+data[i]._id,
				//subgroup: 'cluster_'+j+'_group_'+data[i]._id,
				className: 'cluster cluster_'+j+'_group_'+data[i]._id + ' pressaction',
				content: '<div class="cluster-info" style="width:100%;" title="Click once to select and drag\nClick and hold for more info\nDouble click to expand contents"><small title="Click and hold for more" class="font-weight-light">'+getStringFromEpoch(clusterTotalTime)+'</small></div>', 
				start: endTime.toDate(), 
				end: startTime.toDate(),
				type: 'range',
				name: data[i]._id,
				itemType: 'cluster',
				clusteritems: clusterItems.toString(),
				clusterInfo: JSON.stringify(clusterInfo)
			});
			*/
		}

		//Finally add top level groups
		//console.log(data[i])
		/*
		groups.add({
			id: 'group_'+data[i]._id,
			content: '<h6 class="font-weight-light"><a href="/project/'+data[i].id+'/dashboard">'+ data[i]._id +'</a></h6>',
			//nestedGroups: subgroupIDs,
			order: -1
		});
		*/

	}

	return {
		//'groups': groups,
		'items': items,
		'logs': individualLogs
	}
}