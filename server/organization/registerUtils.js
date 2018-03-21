createOrganization = function(name){
	if(typeof(name) === 'string' && name.length > 0 && name !== ' '){
		
		//Meteor.call('s_addOrganization');

		return Organizations.insert({
			'createDate': new Date(),
			'updateDate': new Date(),
			'name': name,
			'admin': [],
		});
	}
};
createOrganizationProfile = function(orgId, planType){
	if(typeof(orgId) !== 'undefined'){
		var organization = Organizations.findOne({
			_id: orgId
		});

		switch(planType){
			default:
			case 'single':
				var planFeatures = {
					'type': 'single',
					'projectCap': 5,
					'usersCap': 1,
					'invitedUsers': 0,
					'fee': 0,
					'daysForTrial': 30
				}
				break;

			case 'lite':
				var planFeatures = {
					'type': 'lite',
					'projectCap': 10,
					'usersCap': 5,
					'invitedUsers': 0,
					'fee': 12,
					'daysForTrial': 30
				}
				break;

			case 'medium':
				var planFeatures = {
					'type': 'medium',
					'projectCap': 30,
					'usersCap': 15,
					'invitedUsers': 0,
					'fee': 16,
					'daysForTrial': 30
				}
				break;

			case 'large':
				var planFeatures = {
					'type': 'large',
					'projectCap': 60,
					'usersCap': 30,
					'invitedUsers': 0,
					'fee': 25,
					'daysForTrial': 30
				}
				break;
		}

		return OrganizationProfile.insert({
			'createDate': new Date(),
			'updateDate': new Date(),
			'organization': orgId,
			'name': organization.name,
			'admin': [],
			'plan': planFeatures,
			'ignoreParsingKeywords': [],
			'workableDailyHours' : 8,
			'workableWeekDays' : [1, 2, 3, 4, 5],
			'workableMonthDays' : 21,
			'workStartHour' : 9,
			'workEndHour' : 18,
			'breakHours' : 1
		});
	}
};