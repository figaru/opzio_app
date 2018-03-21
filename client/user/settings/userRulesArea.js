Template.userRulesArea.onRendered(function(){

	var t = Template.instance();
	var areaEl = $('#rulesArea');

	areaEl.html('<div class="loader-overlay boxed stats"><p class="align-right" style="display:inline-block;"><br><br>Loading rules..</p><div class="chart-loader" style="position:relative;margin:0 0 0 20px;top:0;"></div></div>')

	Meteor.call('domains.getDefaultDomainRules',function(err, data){
		if(!err){
			if(data.length > 0){

				var thead = '<thead>\
							<tr>\
								<th>Domain/App</th>\
								<th>Matching Rule</th>\
								<th>Project to assign</th>\
								<th>Category to assign</th>\
								<th class="align-center">Privacy</th>\
								<th class="align-center">Validation</th>\
								<th class="align-center">Actions</th>\
							</tr>\
							</thead>';
				
				var rowEls = '';
				
				areaEl.html('');

				_.each(data, function(rule, k){

					var attributes = '';
					attributes += ' data-domain="'+ rule.domain +'"';

					if(rule.matchRules.exactMatch){
						var ruleType = 'Exact Log (URL/Title)';
					}
					else if(rule.matchRules.fullUri){
						var ruleType = 'Exact URL/Path';
					}
					else if(rule.matchRules.titleOnly){
						var ruleType = 'Exact Page Title';
					}
					else{
						var ruleType = 'Domain/Application';
					}

					//Project Rule dropdown
					if(rule.project !== null){
						var project = '<input type="text" name="projectInput" class="demo-default selectized projectInput" value="'+ rule.project.name +'" data-selected="'+ rule.project._id +'">';
						attributes += ' data-projectid="'+rule.project._id+'"';
						attributes += ' data-projectname="'+rule.project.name+'"';
					}
					else{
						var project = '<input type="text" name="projectInput" class="demo-default selectized projectInput" value="Auto" data-selected="null">'
						attributes += ' data-projectid="null"';
						attributes += ' data-projectname="Auto"';
					}

					//Category Rule dropdown
					var category = '<input type="text" name="categoryInput" class="demo-default selectized categoryInput" value="'+ rule.category.label +'" data-selected="'+ rule.category._id +'">';
					attributes += ' data-categoryid="'+rule.category._id+'"';
					attributes += ' data-categoryname="'+rule.category.label+'"';

					//Privacy rule
					if(rule.private){
						var privacy = '<a href="#" class="changePrivacy privacyTooltip" title="<p><u>Only you</u> can see activity from '+ rule.domain +'</p>" data-private="true"><i class="fa fa-eye-slash"></i></a>';
						attributes += ' data-setprivate="true"';
					}
					else{
						var privacy = '<a href="#" class="changePrivacy privacyTooltip" title="<p><u>Anyone</u> can see activity from '+ rule.domain +'</p>" data-private="false"><i class="fa fa-eye"></i></a>';
						attributes += ' data-setprivate="false"';
					}

					//Validation rule
					if(rule.validated){
						var valdiation = '<input checked="checked" class="validatedCheckbox" type="checkbox" id="privateRule_'+ rule._id +'" data-validated="true" /><label data-action="private" for="privateRule_'+ rule._id +'"></label>';
						attributes += ' data-setvalid="true"';
					}
					else{
						var valdiation = '<input class="validatedCheckbox" type="checkbox" id="privateRule_'+ rule._id +'" data-validated="false" /><label data-action="private" for="privateRule_'+ rule._id +'"></label>';
						attributes += ' data-setvalid="false"';
					}

					attributes += ' data-category="'+ rule.category._id +'"';


					var row = '<tr id="'+ rule._id +'" class="ruleRow" '+ attributes +'>'
								+'<th class="ruleDomain">'+ rule.domain +'</th>'
								+'<td>'+ ruleType +'</td>'
								+'<td class="dropdown-td">'+ project +' <i class="fa fa-caret-down"></i></td>'
								+'<td class="dropdown-td">'+ category +' <i class="fa fa-caret-down"></i></td>'
								+'<td class="align-center">'+ privacy +'</td>'
								+'<td class="align-center">'+ valdiation +'</td>'
								+'<td class="align-center">'
									+'<div class="dropdown ruleRowAction">'
										+'<a class="btn btn-default dropdown-toggle" type="button" id="ruleAction_'+ rule._id +'" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><i class="fa fa-cog"></i> <i class="fa fa-caret-down"></i></a>'
									  	+'<ul class="dropdown-menu dropdown-menu-right" aria-labelledby="ruleAction_'+ rule._id +'">'
									 		+'<li class="menu-option">'
									 			+'<a href="#" data-action="deleteRule" class="ruleAction"><i class="fa fa-trash"></i> Delete</a>'
									 		+'</li>'
									  	+'</ul>'
									+'</div>'
								+'</td>'
							+'</tr>';

					rowEls += row;
				});

				var tableEl = '<table class="table rwd-table table-striped">'
								+ thead
								+'<tbody id="pluginsListingTable">'
									+ rowEls
								+'</tbody>'
							+'</table>';

				areaEl.html(tableEl);

				Meteor.setTimeout(function(){
					t.$('.privacyTooltip').tooltipster({
						delay: 500,
						contentAsHTML: true,
						//trigger: 'click',
						interactive: true,
					});
				},500);

				//$(document).find('.projectInput').after('');
			}
			else{
				areaEl.html('<div class="align-center"><br><h4>No default rules created yet</h4><h5>Default rules are only created for web browsing or applications<br>like Word (excludes code editor applications).</h5><br></div>');
			}
		}
	});

	/*
	
	<div class="align-center">
		<h3>There are no rules setup yet.</h3>
		<h5>After navigating to URLS or using applications, default rules will appear here.</h5>
	</div>
	*/
});

