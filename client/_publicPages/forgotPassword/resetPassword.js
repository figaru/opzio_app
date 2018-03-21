Template.resetPassword.onCreated(function() {
  if (Accounts._resetPasswordToken) {
    Session.set('resetPassword', Accounts._resetPasswordToken);
  }
});

Template.resetPassword.onRendered(function(){
  $('.side-content').removeClass('display');
  $('.gn-menu-main').removeClass('expanded');
  
  Meteor.setTimeout(function(){
    $('.side-content').addClass('display');
  }, 100);
});

Template.resetPassword.events({
  'submit #resetPassword': function(e, t) {
    e.preventDefault();
    var resetPasswordForm = $(e.currentTarget),
        password = resetPasswordForm.find('#firstPass').val(),
        passwordConfirm = resetPasswordForm.find('#secondPass').val(),
        submitBtn = resetPasswordForm.find('#resetPassword');

    if(password == passwordConfirm){
      
      submitBtn.attr('disabled', true).addClass('m-progress white');
      
      Accounts.resetPassword(Session.get('resetPassword'), password, function(err) {
        
        submitBtn.removeClass('m-progress white').attr('disabled', false);
        
        if (err) {
          if(err.message === 'Token expired [403]'){
            toastr.error('This token has expired.');
          }
          else{
            toastr.error('Error while reseting your password.');
          }
        }
        else {
          toastr.success('Password changed successfully.');
          submitBtn.removeClass('m-progress white').attr('disabled', false);

          _initDefaults();
          
          Router.go('mainDashboard');
        }
      });
    }
    else{
      toastr.error('Passwords don\'t match.');
      submitBtn.removeClass('m-progress white').attr('disabled', false);
    }
    return false;
  },
});