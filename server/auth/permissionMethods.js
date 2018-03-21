Meteor.methods({
	/* USER related roles */
	'setUserRole': function(userId, role){
		if( isAdmin(this.userId) || isRoot(this.userId) ){
			switch(role){
				case 'root':
					if(isRoot(Meteor.userId())){

						if(isLastRoot(userId)){
							throw new Meteor.Error(500, 'System must have at least one root user.')
						}
						else{
							Meteor.users.update({_id:userId}, { $set:{ 'roles':new Array() }, });
							Meteor.users.update({ _id:userId }, { $push:{'roles': role} });
						}
					}
					else{
						throw new Meteor.Error(500, 'You don\'t have permission to change roles.')
					}
					break;

				case 'admin':

					if(isLastRoot(userId)){
						throw new Meteor.Error(500, 'System must have at least one root user.')
					}
					else if(isLastAdmin(userId)){
						throw new Meteor.Error(500, 'Organization must have at least one administrator.')
					}
					else{
						Meteor.users.update({_id:userId}, { $set:{ 'roles':new Array() }, });
						Meteor.users.update({ _id:userId }, { $push:{'roles': role} });
					}
					break;

				case 'finance':
					if(isLastRoot(userId)){
						throw new Meteor.Error(500, 'System must have at least one root user.')
					}
					else if(isLastAdmin(userId)){
						throw new Meteor.Error(500, 'Organization must have at least one administrator.')
					}
					else{
						Meteor.users.update({_id:userId}, { $set:{ 'roles':new Array() }, });
						Meteor.users.update({ _id:userId }, { $push:{'roles': role} });
					}
					break;

				case 'staff':
					if(isLastRoot(userId)){
						throw new Meteor.Error(500, 'System must have at least one root user.')
					}
					else if(isLastAdmin(userId)){
						throw new Meteor.Error(500, 'Organization must have at least one administrator.')
					}
					else{
						Meteor.users.update({_id:userId}, { $set:{ 'roles':new Array() }, });
						Meteor.users.update({ _id:userId }, { $push:{'roles': role} });
					}
					break;

				case 'guest':
					if(isLastRoot(userId)){
						throw new Meteor.Error(500, 'System must have at least one root user.')
					}
					else if(isLastAdmin(userId)){
						throw new Meteor.Error(500, 'Organization must have at least one administrator.')
					}
					else{
						Meteor.users.update({_id:userId}, { $set:{ 'roles':new Array() }, });
						Meteor.users.update({ _id:userId }, { $push:{'roles': role} });
					}
					break;
				default:
					throw new Meteor.Error(500, 'Unexpected error while setting role.');
					break;
			}
		}
		else{
			throw new Meteor.Error(500, 'You don\'t have permission to change roles.')
		}
	},
	'addUserToRole': function(user, role){
		Roles.addUsersToRoles(user, role);
	},
	'removeUserFromRole': function(user, role){
		Roles.removeUsersFromRoles(user, role);
	},
	/* ORGANIZTION related roles */
	'setOrganizationAdmin': function(user, orgId){
		Meteor.defer(function(){
			if(typeof(Organizations.findOne({ _id: orgId })) !== 'undefined'){
				Organizations.update({
					_id: orgId
				},
				{
					$push: {
						'admin': user
					}
				});
			}
		})
	},
	'setProfileAdmin': function(user, orgId){
		Meteor.defer(function(){
			if(typeof(OrganizationProfile.findOne({ organization: orgId })) !== 'undefined'){
				OrganizationProfile.update({
					organization: orgId
				},
				{
					$push: {
						'admin': user
					}
				});
			}
		})
	},
})