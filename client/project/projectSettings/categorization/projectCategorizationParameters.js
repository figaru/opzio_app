Template.projectCategorizationParameters.onRendered(function(){

	const t = Template.instance();

	let data = t.data;
	let project = data.project;

	//Matching Keywords input
	var matchingKeywords = project.matchingWords;
	var excludingKeywords = project.excludingWords;


	//########
	//	INITIALIZE
	//########
	//	Match input
	var $matchingSelect = $('#matchingKeywords').selectize({
	    delimiter: ',',
	    plugins: ['remove_button'],
	    /*'restore_on_backspace',*/
	    persist: false,
	    create: true,
	    createOnBlur: true
		
	});
	//	Exclude input
	var $excludingSelect = $('#excludingKeywords').selectize({
	    delimiter: ',',
	    plugins: ['remove_button'],
	    persist: false,
	    create: true,
	    createOnBlur: true
		
	});

	var $matchSelectEl = $matchingSelect[0].selectize;
	var $excludingSelectEl = $excludingSelect[0].selectize;

	//########
	//	POPULATE
	//########
	if(typeof matchingKeywords !== 'undefined' && matchingKeywords.length > 0){
		for (var i = 0; i < matchingKeywords.length; i++){
			$matchSelectEl.addOption({ value:matchingKeywords[i], text:matchingKeywords[i] });
			$matchSelectEl.addItem(matchingKeywords[i]);
		}
	}
	if(typeof excludingKeywords !== 'undefined' && excludingKeywords.length > 0){
		for (var i = 0; i < excludingKeywords.length; i++){
			$excludingSelectEl.addOption({ value:excludingKeywords[i], text:excludingKeywords[i] });
			$excludingSelectEl.addItem(excludingKeywords[i]);
		}
	}

	//########
	//	EVENTS
	//########
	// ADD events
	$matchSelectEl.on('option_add', function(keyword){
		//Check if keyword exists in excludingSelectEl
		if($excludingSelectEl.items.indexOf(keyword) >= 0){
			//toastr.warning('Cannot have word '+ keyword + ' present both in match and exclude keywords.')
			//Set some toast options (wait for user action and act accordingly)
			toastr.options.timeOut = 0;
			toastr.options.extendedTimeOut = 0;
			toastr.options.tapToDismiss = false;

			var body = '<div>'
							+'<p>The word <em>' + keyword + '</em> is present in the excluding keywords.'
							+'<br>Do you wish to remove it?</p>'
							+'<button type="button" class="btn clear">Cancel</button>'
							+'<button type="button" id="popExcludeKeyword" class="btn btn-primary pull-right">Yes</button>'
						+'</div>';

			var toast = toastr.warning(body, 'Remove from excluding?');
			
			resetToastrOptions();

			toast.delegate('#popExcludeKeyword', 'click', function () {
			    toast.remove();
			   	
			   	$excludingSelectEl.removeOption(keyword);

			   	Meteor.call('updateProjectExcludeKeywords', project._id, keyword, 'pop', function(err, data){
			   		if(err){ toastr.error('Error removing exclude keyword.'); }
			   	});

				Meteor.call('updateProjectMatchKeywords', project._id, keyword, 'push', function(err, data){
					if(err){ toastr.error('Error pushing match keyword.'); }
				});

			});

			toast.delegate('.clear', 'click', function () {
			   	$matchSelectEl.removeItem(keyword);
			    toast.remove();
			});
		}
		else{
			Meteor.call('updateProjectMatchKeywords', project._id, keyword, 'push', function(err, data){
				if(err){ toastr.error('Error saving keyword.'); }
			});	
		}
	});

	$excludingSelectEl.on('option_add', function(keyword){
		//Check if keyword exists in matchSelectEl
		if($matchSelectEl.items.indexOf(keyword) >= 0){
			toastr.options.timeOut = 0;
			toastr.options.extendedTimeOut = 0;
			toastr.options.tapToDismiss = false;

			var body = '<div>'
							+'<p>The word <em>' + keyword + '</em> is present in the matching keywords.'
							+'<br>Do you wish to remove it?</p>'
							+'<button type="button" class="btn clear">Cancel</button>'
							+'<button type="button" id="popMatchKeyword" class="btn btn-primary pull-right">Yes</button>'
						+'</div>';

			var toast = toastr.warning(body, 'Remove from matching?');
			
			resetToastrOptions();

			toast.delegate('#popMatchKeyword', 'click', function () {
			    toast.remove();
			   	
			   	$matchSelectEl.removeOption(keyword);

			   	Meteor.call('updateProjectMatchKeywords', project._id, keyword, 'pop', function(err, data){
			   		if(err){ toastr.error('Error removing match keyword.'); }
			   	});

				Meteor.call('updateProjectExcludeKeywords', project._id, keyword, 'push', function(err, data){
					if(err){ toastr.error('Error pushing exclude keyword.'); }
				});

			});

			toast.delegate('.clear', 'click', function () {
			   	$excludingSelectEl.removeItem(keyword);
			    toast.remove();
			});
		}
		else{
			Meteor.call('updateProjectExcludeKeywords', project._id, keyword, 'push', function(err, data){
				if(err){ toastr.error('Error saving keyword.'); }
			});	
		}
	});



	//	REMOVE events
	$matchSelectEl.on('item_remove', function(value, item){
		console.log('match remove ' + value)
		Meteor.call('updateProjectMatchKeywords', project._id, value, 'pop', function(err, data){
			console.log(err)
			if(err){ toastr.error('Error removing match keyword.'); }
		});
	});
	$excludingSelectEl.on('item_remove', function(value, item){
		console.log('exclude remove ' + value)
		Meteor.call('updateProjectExcludeKeywords', project._id, value, 'pop', function(err, data){
			if(err){ toastr.error('Error removing exclude keyword.'); }
		});
	});

});

Template.projectCategorizationParameters.events({
	'click #useForCategorization': function(e){

		Meteor.call('updateCategorizationOption',Template.instance().data.project._id, $(e.currentTarget).prop('checked'), function(err, data){

		})
	}
})