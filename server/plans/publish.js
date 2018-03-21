Meteor.publish('plans', function(){
	return PlanTypes.find({
		plan_id:{
			$ne: 'enterprise_plan'
		}
	},{
		sort:{
			amount: 1
		},
		fields:{
			//'plan_id': 0,
			'interval': 0,
			'interval_count': 0,
			'currency': 0,
			'statement_descriptor': 0
		}
	})
})