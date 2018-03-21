import stripe from 'stripe';

plansFixtures = function(){
	var plans = PlanTypes.find().fetch();
	if(plans.length === 0){

		console.log('Creating plans..');
		
		var planTypes = [
			{
				plan_id: 'free_plan',
				name: 'Free Plan',
				interval: 'month',
				interval_count: 1,
				currency: 'eur',
				amount: 0,
				trial_period_days: 30,
				statement_descriptor: 'Opz.io Free Plan',
				metadata: {
					minUsers: 1,
					maxUsers: 1,
					maxGoals: 5,
					maxProjects: 1,
					maxWorkspaces: 1,
					canUseProjects: false,
					canInviteExternal: false,
				}
			},
			{
				plan_id: 'lite_plan',
				name: 'Lite Plan',
				interval: 'month',
				interval_count: 1,
				currency: 'eur',
				amount: 1699, //16.99€
				trial_period_days: 30,
				statement_descriptor: 'Opz.io Lite Plan',
				metadata: {
					minUsers: 1,
					maxUsers: 5,
					maxGoals: 15,
					maxProjects: 25,
					maxWorkspaces: 15,
					canUseProjects: true,
					canInviteExternal: false,
				}
			},
			{
				plan_id: 'medium_plan',
				name: 'Medium Plan',
				interval: 'month',
				interval_count: 1,
				currency: 'eur',
				amount: 1499, //14.99€
				trial_period_days: 30,
				statement_descriptor: 'Opz.io Medium Plan',
				metadata: {
					minUsers: 6,
					maxUsers: 15,
					maxGoals: null,
					maxProjects: 50,
					maxWorkspaces: 50,
					canUseProjects: true,
					canInviteExternal: true,
				}
			},
			{
				plan_id: 'large_plan',
				name: 'Large Plan',
				interval: 'month',
				interval_count: 1,
				currency: 'eur',
				amount: 1299, //12.99€
				trial_period_days: 30,
				statement_descriptor: 'Opz.io Large Plan',
				metadata: {
					minUsers: 16,
					maxUsers: 30,
					maxGoals: null,
					maxProjects: null,
					maxWorkspaces: null,
					canUseProjects: true,
					canInviteExternal: true,
				}
			},
			{
				plan_id: 'enterprise_plan',
				name: 'Enterprise Plan',
				interval: 'month',
				interval_count: 1,
				currency: 'eur',
				amount: 1499, //7.99€
				trial_period_days: 30,
				statement_descriptor: 'Opz.io Enterprise Plan',
				metadata: {
					minUsers: 31,
					maxUsers: null,
					maxProjects: null,
					canUseProjects: true,
					canInviteExternal: true,
				}
			},
		]

		for(var i=0; i<planTypes.length; i++){

			PlanTypes.insert({
				plan_id: planTypes[i].plan_id,
				name: planTypes[i].name,
				interval: planTypes[i].interval,
				interval_count: planTypes[i].interval_count,
				currency: planTypes[i].currency,
				amount: planTypes[i].amount,
				trial_period_days: planTypes[i].trial_period_days,
				statement_descriptor: planTypes[i].statement_descriptor,
				metadata: planTypes[i].metadata
			});

			console.log('Inserted plan ' + planTypes[i].name);

			// stripe.plans.create({
			// 	id: planTypes[i].plan_id,
			// 	name: planTypes[i].name,
			// 	interval: planTypes[i].interval,
			// 	interval_count: planTypes[i].interval_count,
			// 	currency: planTypes[i].currency,
			// 	amount: planTypes[i].amount,
			// 	trial_period_days: planTypes[i].trial_period_days,
			// 	statement_descriptor: planTypes[i].statement_descriptor,
			// 	metadata: planTypes[i].metadata
			// }, function(err, plan) {
			// 	if(err){
			// 		console.log(err)
			// 	}
			// 	else{
			// 		console.log('[STRIPE] created plan');
			// 	}
			// });
		}

	}
}