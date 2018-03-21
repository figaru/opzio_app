Meteor.methods({
	'project.saveBudgetType': function(projectId, isHourValue){
		check(isHourValue, Boolean);
		check(projectId, String);
		var budgetType = (isHourValue == true ? "hourValue" : "fixedBudget");

		Projects.update({
			_id: projectId
		},
		{
			$set:{
				hasSetupBudget: true,
				budgetType: budgetType,
				budget: 0,
				hourValue: 0,
				applyHourValuePerTeam: false,
			}
		});
	},

	//Update project billing option (same value for all members or each member's hour rate)
	'project.updateHourBillingOption': function(projectId, billingOption, hourValue){
		check(projectId, String);
		check(billingOption, String);

		if(billingOption === 'true'){
			check(hourValue, String);

			Projects.update({
				_id: projectId
			},
			{
				$set:{
					applyHourValuePerTeam: true,
					hourValue: parseFloat(hourValue)
				}
			});
		}
		else{
			Projects.update({
				_id: projectId
			},
			{
				$set:{
					applyHourValuePerTeam: false,
				}
			})
		}
	},
	'project.updateTeamHourRate': function(projectId, userData){
		check(projectId, String);
		check(userData, Array);

		console.log(userData)

		for(var i=0; i<userData.length; i++){
			Projects.update({
				_id: projectId,
				'team.user': userData[i].user
			},
			{
				$set:{
					'team.$.hourRate': parseFloat(userData[i].value)
				}
			});
		}
	}
});