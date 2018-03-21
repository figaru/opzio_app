import Clipboard from 'clipboard';

Template.inviteUserModal.onRendered(function(){
	
	//$('#newUserModal').modal('toggle');
	
	Meteor.setTimeout(function(){
		var clipboard = new Clipboard('.copyLink', { container: document.getElementById('newUserModal') });

		clipboard.on('success', function(e) {
			toastr.info('<i class="fa fa-info-circle"></i>&nbsp;&nbsp;Copied invite link');
		    e.clearSelection();
		});
	}, 1500)
});

Template.inviteUserModal.helpers({

	'invitedUsers': function(){
		Meteor.setTimeout(function(){
			var clipboard = new Clipboard('.copyLink');
		}, 1500)

		return Signups.find({
			used:false
		}).fetch();
	},
	'getInviteStatus': function(){
		
		if(this.revoked){
			var usedInvite = 'Revoked';
		}
		else{
			if(this.used){
				var usedInvite = 'Yes';
			}
			else{ 
				var usedInvite = 'No';
			}
		}
		return usedInvite;
	},
	'getInviteActions': function(){
		if(this.revoked){
			var actions = '<td class="align-right"><a href="#" class="btn btn-outline-primary inviteAction" data-action="resend">Resend link</a></td>';
			var usedInvite = 'Revoked';
		}
		else{
			if(this.used){ 
				var usedInvite = 'Yes'; 
				var actions = '<td>N/A</td>';
			}
			else{
				var inviteLink = 'https://opz.io/register/'+this.inviteToken+'#'+this.organization+'&'+this.email;
				var usedInvite = 'No';
				var actions = '<td class="align-right"><a href="#" class="btn btn-outline-primary copyLink" data-clipboard-text="'+inviteLink+'">Copy Link</a>'
								+'<a href="#" class="btn btn-secondary inviteAction ml-1" data-action="revoke">Revoke Invite</a></td>';
			}
		}
		Meteor.setTimeout(function(){
			initTooltips();
		},1500);
		return actions;
	},

	'getAvailableInvites': function(){

		var orgProfile = OrganizationProfile.findOne();

		var available = 0;

		if(typeof orgProfile !== 'undefined' && Meteor.userId() !== null){
			
			var usersCap = OrganizationProfile.findOne().plan.usersCap;
			var usedInvites = 0;
			var invites = Signups.find().fetch();

			if(invites.length > 0){
				_.each(invites, function(invite, key){
					//console.log(invite.used, !invite.revoked)
					if(!invite.revoked){
						usedInvites +=1;
					}
				});

				//console.log('usedInvites ' + usedInvites);
				available = usersCap - usedInvites -1; // -1 for current user. There's always one user
				
				if(available < usersCap){
					return available + ' invites available';
				}
				else{
					$('#inviteUser').attr('disabled', true);
					return 'No more invites available';
				}
			}
			else{
				available = usersCap - 1;
				$('#inviteUser').attr('disabled', false);
				return available + ' invites available';
			}
		}
	},
});


