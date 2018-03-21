Meteor.methods({
	//Sends a invite link from one user to another
	'auth.sendUserInvite': function(email, role, signupId){
		this.unblock();
		
		if(!this.userId){ return; }

		if(!isAdmin(this.userId)){
			throw new Meteor.Error(500, 'No permission to perform action.');
		}

		check(email, String);
		check(role, String);

		var inviteToken = generateLinkToken();
		var user = Meteor.users.findOne({_id:this.userId});
		var organization = user.profile.organization;
		var organizationName = Organizations.findOne({_id:organization}).name;

		if(typeof signupId === 'string'){
			var existingSignup = Signups.findOne({
				_id: signupId
			});
			
			role = existingSignup.role;
		}

		console.log('invite user with role ' + role)

		//Check 
		var currentUsers = Meteor.users.find({
			'profile.organization': organization, 
			active:true
		}).fetch().length;

		var orgProfile = OrganizationProfile.findOne({organization:organization});
		
		var usersCap = orgProfile.plan.usersCap;
		
		var invitedUsers = Signups.find({
			organization:organization,
			revoked: false
		}).fetch();
		
		var available = usersCap - invitedUsers.length -1;

		if(available <= 0){
			return {
				limit: true
			}
		}

		Signups.upsert({
			email: email
		},
		{
			$set:{
				resentDate: new Date(),
				inviteBy: this.userId,
				organization: organization,
				role: role,
				type: 'invite',
				inviteToken: inviteToken,
				used: false,
				revoked: false,
			},
			$setOnInsert: {
				email: email,
				createDate: new Date(),
			}
		});

		OrganizationProfile.update({
			organization: organization
		},{
			$inc:{
				'plan.invitedUsers': 1
			}
		});

		//Update main intro status for team invites
		Meteor.users.update({ _id: this.userId },
		{
			$set:{
				'mainIntro.inviteTeam': true
			}
		});

		var inviteLink = 'https://www.opz.io/register/'+inviteToken+'#'+organization+'&'+email;
		var body = buildInviteEmail(inviteLink, organizationName);


		Meteor.defer(function(){
			try{
				Email.send({
					to: email,
					from: 'info@opz.io',
					subject: user.profile.firstName + ' ' + user.profile.lastName + ' sent you and invite for Opz.io',
					html: body
				});
			}
			catch(err){
				console.log('ERR: error sending signup email!')
				//console.log(err)
				throw new Meteor.Error(500, 'There was an error sending the invite email.');
			}

			try{
				Email.send({
					to: 'lawbraun.almeida@gmail.com',
					from: 'info@opz.io',
					subject: 'Invite sent',
					html: 'A user was invited on '+ moment().format('DD @ HH:mm') +' for organization ' + organizationName
				});
			}
			catch(err){
				console.log('Error sending admin signup email')
			}
		});

		return {
			limit: false
		}

	},
	//Validates/invalidates a login token
	'auth.validateInvite': function(inviteToken){
		var response = {
			valid: false,
			reason: 'The signup token is invalid.'
		}

		//Get signup
		var signup = Signups.find({
			inviteToken: inviteToken,
			used: false,
			revoked: false,
		}).fetch();

		if(signup.length > 0){
			
			signup = signup[0];

			if(!signup.revoked && !signup.used){
				var organization = Organizations.findOne({
					_id: signup.organization
				});
				response['valid'] = true;
				response['reason'] = 'Valid invite token';
				response['organization'] = organization.name;
				response['orgId'] = organization._id;
				response['inviteToken'] = signup.inviteToken;
				response['email'] = signup.email;
			}
			else{
				response['reason'] = 'This signup has either been claimed or revoked.';
			}
		}


		return response;
	},
	//Returns invited users for a given organization
	'auth.getInvitedUsers': function(){
		if(!this.userId){ return; }

		var user = Meteor.users.findOne({_id: this.userId});
		
		if(typeof user.profile.organization !== 'undefined'){
			var signups = Signups.find({
				organization: user.profile.organization
			},{
				sort:{
					resentDate: -1,
					revoked: 1,
				}
			}).fetch();

			return signups;
		}
	},
	//Revokes an invite for a certain user
	'auth.revokeInvite': function(inviteId){
		if(!this.userId){ return; }
		check(inviteId, String);


		var signup = Signups.findOne({
			_id: inviteId,
			inviteBy: this.userId,
		});

		if(typeof signup !== 'undefined'){
			console.log('revoking..')
			Signups.update({
				_id: inviteId
			},{
				$set:{
					revoked: true
				}
			});

			OrganizationProfile.update({
				organization: signup.organization
			},{
				$inc:{
					'plan.invitedUsers': -1
				}
			});
		}
	}
})