Template.userRulesArea.events({
	//Instantiate/Change project
	'click .projectInput': function(e){
		//*************
		//	Project Selectize Options
		//*************
		//Build options
		var el = $(e.currentTarget);
		var ruleRow = el.closest('.ruleRow');

		//Check if we need to initialize selectize or not
		if(!el.hasClass('selectize-input') && !el.hasClass('selectize-control')){
			el.parent().find('.fa-caret-down').remove();
			var dropdown = el;
			
			var allProjects = Projects.find({
				type:{
					$ne: 'personal'
				}
			},{sort:{name:1}, reactive: false}).fetch();
			
			var projectOptions = [];
			
			for(var i=0; i < allProjects.length; i++){
				projectOptions.push({
					'value': allProjects[i]._id,
					'text': capitalizeFirstLetter(allProjects[i].name)
				});
			}
			//sort string ascending
			var originalOptions = projectOptions.sort(function(a, b){
				var textA = a.text.toLowerCase(), 
					textB = b.text.toLowerCase();
				
				if (textA < textB) return -1;
				if (textA > textB) return 1;	
				return 0; //default return value (no sorting)
			});

			if(el.val() !== 'Auto'){
				originalOptions.unshift({
					'value': 'auto',
					'text': 'Auto'
				});
			}

			if(el.val() !== 'Personal'){

				var personalProject = Projects.findOne({
					owner:{
						$in: [Meteor.userId()]
					},
					type:'personal'
				},{eactive: false});

				originalOptions.unshift({
					'value': personalProject._id,
					'text': 'Personal'
				});
			}



			var projectSelectEl = $(dropdown).selectize({
				maxItems: 1,
				create: false,
				placeholder: 'Select project',
				render: {
					option: function (data, escape) {
						return '<div class="option panelAction" data-action="setProject" data-value="' + data.value + '" data-id="'+ data.value +'">' + data.text + '</div>';
					}
				}
			});

			var selectEl = projectSelectEl[0].selectize;
			selectEl.addOption(originalOptions);

			////console.log(selectEl)

			//Open dropdown
			selectEl.open()


			//Bind events
			selectEl.on('change', function(selectedProjectId){
				if(typeof selectedProjectId !== 'undefined' && selectedProjectId !== ''){
					updateDomainRule('project', selectedProjectId, ruleRow);
				}
			});
		}
	},
	'blur .projectInput': function(e, t){
		var el = $(e.currentTarget);
		var item = el.find('.item');

		//console.log(el)
		//console.log('-------------')
		//console.log(item)
		
		if(item.length === 0){
			let tr = el.closest('.ruleRow');
			var input = tr.find('.selectized.projectInput');
			var originalProjectName = tr.attr('data-projectname');
			//console.log('originalProjectName: ' + originalProjectName)
			input.data('selectize').setValue(originalProjectName, true);
		}
	},

	//Instantiate/Change project
	'click .categoryInput': function(e){
		//*************
		//	Category Selectize Options
		//*************
		//Build options
		var el = $(e.currentTarget);
		var ruleRow = el.closest('.ruleRow');

		//Check if we need to initialize selectize or not
		if(!el.hasClass('selectize-input') && !el.hasClass('selectize-control')){
			el.parent().find('.fa-caret-down').remove();
			var dropdown = el;
			
			var categoryOptions = [];
			var allCategories = DomainCategories.find().fetch();

			for(var i=0; i < allCategories.length; i++){
				categoryOptions.push({
					'value': allCategories[i]._id,
					'text': allCategories[i].label
				});
			}

			var categoriesSelectEl = $(dropdown).selectize({
				maxItems: 1,
				create: false,
				placeholder: 'Select category',
				render: {
					option: function (data, escape) {
						return '<div class="option panelAction" data-action="setCategory" data-value="' + data.value + '" data-id="'+ data.value +'">' + data.text + '</div>';
					}
				}
			});

			var selectEl = categoriesSelectEl[0].selectize;

			selectEl.addOption(categoryOptions);

			//Bind events
			selectEl.on('change', function(selectedCategoryId){
				if(typeof selectedCategoryId !== 'undefined' && selectedCategoryId !== ''){
					updateDomainRule('category', selectedCategoryId, ruleRow);
				}
			});

		}
	},
	'blur .categoryInput': function(e, t){
		var el = $(e.currentTarget);
		var item = el.find('.item');

		//console.log(el)
		//console.log('-------------')
		//console.log(item)
		
		if(item.length === 0){
			let tr = el.closest('.ruleRow');
			var input = tr.find('.selectized.categoryInput');
			var originalCategoryName = tr.attr('data-categoryname');
			//console.log('originalProjectName: ' + originalProjectName)
			input.data('selectize').setValue(originalCategoryName, true);
		}
	},

	//Change privacy
	'click .changePrivacy': function(e){
		e.preventDefault();

		var el = $(e.currentTarget);
		var ruleRow = el.closest('.ruleRow');

		//Switch to public
		if(el.attr('data-private') === 'true'){
			updateDomainRule('privacy', {privacy: false, el: el}, ruleRow);
		}
		//Switch to private
		else{
			updateDomainRule('privacy', {privacy: true, el: el}, ruleRow);
		}
	},

	//Change validation
	'click .validatedCheckbox': function(e){
		var el = $(e.currentTarget);
		var ruleRow = el.closest('.ruleRow');
		//console.log('change validation setting');

		//Switch validation to valid
		if(el.attr('data-validated') === 'true'){
			updateDomainRule('validation', {validated: false, el: el}, ruleRow);
		}
		//Switch validation to unset
		else{
			updateDomainRule('validation', {validated: true, el: el}, ruleRow);
		}
	},

	//Delete rule
	'click .ruleAction': function(e){
		e.preventDefault();
		var ruleRow = $(e.currentTarget).closest('.ruleRow');

		//console.log('click ruleAction')

		//Set some toast options (wait for user action and act accordingly)
		toastr.options.timeOut = 0;
		toastr.options.extendedTimeOut = 0;
		toastr.options.tapToDismiss = false;
		toastr.options.preventDuplicates = true;

		var body = '<p>Deleting this rule will force Opz.io to create a new default rule next time you navigate/use <b>'+ ruleRow.attr('data-domain') +'</b><br><br>(Note: Opz.io always a default rule for all domains/apps never visited or with no default rule).</p>'
			+'<br><p><b>Confirm delete?</b></p>'
			+'<div style="text-align:right;">'
				+'<button type="button" id="confirmDelete" class="btn btn-terciary">Delete</button>'
				+'<button type="button" class="btn clear pull-left">Cancel</button>'
			+'</div>';

		var toast = toastr.warning(body, 'Confirm deletion of this rule?');
	
		if(typeof toast !== 'undefined'){

			toast.delegate('#confirmDelete', 'click', function () {
				//console.log('remove')
			});

			toast.delegate('.clear', 'click', function () {
				toast.remove();
			});
		}

		resetToastrOptions();

	},

	//Search domains
	'input #domainSearchInput': function(e){
		e.preventDefault();
		var $searchEl = $(e.currentTarget);
		var ogValue = $searchEl.val();
		var compValue = ogValue.toUpperCase();
		
		if(ogValue.length > 0 && ogValue !== ' ' && ogValue !== '  '){
			var $trow = $('.ruleRow');
			
			_.each($trow, function(row, k){
				let $r = $(row);
				let domain = $r.attr('data-domain').toUpperCase();

				if(domain.includes(compValue)){
					//Highlight text match
					//console.log('MATCH!')
					$r.removeClass('hidden');
					var re = new RegExp(compValue, "gi");
					var title = $r.find('.ruleDomain').text();
					var highlighted = title.replace(re, "<span class='highlighted'>"+ogValue+"</span>");
					$r.find('.ruleDomain').html(highlighted);
				}
				else{
					//Remove highlight and show
					var ogName = truncString($r.attr('data-domain'), 20, false);
					$r.find('.ruleDomain').text(ogName);
					$r.addClass('hidden');
				}
			});
			reloadMasonry();
			//console.log('-----------')
		}
		else{
			var $trow = $('.ruleRow');
			_.each($trow, function(r, k){
				var ogName = truncString($(r).attr('data-domain'), 20, false);
				$(r).find('.ruleDomain').text(ogName);
				$(r).removeClass('hidden');
			});
			reloadMasonry();
		}
	}
});