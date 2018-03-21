Template.forgotPassword.onRendered(function(){
  $('.side-content').removeClass('display');
  $('.gn-menu-main').removeClass('expanded');
  
  Meteor.setTimeout(function(){
    $('.side-content').addClass('display');
  }, 100);
});

Template.forgotPassword.events({
  'blur #forgotPasswordEmail': function(e){
    var email = e.currentTarget.value;
    if(email !== ''){
      if(!validateEmail(email)){
        toastr.error('Please provide a valid email.', 'Invalid form');
      }
    }
  },
  'submit #forgotPasswordForm': function(e, t) {
    e.preventDefault();



    var forgotPasswordForm = $(e.currentTarget),
        email = forgotPasswordForm.find('#forgotPasswordEmail').val(),
        submitBtn = forgotPasswordForm.find('#submitEmail');

    if(email){
      submitBtn.attr('disabled', true).addClass('m-progress white');
      
      Accounts.forgotPassword({email: email}, function(err) {
        if(!err) {
          console.log('reset for ' + email);
          toastr.success('Password reset link sent to ' + email);
          submitBtn.removeClass('m-progress white').attr("disabled", false);
        }
        else{
          console.log(err)
          if(err.error === 403) {
            toastr.error('Error: ' + err);
          }
          submitBtn.removeClass('m-progress white').attr("disabled", false);
        }
      });
      
      return false;
    }
    else{
      toastr.error('Please provide an email.');
      submitBtn.removeClass('m-progress white').attr("disabled", false);
    }
  }
});