_buildRulesList = function(rules, el){
	//console.log('in _buildRulesList');
	//console.log(rules);

	//Clear prev rules if any
	el.html('');

	var rulesList = '';
	var addSpecific = true;

	_.each(rules, function(rule, k){
		//Holds the textual description of what this rule does
		var ruleDescription = '';
		//****
		//	Selects the match type depending if its default or not
		//****
		if(rule.default){
			var matchDropdown = '<div class="dropdown modal-control rule-dropdown" data-type="matchType">'
									+'<button class="btn btn-default form-control dropdown-toggle matchMenu" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'
								  	+ '<span class="submenu-title">this exact Domain/Application </span>'
								  +'</button>' 
								+'</div>';
			ruleDescription += '<span class="matchType">Every time this <em>Domain/Application is found</em>, </span> ';
		}
		else{
			//If we already have a specific rule for this log, user cannot add another one (for now)
			addSpecific = false;

			if(rule.matchRules.fullUri){
				var matchType = '<span class="submenu-title">this exact URL </span>';
				ruleDescription += '<span class="matchType">Every time you go to this <em>exact URL</em>, </span>';
			}
			else if(rule.matchRules.titleOnly){
				var matchType = '<span class="submenu-title">this exact Page Title </span>';
				ruleDescription += '<span class="matchType">Every time Opz.io finds this <em>Page Title</em>, </span>';
			}
			else if(rule.matchRules.exactMatch){
				var matchType = '<span class="submenu-title">this exact Source </span>';
				ruleDescription += '<span class="matchType">Every time you interact with this <em>exact URL & Page Title</em>, </span>';
			}

			//Match type options dropdown
			var matchDropdown = '<div class="dropdown modal-control rule-dropdown" data-type="matchType">'
									+'<button class="btn btn-default form-control dropdown-toggle matchMenu" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'
								  	+ matchType
								    +'<i class="fa fa-angle-down dropdown-carret"></i>'
								  +'</button>' 
								  +'<ul class="dropdown-menu pull-left">'
								  	/*
								  	+'<li class="menu-option match" data-option="match" data-type="domainOnly" data-description="Every time you go to this <em>Domain</em>, ">'
								      +'<a href="#domain">this exact Domain</a>'
								    +'</li>'
								    */
								    +'<li class="menu-option match" data-option="match" data-type="fullUri" data-description="Every time you go to this <em>exact URL</em>, ">'
								      +'<a href="#url">this exact URL</a>'
								    +'</li>'
								    +'<li class="menu-option match" data-option="match" data-type="titleOnly" data-description="Every time Opz.io finds this <em>Page Title</em>, ">'
								      +'<a href="#title">this exact Page Title</a>'
								    +'</li>'
								    +'<li class="menu-option match" data-option="match" data-type="exactMatch" data-description="Every time you interact with this <em>exact URL & Page Title</em>, ">'
								      +'<a href="#exactMatch">this exact Source</a>'
								    +'</li>'
								  +'</ul>'
								+'</div>';
		}



		//Build categories dropdown
		var categoriesList = '';
		var categories = DomainCategories.find({}, {sort: { label: 1 } }).fetch();

		for(var i=0; i<categories.length; i++){
			categoriesList += '<li class="menu-option match" data-option="category" data-category="'+categories[i]._id+'" data-description="Category will be set as <em>' + categories[i].label + '</em> and "><a href="#category">'+ categories[i].label +'</a></li>';
		}

		var categoriesDropdown = '<div class="dropdown modal-control rule-dropdown" data-type="category">'
								+'<button class="btn btn-default form-control dropdown-toggle categoryMenu" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'
							  	+'<span class="submenu-title">'+ rule.category.label +' </span>'
							    +'<i class="fa fa-angle-down dropdown-carret"></i>'
							  +'</button>' 
							  +'<ul class="dropdown-menu pull-left">'
							  	+ categoriesList
							  +'</ul>'
							+'</div>';

		ruleDescription += '<span class="categoryType">category will be set as <em>' + rule.category.label + '</em> and </span>';

		//Build projects dropdown
		var projectsList = '';
		var personalProject =  Projects.findOne({
			type: 'personal'
		},{
			sort: { name: 1 }
		});

		var projects = Projects.find({ type:{ $ne: 'personal' }
		},{
			sort: { name: 1 }
		}).fetch();

		for(var i=0; i<projects.length; i++){
			projectsList += '<li class="menu-option match" data-option="project" data-project="'+projects[i]._id+'" data-name="'+projects[i].name+'" data-description="the project as <em>' + projects[i].name + '</em>. "><a href="#project">'+ projects[i].name +'</a></li>';
		}

		if(rule.project !== null){
			var projectName = getProjectFromID(rule.project._id);
			var canSetValid = true;
			var projectLabel = '<span class="submenu-title">'+ projectName +' </span>';
			ruleDescription += '<span class="projectType">the project as <em>' + projectName + '</em>. </span>';
		}
		else{
			var canSetValid = false;
			var projectLabel = '<span class="submenu-title">Auto </span>';
			ruleDescription += '<span class="projectType">Opz.io will <em>set the project automatically</em>. </span>';
		}

		var projectsDropdown = '<div class="dropdown modal-control rule-dropdown" data-type="project">'
								+'<button class="btn btn-default form-control dropdown-toggle matchMenu" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'
							  	+ projectLabel
							    +'<i class="fa fa-angle-down dropdown-carret"></i>'
							  +'</button>' 
							  +'<ul class="dropdown-menu pull-left">'
							  	+'<li class="menu-option match" data-option="project" data-project="auto" data-name="Auto" data-description="Opz.io will <em>set the project automatically</em>. "><a href="#project" data-type="project">Auto</a></li>'
							  	+'<li class="menu-option match" data-option="project" data-project="'+personalProject._id+'" data-name="personal" data-description="Opz.io will <em>set it as personal time</em>. "><a href="#project" data-type="project">Personal</a></li>'
						  		+'<li role="separator" class="divider"></li>'
							  	+ projectsList
							  +'</ul>'
							+'</div>';

		//Build privacy dropdown
		if(rule.private){
			var privacyLabel = '<span class="submenu-title">Private </span>';
			ruleDescription += '<span class="privacyType"><br><em>Only you will be able to see it</em> and </span>';
		}
		else{
			var privacyLabel = '<span class="submenu-title">Public </span>';
			ruleDescription += '<span class="privacyType"><br><em>Other members of your team will be able to see it</em> and </span>';
		}
		var privacyDropdown = '<div class="dropdown modal-control rule-dropdown" data-type="privacy">'
								+'<button class="btn btn-default form-control dropdown-toggle matchMenu" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'
							  	+ privacyLabel
							    +'<i class="fa fa-angle-down dropdown-carret"></i>'
							  +'</button>' 
							  +'<ul class="dropdown-menu pull-left">'
							  	+'<li class="menu-option match" data-option="privacy" data-private="true" data-description="<br><em>Only you will be able to see it</em> and "><a href="#private">Private</a></li>'
							  	+'<li class="menu-option match" data-option="privacy" data-private="false" data-description="<br><em>Other members of your team will be able to see it</em> and "><a href="#public">Public</a></li>'
							  +'</ul>'
							+'</div>';

		//Build validation dropdown
		if(rule.validated){
			var validateLabel = '<span class="submenu-title">Valid </span>';
			ruleDescription += '<span class="validationType">it will <em>always be set as valid</em>.</span>';
		}
		else{
			var validateLabel = '<span class="submenu-title">Unset </span>';
			ruleDescription += '<span class="validationType">it will <em>never be set as valid</em>.</span>';
		}
		//Add disabled attribute to button in case project is set to auto (cannot validated automatically for classified projects)
		if(canSetValid){
			var validateDropdown = '<div class="dropdown modal-control rule-dropdown" data-type="validation">'
									+'<button class="btn btn-default form-control dropdown-toggle matchMenu validateDropdown" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'
								  	+ validateLabel
								    +'<i class="fa fa-angle-down dropdown-carret"></i>'
								  +'</button>' 
								  +'<ul class="dropdown-menu pull-left">'
								  	+'<li class="menu-option match" data-option="validation" data-validation="true" data-description="it will <em>always be set as valid</em>."><a href="#private">Valid</a></li>'
								  	+'<li class="menu-option match" data-option="validation" data-validation="false" data-description="it will <em>never be set as valid</em>."><a href="#public">Unset</a></li>'
								  +'</ul>'
								+'</div>';
		}
		else{
			var validateDropdown = '<div class="dropdown modal-control rule-dropdown" data-type="validation">'
									+'<button disabled class="btn btn-default form-control dropdown-toggle matchMenu validateDropdown" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'
								  	+ validateLabel
								    +'<i class="fa fa-angle-down dropdown-carret"></i>'
								  +'</button>' 
								  +'<ul class="dropdown-menu pull-left">'
								  	+'<li class="menu-option match" data-option="validation" data-validation="true" data-description="it will <em>always be set as valid</em>."><a href="#private">Valid</a></li>'
								  	+'<li class="menu-option match" data-option="validation" data-validation="false" data-description="it will <em>never be set as valid</em>."><a href="#public">Unset</a></li>'
								  +'</ul>'
								+'</div>';

		}

		//Default settings is applicable
		if(rule.default){
			var isDefault = '<span class="badge dark-full defaultTooltip" title="<p>This is a default rule applied to this domain/application.<br>You cannot delete this rule but you can change the rules to apply.<br/><br/><b>Note that if no other rule exists, this will be applied to any matching log.</b>">Default Rule <i class="fa fa-info-circle"></i></span>';
			var deleteBtn = ''
		}
		else{
			var isDefault = '<span class="badge blue-full defaultTooltip" title="<p>This is a custom rule that overrides the default rule for this Domain/Application<br>This rule will only apply depending on the chosen matching criteria.<br/><br/><b>Note that the rules specified can get applied to other logs as well if you choose Page Title match criteria.</b>">Custom Rule <i class="fa fa-info-circle"></i></span>';
			var deleteBtn = '<a href="#" class="btn pull-right"><i class="fa fa-trash"></i></a>';
		}

		//Get current match type
		if(rule.matchRules.exactMatch){
			var currentRule = 'exactMatch';
		}
		if(rule.matchRules.fullUri){
			var currentRule = 'fullUri';
		}
		if(rule.matchRules.titleOnly){
			var currentRule = 'titleOnly';
		}
		if(rule.matchRules.domainOnly){
			var currentRule = 'domainOnly';
		}
		
		if(rule.default){
			//Build ruleEl (the rule row within the modal)
			var ruleEl = '<div class="tab-wrapper ruleRow"' 
							+'id="'+rule._id+'"'
							+'data-rule="'+currentRule+'"' 
							+'data-category="'+rule.category._id+'"' 
							+'data-uri="'+rule.uri+'"' 
							+'data-pageTitle="'+rule.pageTitle+'"' 
							+'data-domain="'+rule.domain+'"' 
							+'data-isdefault="'+rule.default+'"' 
							+'data-project="'+rule.project+'"' 
							+'data-private="'+rule.private+'"' 
							+'data-validate="'+rule.validated+'">'
							+'<span class="rule-wrapper">'
								//+'<a href="#" class="btn btn-primary pull-right duplicateRule"><i class="fa fa-copy"></i></a>'
								//+ deleteBtn
								+ isDefault
								+'<p><b>For:</b></p>'
								+ matchDropdown
							+'</span>'
							+'<span class="rule-wrapper padded">'
								+'<p class="set-description">set <b>Category</b> as</p> <span class="inputSetter">'+ categoriesDropdown +'</span><i class="fa fa-info-circle tooltipster" title="<p>Sets the category you want to associate this info to.<br>You can later change it if you want.</p>"></i>'
								+'<br><p class="set-description">set <b>Project</b> as</p> <span class="inputSetter">'+ projectsDropdown +'</span><i class="fa fa-info-circle tooltipster" title="<p>Sets the project you want to associate this info to.</p><br><ul><li><b>Auto</b> - lets Opz.io classify autonomously</li><li><b>Personal</b> - set as personal activity</li><li><b>Select</b> - pick any other project to classify</li></ul>"></i>'
								+'<br><p class="set-description">set <b>Privacy</b> as</p> <span class="inputSetter">'+ privacyDropdown +'</span><i class="fa fa-info-circle tooltipster" title="<p>When matching this info, Opz.io will assign the privacy you set here.<br>You can later change it if you want.</p>"></i>'
								+'<br><p class="set-description">set <b>Validation</b> as</p> <span class="inputSetter">'+ validateDropdown +'</span><i class="fa fa-info-circle tooltipster" title="<p>Sets the validation state for this info.<br><br>You can only set <em>valid</em> if you specify a project or assign it as Personal time.<br><br>Note that if you set <em>valid</em>, <b>any matched log will be set as valid automatically and cannot be later changed</b>.</p>"></i>'
							+'</span>'
							+'<span class="rule-wrapper">'
								+'<p><b>Rule description:</b></p>'
								+'<div class="rule-description"><p>'+ruleDescription+'</p></div>'
							+'</span>'
						+'</div>';
		}
		else{
			//Build ruleEl (the rule row within the modal)
			var ruleEl = '<div class="tab-wrapper ruleRow"' 
							+'id="'+rule._id+'"'
							+'data-rule="'+currentRule+'"' 
							+'data-category="'+rule.category._id+'"' 
							+'data-uri="'+rule.uri+'"' 
							+'data-pageTitle="'+rule.pageTitle+'"' 
							+'data-domain="'+rule.domain+'"' 
							+'data-isdefault="'+rule.default+'"' 
							+'data-project="'+rule.project+'"' 
							+'data-private="'+rule.private+'"' 
							+'data-validate="'+rule.validated+'">'
							+'<span class="rule-wrapper">'
								//+'<a href="#" class="btn btn-primary pull-right duplicateRule"><i class="fa fa-copy"></i></a>'
								//+ deleteBtn
								+ isDefault
								+'<p><b>For:</b></p>'
								+ matchDropdown + '<i class="fa fa-info-circle tooltipster" title="<p>Choose a match type that will apply the rules below.</p><br><ul><li><b>Exact URL</b> - will apply these rules everytime you reach this full URL</li><li><b>Exact Page Title</b> - will apply these rules everytime this Page Title is found, regardles of URL</li><li><b>Exact Source</b> - will apply these rules everytime both the URL and Page Title are found</li></ul>"></i>'
							+'</span>'
							+'<span class="rule-wrapper padded">'
								+'<p class="set-description">set <b>Category</b> as</p> <span class="inputSetter">'+ categoriesDropdown +'</span><i class="fa fa-info-circle tooltipster" title="<p>Sets the category you want to associate this info to.<br>You can later change it if you want.</p>"></i>'
								+'<br><p class="set-description">set <b>Project</b> as</p> <span class="inputSetter">'+ projectsDropdown +'</span><i class="fa fa-info-circle tooltipster" title="<p>Sets the project you want to associate this info to.</p><br><ul><li><b>Auto</b> - lets Opz.io classify autonomously</li><li><b>Personal</b> - set as personal activity</li><li><b>Select</b> - pick any other project to classify</li></ul>"></i>'
								+'<br><p class="set-description">set <b>Privacy</b> as</p> <span class="inputSetter">'+ privacyDropdown +'</span><i class="fa fa-info-circle tooltipster" title="<p>When matching this info, Opz.io will assign the privacy you set here.<br>You can later change it if you want.</p>"></i>'
								+'<br><p class="set-description">set <b>Validation</b> as</p> <span class="inputSetter">'+ validateDropdown +'</span><i class="fa fa-info-circle tooltipster" title="<p>Sets the validation state for this info.<br><br>You can only set <em>valid</em> if you specify a project or assign it as Personal time.<br><br>Note that if you set <em>valid</em>, <b>any matched log will be set as valid automatically and cannot be later changed</b>.</p>"></i>'
							+'</span>'
							+'<span class="rule-wrapper">'
								+'<p><b>Rule description:</b></p>'
								+'<div class="rule-description"><p>'+ruleDescription+'</p></div>'
							+'</span>'
						+'</div>';	
		}

		

		rulesList += ruleEl;
	});

	

	el.append(rulesList);

	if(addSpecific){
		el.append('<div class="align-center"><button class="btn btn-terciary width-250 addCustomRule hide" type="button">\
		  			<i class="fa fa-plus"></i> Add Rule\
	  				</button></div>');
	}

	Meteor.setTimeout(function(){
		el.find('.tooltipster, .defaultTooltip').tooltipster({
			delay: 500,
			contentAsHTML: true,
			//trigger: 'click',
			interactive: true,
		});
	},500);
}
