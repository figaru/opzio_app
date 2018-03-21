Meteor.methods({
	'public.getTotalHours': function(){
		this.unblock();

		console.log('aggregating hours...')

		var data = UserLogs.aggregate([
			{
				$match:{
					createDate:{
						$gte: new Date(moment().subtract(1, 'month').toISOString)
					}
				}
			},
			{
			    $group:{
			        _id: null,
			        totalTime:{
			            $sum: '$totalTime'
			        },
			    },
			},
		]);

		console.log(data);

		return data;
	}
});