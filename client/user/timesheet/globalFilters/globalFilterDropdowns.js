//*******
//Filter dropdown
//*******

Template.groupLogsFilter.helpers({
	'currentGroupFilter': function(){
		return Session.get('groupOptions');
	}
});

Template.groupLogsFilter.events({
	'click .main-link': function(e){
		e.preventDefault();
		var group = $(e.currentTarget).attr('data-group');
		Session.set('groupOptions', group);
	},

	'click .dismiss-input': function(e, t){
		e.preventDefault();
		var el = $(e.currentTarget);
		console.log('destroy selectize');
		clearDropdownSelectInput(el);
	}
});

//*******
//Selector dropdown
//*******

Template.groupLogsSelector.helpers({
	'getSelectOptions': function(){
		//console.log('in getSelectOptions')
		var userId = Router.current().params.userId;
		if(typeof userId === 'undefined' || userId === ''){ userId = Meteor.userId(); }
		var dateRange = Session.get('dateRange');

		var result = ReactiveMethod.call('users.getHourLogsSelectOptions', dateRange, userId);
		var bulkSelectOptions = [];

		if(typeof result !== 'undefined'){
			if(result.length > 0){
				var options = result[0];

				//Domains list
				if(typeof options.domainList !== 'undefined' && options.domainList.length > 0){
					bulkSelectOptions.push('<li class="dropdown-header">By Source</li>');

					//Sort domains
					var orderedDomains = options.domainList.sort();

					_.each(orderedDomains, function(opt, k){
						bulkSelectOptions.push('<li class="menu-option"><div title="'+ opt +'" data-domain="'+ opt +'" data-action="selectAllDomain" class="main-link bulkSelect">'+ truncString(opt, 20, true) +'</div></li>');
					});
				}

				//By pageTitle
				if(typeof options.pageTitleList !== 'undefined' && options.pageTitleList.length > 0){
					bulkSelectOptions.push('<li class="dropdown-header">By Title</li>');

					//Sort titles
					var orderedTitles = options.pageTitleList.sort();

					_.each(orderedTitles, function(opt, k){
						bulkSelectOptions.push('<li class="menu-option"><div title="'+ opt +'" data-title="'+ opt +'" data-action="selectAllTitle" class="main-link bulkSelect">'+ truncString(opt, 20, true) +'</div></li>');
					});
				}


			}

			bulkSelectOptions = bulkSelectOptions.join('');

			//console.log(result);
		}
		return bulkSelectOptions;
	},

	'displaySelectedLogs': function(){
		var selected = Session.get('selectedLogs');
		if(selected === 0 || typeof selected === 'undefined'){
			return 'Select';
		}
		else{
			return 'Selected <b class="dropdown-badge">' + selected+'</b>';
		}
	}
});