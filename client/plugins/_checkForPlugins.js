//Checks for tracking plugin and shows info message accordingly
checkForPlugins = function(){
	var user = Meteor.user();
	if(typeof user !== 'undefined' && user !== null && Meteor.userId() !== null){

		if(!user.profile.hasTracker){ // && !user.mainIntro.show
			toastr.options.timeOut = 0;
			toastr.options.extendedTimeOut = 0;
			toastr.options.tapToDismiss = false;
			toastr.options.preventDuplicates = true;

			var body = ''
				+'<p>It appears you haven\'t installed any plugins yet. Plugins allow to track your activities seamlessly.</p>'
				+'<div>'
					+'<button type="button" id="installPlugins" class="btn btn-primary pull-right">Install Plugins</button>'
					+'<button type="button" class="btn btn-default btn-link clear">Later</button>'
				+'</div>';

			var toast = toastr.warning(body, 'No plugins installed');

			resetToastrOptions();

			//Bind toast events
			if(typeof toast !== 'undefined'){
			    if (toast.find('#installPlugins').length) {
			        toast.delegate('#installPlugins', 'click', function () {
						Router.go('choosePlugins');
						toast.remove();
			        });
			    }

			    if (toast.find('.clear').length) {
			        toast.delegate('.clear', 'click', function () {
			            toast.remove();
			            Meteor.setTimeout(function(){
			            	var body = ''
			            		+'<p>Your activity won\'t be tracked until you install one of the plugins.</p>'
			            		+'<div>'
			            			+'<button type="button" id="installPlugins" class="btn btn-primary pull-right">Install Now</button>'
			            		+'</div>';

			            	toastr.warning(body);

		            	    if (toast.find('#installPlugins').length) {
		            	        toast.delegate('#installPlugins', 'click', function () {
		            				Router.go('choosePlugins');
		            				toast.remove();
		            	        });
		            	    }

			            }, 1500)
			        });
			    }
			}
		}

	}
};