Template.inviteUserModal.events({
	'input #userInviteEmail': function(e){
		var email = e.currentTarget.value;
		if(email.length > 0){
			var submitBtn = $('#inviteUser');
			if(validateEmail(email)){
				Meteor.call('checkForExistingEmail', email, function(err, data){
					console.log('checkForExistingEmail')
					console.log(data)
					if(data){
						submitBtn.attr('disabled', true);
						$('.emailError').text('This email has been taken. Please chose another one.')
					}
					else{
						submitBtn.attr('disabled', false);
						$('.emailError').text('')
					}
				});
			}
		}
	},
	'click .modal-primary-action': function(e, t){
		console.log('send user invite');
		var submitBtn = $(e.currentTarget);

		var email = $('#userInviteEmail').val();
		var role = t.$('.userRole').attr('data-role');

		if(email !== ''){
			
			submitBtn.addClass('m-progress white').attr('disabled', true);

			if(validateEmail(email)){
				Meteor.call('checkForExistingEmail', email, function(err, data){
					if(data){
						$('.emailError').text('This email has been taken. Please chose another one.')
						submitBtn.removeClass('m-progress white').attr('disabled', false);
						return;
					}
					else{
						$('.emailError').text('')
					}
				});
			}
			else{
				toastr.error('Please provide a valid email.', 'Invalid form');
				submitBtn.removeClass('m-progress').attr('disabled', false);
				return;
			}

			Meteor.call('auth.sendUserInvite', email, role, false, function(err, data){
				if(!err){
					if(data.limit){
						toastr.warning('You\'ve reached the Beta plan limit. Contact us if you need more user slots.');
					}
					else{
						toastr.success('An invite has been sent to ' + email);
					}
					$('#userInviteEmail').val('')
				}
				else{
					console.log(err)
					toastr.error('There was an error sending the invite email.');
				}
				submitBtn.removeClass('m-progress white').attr('disabled', false);
			});
		}
		else{
			toastr.error('Email cannot be empty.', 'Invalid form');
		}
	},
	'click .inviteAction': function(e){
		e.preventDefault();
		var el = $(e.currentTarget);
		var action = el.attr('data-action');
		var row = el.closest('.inviteRow');
		var inviteId = row.attr('data-invite');

		//console.log(inviteId)

		switch(action){
			case 'resend':
				var email = row.find('.inviteEmail').text();
				el.addClass('m-progress white').attr('disabled', true);

				Meteor.call('auth.sendUserInvite', email, 'none', inviteId, function(err, data){
					if(!err){
						if(data.limit){
							el.removeClass('m-progress white').attr('disabled', false);
							toastr.warning('You\'ve reached the Beta plan limit. Contact us if you need more user slots.');
						}
						else{
							toastr.success('An invite has been sent to ' + email);
							renderSentInvites();
						}
					}
					else{
						console.log(err)
						el.removeClass('m-progress white').attr('disabled', false);
						toastr.error('There was an error resending the invite email.');
					}
				});
				break;

			case 'revoke':
				Meteor.call('auth.revokeInvite', inviteId, function(err, data){
					if(!err){
						toastr.success('Invite was revoked.');
						renderSentInvites();
					}
					else{
						toastr.error('There was an error revoking the invite.')
					}
				});
				break;
			
		}
	}
});


renderSentInvites = function(){
	if(Meteor.userId() !== null) return;
	
	Meteor.call('auth.getInvitedUsers', function(err, invites){
		console.log(invites)
		var userListEl = $('#invitedUsersList');
		if(!err){
			if(invites.length > 0){
				userListEl.html('');
				
				var userRows = [];
				
				_.each(invites, function(invite, key){
					if(invite.used){ var usedInvite = 'Yes'; }
					else{ var usedInvite = 'No'; }

					console.log(invite)


					if(invite.revoked){
						var actions = '<a href="#" class="btn btn-outline-primary inviteAction" data-action="resend">Resend link</a>';
						var usedInvite = 'Revoked';
					}
					else{
						if(invite.used){ 
							var usedInvite = 'Yes'; 
							var actions = 'N/A';
						}
						else{
							var inviteLink = 'https://opz.io/register/'+invite.inviteToken+'#'+invite.organization+'&'+invite.email;
							
							var usedInvite = 'No';
							
							var actions = '<a href="#" class="btn btn-primary copyLink"  data-clipboard-text="'+inviteLink+'">Copy Link</a>'
											+'<a href="#" class="btn btn-secondary inviteAction" data-action="revoke">Revoke Invite</a>'
							
						}
					}
					
					var userRow = '<tr class="inviteRow" data-invite="'+ invite._id +'">'
									+'<th class="inviteEmail">'+ invite.email +'</th>'
									+'<td>'+ formatDate(invite.createDate,"DD/MM/YY HH:mm") + '</td>'
									+'<td>'+ usedInvite +'</td>'
									+'<td class="align-right">'
										+ actions
									+'</td>'
								+'</tr>';
					userRows.push(userRow);

				});

				userRows = userRows.join('');

				var table = '<table class="table table-striped">'
								+'<thead>'
									+'<tr>'
										+'<th>Email</th>'
										+'<th>Send date</th>'
										+'<th>Registered</th>'
										+'<th>Actions</th>'
									+'</tr>'
								+'</thead>'
								+'<tbody>'
									+ userRows
								+'</tbody>'
							+'</table>';

				userListEl.html(table);

				initTooltips();
			}
			else{
				userListEl.html('<div class="align-center"><h4>You haven\'t sent any invites yet.</h4></div>')
			}

		}
		else{
			toastr.error('There was an error retrieving invited members')
		}
	});
}