Template.userLogsPanel.onRendered(function(){
	//*************
	//	Category Selectize Options
	//*************	

	var categoryOptions = [];
	var allCategories = DomainCategories.find().fetch();

	for(var i=0; i < allCategories.length; i++){
		categoryOptions.push({
			'value': allCategories[i]._id,
			'text': allCategories[i].label
		});
	}

	//*************
	//	Project Selectize Options
	//*************
	var projectOptions = [];
	var allProjects = Projects.find({},{sort:{name:1}, reactive: false}).fetch();

	for(var i=0; i < allProjects.length; i++){
		projectOptions.push({
			'value': allProjects[i]._id,
			'text': capitalizeFirstLetter(allProjects[i].name)
		});
	}

	//sort string ascending
	originalOptions = projectOptions.sort(function(a, b){
		var textA = a.text.toLowerCase(), 
			textB = b.text.toLowerCase();
		
		if (textA < textB) return -1;
		if (textA > textB) return 1;	
		return 0; //default return value (no sorting)
	});

	var tr = Template.instance().$('tr');

	//***********
	//Iterate rows instantiate selectize
	//***********
	_.each(tr, function(trEl, k){
		//Only instantiate selectize to TR that have an id attribute (avoid thead trows)
		if(trEl.hasAttribute('id')/* && $(trEl).attr('data-classified') === 'true'*/){
			
			let categoriesSelectize = $(trEl).find('input.categoryInput');
			//Instantiate CATEGORY selectize
			var categoriesSelectEl = $(categoriesSelectize).selectize({
				maxItems: 1,
				create: false,
				render: {
					option: function (data, escape) {
						return '<div class="option" data-value="' + data.value + '" data-id="'+ data.value +'">' + data.text + '</div>';
					}
				}
			});

			categoriesSelectEl[0].selectize.addOption(categoryOptions);

			
			//Instantiate PROJECTS selectize if non valid
			let projectsSelectize = $(trEl).find('.systemProjectMatches');

			let validated = $(trEl).attr('data-validated');
			if(validated === 'false'){
				var projectSelectEl = $(projectsSelectize).selectize({
					maxItems: 1,
					delimiter: ';',
					create: false,
					render: {
						option: function (data, escape) {
							//console.log('instantiate selectize for ' + data.value)
							return '<div class="option" data-value="' + data.value + '" data-id="'+ data.value +'">' + data.text + '</div>';
						}
					}
				});
				projectSelectEl[0].selectize.addOption(projectOptions);
			}
			//Disable selectize if log has been previously validated
			else{
				projectsSelectize.attr('disabled', true)
			}
		}
		else{
			Template.instance().$('.classifyTooltip').tooltipster({
				delay: 500,
				contentAsHTML: true,
				//trigger: 'click',
				//interactive: true,
			});
		}
	});

	//***********
	//Init panel tooltips
	//***********
	Template.instance().$('.panel-tooltip').tooltipster({
		delay: 500,
		contentAsHTML: true,
		//trigger: 'click',
		//interactive: true,
	});
});

Template.userLogsPanel.helpers({
	'getLogTitle': function(obj){
		var groupOption = Session.get('groupOptions');
		if(obj._id !== null){
			switch(groupOption){
				default:
				case 'source':
					return truncString(obj._id, 20, true);
					break;

				case 'project':
					return getProjectFromID(obj._id);
					break;

				case 'hour':
					return formatDate(obj.logHour, 'HH:mm');
					break;
			}
		}
		//When no matched project exists (some bug) 
		else{
			return 'Unknown';
		}
	},
	'getLogsTimeRange': function(minDate, maxDate){
		return formatDate(minDate, 'HH:mm') + ' to ' + formatDate(maxDate, 'HH:mm');
	},
	'badgeStateClass': function(validCount, totalCount){
		return getBadgeStateClass(validCount, totalCount);
	},
	'collapsePanelOption': function(validCount, totalCount){
		
		var collapsed = Session.get('panelsCollapsed');

		if(typeof collapsed === 'undefined' || collapsed === true){
			return 'collapsed';
		}

		//var percentage = validCount/totalCount * 100;
		//if(percentage >= 75) return 'collapsed';
	},
	'getPanelTooltipContent': function(log){
		var minDate = moment(this.minDate);
		var maxDate = moment(this.maxDate);
		var logsLength = log.logs.length;
		var pluralLog = 'logs';

		if(logsLength === 1){
			pluralLog = 'log';
		}

		if(minDate.isSame(maxDate, 'minute')){
			return "<span class='log-count'>"+ logsLength + " "+ pluralLog +" at "+ formatDate(minDate, 'HH:mm') +"</span>";
		}
		else{
			return "<span class='log-count'>"+ logsLength + " "+ pluralLog +" between "+ formatDate(minDate, 'HH:mm') +" and "+ formatDate(maxDate, 'HH:mm') +"</span>";
		}
	}
});