Template.domainRulesModal.events({
	//When clicking on a dropdown, perform changes
	//See if the selected change is diferent from current option, otherwise do nothing
	'click .match': function(e){
		e.preventDefault();

		var el = $(e.currentTarget);
		var ruleEl = el.closest('.ruleRow');

		var actionType = el.attr('data-option');

		console.log(actionType);

		//Replaces the dropdown control with the selected option
		//We use the dropdown to then attach attributes in case changes were made to it
		var dropdown = el.closest('.dropdown');

		dropdown.find('button').html('<span class="submenu-title">'+ el.find('a').text() +' </span> <i class="fa fa-angle-down dropdown-carret"></i>');


		//Switch to set the correct data attributes for later saving
		switch(actionType){
			//Change the match rule
			case 'match':
				if(ruleEl.attr('data-rule') === el.attr('data-type')){
					console.log('same rule, do nothing');
					if(dropdown.attr('data-changed') === 'true'){
						dropdown.removeAttr('data-changed');
						dropdown.removeAttr('data-description');
					}
				}
				else{
					console.log('diferent rule, change')	
					dropdown.attr('data-changed', true);
					dropdown.attr('data-description', el.attr('data-type'));
				}

				ruleEl.find('.matchType').html(el.attr('data-description'));

				break;

			case 'project':
				if(ruleEl.attr('data-project') === el.attr('data-project')){
					console.log('same project, do nothing');
					if(dropdown.attr('data-changed') === 'true'){
						dropdown.removeAttr('data-changed');
						dropdown.removeAttr('data-description');
					}
				}
				else{
					console.log('diferent project, change');
					dropdown.attr('data-changed', true);
					dropdown.attr('data-description', el.attr('data-project'));
				}

				//Check if we must enable/disable the valid input button if project is set to 'auto'
				if(el.attr('data-project') === 'auto'){
					ruleEl.find('.validateDropdown').attr('disabled', true);

					ruleEl.find('.validateDropdown').html('<span class="submenu-title">Unset </span><i class="fa fa-angle-down dropdown-carret"></i>');

					ruleEl.find('.validationType').html('<span class="validationType">it will <em>never be set as valid</em>.</span>');

					if(ruleEl.attr('data-validate') === true){
						toastr.warning('<p>You cannot automatically validate a log if you set the project to be automatically classified.<br>Future logs that match this rule will not be automatically set as valid.</p>')
					}

				}
				else{
					ruleEl.find('.validateDropdown').removeAttr('disabled');
					ruleEl.find('.validationType').html(el.attr('data-description'));
				}

				ruleEl.find('.projectType').html(el.attr('data-description'));

				break;

			case 'category':
				if(ruleEl.attr('data-category') === el.attr('data-category')){
					console.log('same category, do nothing');
					if(dropdown.attr('data-changed') === 'true'){
						dropdown.removeAttr('data-changed');
						dropdown.removeAttr('data-description');
					}
				}
				else{
					console.log('diferent category, change')
					dropdown.attr('data-changed', true);
					dropdown.attr('data-description', el.attr('data-category'));
				}

				ruleEl.find('.categoryType').html(el.attr('data-description'));

				break;

			case 'privacy':
				if(ruleEl.attr('data-private') === el.attr('data-private')){
					console.log('same privacy, do nothing');
					if(dropdown.attr('data-changed') === 'true'){
						dropdown.removeAttr('data-changed');
						dropdown.removeAttr('data-description');
					}
				}
				else{
					console.log('diferent privacy, change')	
					dropdown.attr('data-changed', true);
					dropdown.attr('data-description', el.attr('data-private'));
				}

				ruleEl.find('.privacyType').html(el.attr('data-description'));

				break;

			case 'validation':
				if(ruleEl.attr('data-validate') === el.attr('data-validation')){
					console.log('same validation, do nothing');
					if(dropdown.attr('data-changed') === 'true'){
						dropdown.removeAttr('data-changed');
						dropdown.removeAttr('data-description');
					}
				}
				else{
					console.log('diferent validation, change')	
					dropdown.attr('data-changed', true);
					dropdown.attr('data-description', el.attr('data-validation'));
				}

				ruleEl.find('.validationType').html(el.attr('data-description'));

				break;

			default:
				toastr.error('Unknown action for setting rule');
				return;
				break;
		}
	},

	'click .addCustomRule': function(e){
		e.preventDefault();
		var el = $(e.currentTarget);
		console.log('create custom rule rule');

		var t = Template.instance();

		//Get default rule
		var defaultRuleId = t.$('.ruleRow').attr('id');

		var modal = t.$('#domainRulesModal');


		var domain = modal.attr('data-domain');
		var pageTitle = modal.attr('data-pagetitle');
		var uri = modal.attr('data-uri');
	
		Meteor.call('domains.createCustomRule', defaultRuleId, domain, pageTitle, uri, function(err, rules){
			if(!err){
				toastr.success('Saved custom rule!');

				console.log(rules)
				
				var rulesArea = modal.find('#domainRules');
				
				_buildRulesList(rules, rulesArea);
			}
			else{
				toastr.error('There was an error creating your rule.');
				el.show();
			}
		});
	},
	'click .removeRule': function(e){
		e.preventDefault();
		console.log('remove rule');

		var row = $(e.currentTarget).closest('.ruleRow');

		if(typeof row.id === 'undefined'){
			row.remove();
		}
		else{
			if(row.attr('data-isdefault') === 'true'){
				toastr.error('Can\'t remove the default rule. There must be at least one.')
			}
		}
	},

	/****
		SAVE RULE
	****/
	'click #saveRule': function(e){
		e.preventDefault();

		var t = Template.instance();
		var ruleEls = t.$('.ruleRow');

		//Store whether or not we want to apply changes (save) and which fields to update for method
		var changeData = {
			'apply': false
		}

		//Iterate all rule elements to see if there are changes to apply
		_.each(ruleEls, function(ruleEl, k){

			var rule = $(ruleEl);
			
			//See if any option was changed
			var changedOptions = $(ruleEl).find('.dropdown[data-changed="true"]');



			if(changedOptions.length > 0){
				//Iterate all changes and match vs el current attributes
				_.each(changedOptions, function(dropdown, k){

					switch($(dropdown).attr('data-type')){
						case 'matchType':
							if($(dropdown).attr('data-description') !== rule.data('rule')){
								console.log('change match rule');
								changeData['apply'] = true;
								changeData['matchRules'] = $(dropdown).attr('data-description');
							}
							break;

						case 'category' :
							if($(dropdown).attr('data-description') !== rule.data('category')){
								console.log('change category');
								changeData['apply'] = true;
								changeData['categoryId'] = $(dropdown).attr('data-description');
							}
							break;

						case 'project':
							if($(dropdown).attr('data-description') !== rule.data('project')){
								console.log('change project');
								changeData['apply'] = true;
								changeData['project'] = $(dropdown).attr('data-description');
							}
							break;

						case 'privacy':
							if($(dropdown).attr('data-description') !== rule.attr('data-private')){
								console.log('change privacy');
								changeData['apply'] = true;
								changeData['privacy'] = $(dropdown).attr('data-description');
							}
							break;

						case 'validation':
							if($(dropdown).attr('data-description') !== rule.attr('data-validate')){
								console.log('change validation');
								changeData['apply'] = true;
								changeData['validated'] = $(dropdown).attr('data-description');
							}
							break;
					}

					//console.log($(el).attr('data-type'), $(el).attr('data-description'))
					//console.log('--------------')

				});

				//Build update object and call method do update rule
				if(changeData['apply']){
					changeData['ruleId'] = rule.attr('id');
					Meteor.call('domains.saveDomainRule', changeData, function(err, res){
						console.log('saved rule ' + rule.attr('id'))
						if(err){
							toastr.error('Error saving rule!');
						}
					});
				}
			}
		})

		$('#domainRulesModal').removeAttr('domain')
		$('#domainRulesModal').removeAttr('uri')
		$('#domainRulesModal').removeAttr('pageTitle')

		$('#domainRulesModal').modal('hide');
	}
});