navigationScrollHandler = function(){
  if($(document).scrollTop() >= 18){
    $('.publicNav').addClass('expanded');
    //$('.gn-menu-main.alt .menu-brand img').removeClass('inverted');
  }
  else{
    $('.publicNav').removeClass('expanded');
    //$('.gn-menu-main.alt .menu-brand img').addClass('inverted');
  }
}

Template.homepage.onRendered(function(){
  Meteor.setTimeout(function(){
    initTooltips();
  }, 2000);

  if($(document).scrollTop() >= 18){
    $('.publicNav').addClass('expanded');
    //$('.gn-menu-main.alt .menu-brand img').removeClass('inverted');
  }
  else{
    $('.publicNav').removeClass('expanded');
    //$('.gn-menu-main.alt .menu-brand img').addClass('inverted');
  }

  $(window).on('scroll', navigationScrollHandler)
    
});

Template.homepage.onDestroyed(function(){
  $('.publicNav').addClass('expanded');
  $(window).off('scroll', navigationScrollHandler)
});

//Signup event
Template.homepage.events({
  'click .signUpBtn': function(e){
    var $btn = $(e.currentTarget);
    var $form = $btn.closest('.signup-form');
    var $input = $form.find('input');

    var email = $input.val();

    if(email.length === 0){
      $form.find('.error').text('Please provide an email.').fadeIn();
    }
    else{
      if(validateEmail(email)){
        $form.find('.error').hide();
        //Close all signup forms
        $('.signup-form').slideUp();
        $form.next().addClass('thankyou');
        $form.next().find('.signup-title').html('Thanks!<br><span style="font-size:18px;">Lookout for the 30th, we\'ll keep you posted!</span>').css({
          'font-size': '22px',
        })
        
        $(document).find('.bot-img').delay('800').attr('src', '/images/bot/happy2.png');
        
        Meteor.call('signupUser', email);
      }
      else{
        $form.find('.error').text('Please provide a valid email address.').fadeIn();
      }
    }

  },
  'click #viewMore': function(e){
    e.preventDefault();

    Session.set('hasVisitedHome', true);
    
    $('html, body').animate({
      scrollTop: $("#productFeatures").offset().top - 50
    }, 1000);

  }
});

