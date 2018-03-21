drawPage = function(){
	var height = $(window).height();
	var width = $(window).width();
  var routeName = Router.current().route.getName();

  if(width > 991){
    $('.section.full-height').css({
      'height': (height*.85) + 'px',
    });

    $('.section').each(function(k, el){
      let image = $(el).find('.image-reference');
      let desc = $(el).find('.align-with-image');

      if(typeof image !== 'undefined' && image.length > 0){
        let imgH = image.height();
        let descHeight = desc.height();
        var topPosition = (imgH * .5) - (descHeight - (descHeight*0.1));
        if(topPosition <= 0){
          topPosition = 10;
        }

        desc.css({
          'position': 'absolute',
          'top': topPosition+'px',
        });
      }
    
      desc.animate({
        'opacity': 1
      }, 500);
    });
  }

  else{

    if(routeName === 'register'){
      $('.section.full-height').css({
        'height': (height*.85) + 'px',
      });
    }

    $('#viewMore').fadeOut();

    //Allign text with images for each section
    $('.section').each(function(k, el){

      let image = $(el).find('.image-reference');
      let desc = $(el).find('.align-with-image');

      if(typeof image !== 'undefined' && image.length > 0){
        
        desc.css({
          'position': 'relative',
          'top': '0px',
        });

      }
     
      desc.animate({
        'opacity': 1
      }, 500);
    });
  }

  if($(document).scrollTop() >= 10){
    if(routeName === 'home' || routeName === 'register'){
      console.log('remove menu')
      $('.gn-menu-main').removeClass('expanded');
    }

    if(width > 991){
      $('#viewMore').fadeOut();
    }
  }
  else{
    if(routeName === 'home' || routeName === 'register'){
      console.log('add menu')
      $('.gn-menu-main').addClass('expanded');
    }

    if(width > 991){
      $('#viewMore').fadeIn();
    }
  }

  $(window).off('scroll');

  $(window).on('scroll', function(){
    if($(document).scrollTop() >= 10){
      if(routeName === 'home' || routeName === 'register'){
        console.log('remove menu')
        $('.gn-menu-main').removeClass('expanded');
      }

      if(width > 991){
        $('#viewMore').fadeOut();
      }
    }
    else{
      if(routeName === 'home' || routeName === 'register'){
        console.log('add menu')
        $('.gn-menu-main').addClass('expanded');
      }

      if(width > 991){
        $('#viewMore').fadeIn();
      }
    }
  });
}