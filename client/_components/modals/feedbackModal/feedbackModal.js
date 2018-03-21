Template.feedbackModal.events({
	'click .modal-primary-action': function(e, t){
		console.log('send feedback');

		var submitBtn = $(e.currentTarget);
		
		var message = t.$('form textarea').val();
		var wantSlack = t.$('#joinOnSlack').prop('checked');
		var modal = $('#feedbackModal');

		if(message === ''){
			toastr.error('Please provide a message.');
			return;
		}
		
		submitBtn.attr('disabled', true).addClass('m-progress');

		Meteor.call('sendFeedbackMessage', message, wantSlack, function(err, data){
			if(err){
				console.log(err);
			}
			else{
				modal.modal('hide');
				Meteor.setTimeout(function(){
					toastr.success('Thanks for leaving your feedback, we\'ll get in touch with you!');
				},500)
			}
			
			submitBtn.attr('disabled', false).removeClass('m-progress');
		});
	}
});