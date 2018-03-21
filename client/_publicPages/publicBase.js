Template.publicBase.onCreated(function(){

  $('body').css({
  	'background': '#FFF'
  });
  /*
  $(document).on('click', 'a.main-link', function(){
    Meteor.setTimeout(function(){      
      $('html, body').animate({
            scrollTop: 0
          }, 800);
    }, 100);
  });
  */
});

/*
Template.publicBase.onDestroyed(function(){
  $(window).off('scroll');
  $(window).off('resize');
});
*/