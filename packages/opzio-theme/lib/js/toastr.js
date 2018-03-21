
//Set toasts options //http://codeseven.github.io/toastr/demo.html

callToast = function(type, body, title, timeOut, callback=function(){}){

  if(timeOut && typeof timeOut === 'number'){
    toastr.options.timeOut = timeOut;
  }

  switch(type){
    case 'info':
    case 'default':
      toastr.info(body, title, callback() );
      break;
    case 'success':
      toastr.success(body, title, callback() );
      break;
    case 'warning':
      toastr.warning(body, title, callback() );
      break;
    case 'error':
      toastr.error(body, title, callback() );
      break;
  }

  //Reset to default timeout
  toastr.options.timeOut = 5000;
}

resetToaster = function(){
  toastr.options.timeOut = 5000;
  //toastr.options.closeButton = true;
  //toastr.options.newestOnTop = false;
  if($(window).width() < 620){
      toastr.options.positionClass = "toast-bottom-full-width";
  }
  else{
      toastr.options.positionClass = "toast-bottom-right";
  }
}