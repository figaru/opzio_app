//Set toasts options //http://codeseven.github.io/toastr/demo.html
resetToastrOptions = function(){
    toastr.options.timeOut = 5000;
    //toastr.options.newestOnTop = false;
    if($(window).width() < 620){
        toastr.options.positionClass = "toast-bottom-full-width";
    }
    else{
        toastr.options.positionClass = "toast-top-right";
    }
};