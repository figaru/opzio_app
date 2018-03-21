Meteor.methods({
	//Utility method to set the organization name to every profile document
	'setProfileName': function(){
		var organizations = Organizations.find().fetch();

		_.each(organizations, function(val, key){
			if(typeof val.name !== 'undefined'){
				var profile = OrganizationProfile.findOne({ organization:val._id });
				if(typeof profile !== 'undefined'){
					OrganizationProfile.update({
						_id: profile._id
					},
					{
						$set:{
							name: val.name
						}
					});
				}
			}
		});
	},
	'createDefaultProject': function(userId, orgId){
		Projects.insert({
			'createdOn': new Date(),
			'updatedOn': new Date(),
			'organization': orgId,
			'type' : 'unknown',
			'useForCategorization': true,
			'owner': [ userId ],
			'gitName': '',
			'name': 'Unknown',
			'totalTime': 0.0,
			'plannedTime': 0.0,
			'budget': 0,
			'team': [{
				'user': userId,
				'role': 'member',
			}],
			'visibility': 1, //1 for internal, 0 for private
			'state' : {
				'val' : 0,
				'type' : 'initiate'
			},
			'priority': {
				'val': 1,
				'type': 'normal',
			}
		});
	},
});