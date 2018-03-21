import interact from '/client/_compatibility/interactjs.min.js';

initTimelineInteractions = function(templateData){
	var hoverEvent = ('ontouchstart' in window) ? 'click' : 'onmouseenter hover';
	var clickEvent = ('ontouchstart' in window) ? 'touchstart' : 'click';

	//Modal element
	var modalEl = $('#clusterModal');

	//Bottom Filters
	var modalTableFixedFilters = '<div id="modalTableFilterContainer" class="fixed-bottom hiddenFilter"><div id="modalTableFilters" class="shadow">'+modalTableBottomFilters+'</div></div>';

	//#####
	//Actual events
	//#####

	//Colapses cluster ranges and removes any tooltip when user clicks on group, timeaxis or vlabel
	$(document).on(clickEvent, '.group', function(e){
		if($(e.target).hasClass('group') || $(e.target).hasClass('timeaxis') || $(e.target).hasClass('vlabel')){
			templateData.timeline.setItems(templateData.originalItems);
			$(document).find('.tooltip-wrapper').remove();
		}
	});

	//Cluster tooltips when user hovers range items
	$(document).on('mouseenter', '.item.cluster', function(e){
		var item = $(e.currentTarget);
		var clusterinfo = item.data().clusterinfo;
		//console.log(clusterinfo)
		console.log('mouseover cluster')

		var itemId = item.data().id;
		var itemLeft = item.offset().left;
		var itemTop = item.offset().top - 100;

		var tooltipEl = $('<div class="timeline-tooltip card shadow"></div>');
		var tooltipWrapper = $('<div id="tooltip_'+itemId+'" class="tooltip-wrapper cluster-tooltip"></div>')

		var tooltipContent = $('<div class="card-block"></div>');
		var content = 	'<div class="row">\
							<div class="col-12">\
								<h6>Valid</h6>\
								<div class="horizontal-bar mw-50 mb-3">\
									<div class="column-wrapper column-tooltip">\
										<div class="column completion blue-gradient animate" style="width:'+clusterinfo.validPercentage+'%;">\
											<span class="bar-tooltip"><span class="content">'+clusterinfo.validPercentage+'%</span></span>\
										</div>\
									</div>\
								</div>\
							</div>\
							<div class="col-12">\
								<h6>Private</h6>\
								<div class="horizontal-bar mw-50 mb-3">\
									<div class="column-wrapper column-tooltip">\
										<div class="column completion blue-gradient animate" style="width:'+clusterinfo.privatePercentage+'%;">\
											<span class="bar-tooltip"><span class="content">'+clusterinfo.privatePercentage+'%</span></span>\
										</div>\
									</div>\
								</div>\
							</div>\
						</div>';
		tooltipContent.append(content);

		tooltipEl.append('<h6 class="card-header text-uppercase">'+ item.data().name +' - '+ getStringFromEpoch(clusterinfo.clusterTotalTime) + ' ('+ clusterinfo.logCount +' logs)</h6>')
		tooltipEl.append(tooltipContent)
		//tooltipEl.append(content)

		tooltipWrapper.append(tooltipEl);

		tooltipWrapper.css({
			position: 'absolute',
			//left: (itemLeft - 15) + 'px',
			opacity: 0
		});

		/*
		tooltipWrapper.bind('mouseleave', function(e){
			var el = $(document).find('.cluster-tooltip');
			el.animate({'opacity':0}, 200);
			Meteor.setTimeout(function(){
				el.remove();
			}, 1000);
		});
		*/

		//Append tooltip to body
		$('body').append(tooltipWrapper);

		//Once we have the element appended we can get it's height to account when positioning
		var domEl = $(document).find('.cluster-tooltip');
		var domElH = domEl.height();
		var domElOffset = domEl.offset();

		var contentOffset = item.find('.cluster-info').offset();
		var sectionOffset = $(document).find('.section-content').offset();

		//Check if we need to position tooltip above or below cluster
		var topPosition = itemTop - domElH + 90;
		if(topPosition - sectionOffset.top < 0){
			domEl.addClass('bottom');
			topPosition = itemTop + domElH - 120;
		}

		domEl.css({
			top: topPosition+'px',
			left: contentOffset.left - 20 + 'px',
			opacity: 1
		})

	});

	$(document).on('mouseleave', '.item.cluster', function(e){
		var el = $(document).find('.cluster-tooltip');
		el.remove();
	});

	//On timeline-item mouseover, display a dynamically positioned tooltip
	$(document).on(hoverEvent, '.timeline-item', function(e){
		console.log('mouseover timeline item')

		//Remove any visible tooltips
		$(document).find('.tooltip-wrapper').remove();

		var item = $(e.currentTarget);

		//console.log(item)
		
		var itemId = item.data().id;
		var itemLeft = item.offset().left;
		var itemTop = item.offset().top - 100;

		var title = '<h5 class="card-title">'+ item.data().name +'</h5>';
		//var content = '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos veritatis quis quam eaque nobis, inventore architecto iure natus, neque nihil accusamus voluptatum doloremque enim, sunt odio accusantium. Soluta, quod, sequi?</p>'
		
		var tooltipEl = $('<div class="timeline-tooltip card shadow"></div>');
		var tooltipWrapper = $('<div id="tooltip_'+itemId+'" class="tooltip-wrapper"></div>')

		var tooltipContent = $('<div class="card-block"></div>');
		tooltipContent.append(title);
		
		tooltipEl.append('<h6 class="card-header">'+ item.data().name +'</h6>')
		tooltipEl.append(tooltipContent)
		//tooltipEl.append(content)

		tooltipWrapper.append(tooltipEl);

		tooltipWrapper.css({
			position: 'absolute',
			left: (itemLeft - 15) + 'px',
			opacity: 0
		});

		tooltipWrapper.bind('mouseleave', function(e){
			var el = $(e.currentTarget);
			el.remove();
		});

		//Append tooltip to body
		$('body').append(tooltipWrapper);

		//Once we have the element appended we can get it's height to account when positioning
		var domEl = $(document).find('#tooltip_'+itemId);
		var domElH = domEl.height();
		domEl.css({
			top: (itemTop - domElH + 130)+'px',
			opacity: 1
		})
	});


	//InteractJS events, for press even, double-tap event
	interact('.pressaction')
	//Populate and show cluster modal on hold interaction
	.on('hold', function (e) {
		//console.log(templateData)
		let clusterData = $(e.currentTarget).data();

		modalEl.find('#clusterModalContent').text('');

		//Prepare table rows
		var logs = templateData.logs;
		//Select cluster logs only for later ordering and use
		var clusterItems = clusterData.clusteritems.split(',');
		var clusterLogs = [];
		for (var i in clusterItems) {
			clusterLogs.push(logs[clusterItems[i]])
		}

		clusterLogs.sort(orderByProperty('totalTime'))
		
		//Build table rows & retreive min/max times
		var startTime = endTime = 0;

		var trows = '';
		for(var i=0; i<clusterLogs.length; i++){
			//console.log(clusterLogs[i])
			if(startTime === 0 || clusterLogs[i].createDate < startTime) startTime = clusterLogs[i].createDate;
			if(endTime === 0 || clusterLogs[i].updateDate > endTime) endTime = clusterLogs[i].updateDate;
			
			trows += buildLogRow(clusterLogs[i]);
		}

		//Assemble final table element
		var table = $('<table id="modalTableLogs" class="table table-sm table-striped table-responsive"></table>');
		var thead = '<thead><tr><th></th><th>Source</th><th>Time</th><th>Category</th><th>Project</th><th>Private</th><th>Validated</th></tr></thead>';
		var tbody = '<tbody id="clsuterTableBody">'+ trows +'</tbody>';
		

		table.append(thead);
		table.append(tbody);

		//Assemble modal
		var title = clusterLogs.length + ' logs between ' + moment(startTime).format('HH:mm') + ' and ' + moment(endTime).format('HH:mm');
		modalEl.find('#clusterModalTitle').html(title);
		
		modalEl.find('#clusterModalContent').append('<div class="clusterTopFilters">'+modalTableTopFilters+'</div>');

		modalEl.find('#clusterModalContent').append(table);

		//Init privacy tooltips
		$(document).find('.tooltipster').tooltipster();

		//Init validation tooltips
		$(document).find('.validLogTooltipster').tooltipster({
			//trigger: 'click',
			delay: 2000
		});

		//Open modal
		modalEl.modal();

	})
	//Double tap/click will expand the content of the range cluster to reveal inner items
	.on('doubletap', function(e){
		console.log('doubletap range')
		$(document).find('.cluster-tooltip').remove();
		var ogItems = jQuery.extend(true, {}, templateData.originalItems);
		var visibleItems = new vis.DataSet();

		//console.log(e)
		//console.log('----------')
		
		//let clusterEl = $(document).find('.'+clusterName);
		
		//Check if we clicked on a cluster
		let clusterName = $(e.currentTarget).data().id;
		//console.log(clusterName)
		if(clusterName.indexOf('cluster') >= 0){
			for (var k in ogItems._data) {
				if(clusterName === ogItems._data[k].subgroup || ogItems._data[k].itemType === 'cluster'){
					let ogItem = ogItems._data[k];
					var modifiedItem = ogItems._data[k];
					//$('.'+k).toggleClass('hidden');
					if(modifiedItem.itemType != 'cluster'){
						modifiedItem['className'] = 'timeline-item blue m-4' + modifiedItem.id;
					}
					else{
						if(modifiedItem.id === clusterName){
							modifiedItem.type = 'background';
						}
					}
					visibleItems.add(modifiedItem)
					//timeline.redraw();
					//finalItems[k] = itemsData;
				}
			}
			//Set items that are visible only
			templateData.timeline.setItems(visibleItems);
		}
	});



	//Modal Events

	modalEl.on('shown.bs.modal', function(){
		//var modalWidth = $('#clusterModalContainer').width();
		//style="width:'+(modalWidth+20)+'px;"
		//console.log('show modal')
		$('body').append(modalTableFixedFilters);

		$('#selectLogsByBottom').on('click', function(e){
			console.log('bottom click')
			selectLogs(e.currentTarget);
		});

		//Init selectize inputs
		initSelectizeInputs();

	});

	$('.modal').on('scroll', function(){
		var topFiltersPosition = $(document).find('.clusterTopFilters').offset().top + 45;
		var selectedRows = $(document).find('tr.selected');
		if(topFiltersPosition <= 0 && selectedRows.length > 0){
			$('#modalTableFilterContainer').removeClass('hiddenFilter');
		}
		else{
			$('#modalTableFilterContainer').addClass('hiddenFilter');
		}
	})

	modalEl.on('hide.bs.modal', function(){
		$('#selectLogsByBottom').off('click')
		//remove bottom filter elements
		$('#modalTableFilterContainer').remove();
	});
}

buildLogRow = function(log){

	//Check validation
	if(log.validated) var isValid = '<input disabled checked="checked" class="validCheckbox tooltipster validLogTooltipster" title="You cannot change a previously validated log." type="checkbox" id="validLogCheckbox_'+ log._id +'" /><label data-action="validate" for="validLogCheckbox_'+ log._id +'"></label>';
		
	else var isValid = '<input class="validCheckbox" type="checkbox" id="validLogCheckbox_'+ log._id +'" /><label data-action="validate" for="validLogCheckbox_'+ log._id +'"></label>';

	//Check privacy
	if(log.private) var isPrivate = '<a href="#" id="private_'+log._id+'" class="tooltipster" title="Private, only you can see."><i class="fa fa-eye-slash text-muted"></i></a>';
		
	else var isPrivate = '<a href="#" id="private_'+log._id+'" class="tooltipster" title="Public, other members can see."><i class="fa fa-eye text-muted"></i></a>';
		
	var dataAttr = 'id="'+log._id+'"\
					data-projectid="'+log.project._id+'"\
					data-projectname="'+log.project.name+'"\
					data-type="'+log.type+'"\
					data-title="'+log.pageTitle+'"\
					data-url="'+log.uri+'"\
					data-domain="'+log.domain+'"\
					data-categoryid="'+log.category._id+'"\
					data-categorylabel="'+log.category.label+'"\
					data-private="'+log.private+'"\
					data-validated="'+log.validated+'"\
					data-usedForTraining="'+log.usedForTraining+'"\
					data-classified="'+log.classified+'"\
					data-totaltime="'+log.totaltime+'"';

	var row = '<tr class="userLogRow" '+ dataAttr +' >\
				<td>\
					<input type="checkbox" class="selectCheckbox filled-in variant" id="selectLog_'+ log._id +'" />\
					<label data-action="select" for="selectLog_'+ log._id +'"></label>\
				</td>\
				<td class="log-name mw-30">'+ log.pageTitle +'</td>\
				<td class="mw-10">'+ getStringFromEpoch(log.totalTime, true) +'</td>\
				<td class="w-200px">\
					<input type="text" name="categorySelect" class="demo-default selectized categorySelect form-control form-control-sm" value="'+ log.category.label +'" data-selected="'+ log.category._id +'">\
				</td>\
				<td class="w-200px">\
					<input type="text" name="systemProjectMatches" class="demo-default selectized systemProjectMatches form-control form-control-sm" value="'+ log.project.name +'" data-selected="'+ log.project._id +'">\
				</td>\
				<td>'+ isPrivate +'</td>\
				<td>'+ isValid +'</td>\
			</tr>';

	return row;

}

initSelectizeInputs = function(){

	//*************
	//	Project Selectize
	//*************
	//Build options
	var projectOptions = [];
	var allProjects = Projects.find({},{sort:{name:1}, reactive: false}).fetch();
	for(var i=0; i < allProjects.length; i++){
		projectOptions.push({
			'value': allProjects[i]._id,
			'text': capitalizeFirstLetter(allProjects[i].name)
		});
	}

	$('#modalTableLogs .systemProjectMatches').each(function(k, el){
		var projectSelectEl = $(el).selectize({
			maxItems: 1,
			create: false,
			placeholder: 'Select project',
			dropdownParent: "body",
			render: {
				option: function (data, escape) {
					return '<div class="option panelAction" data-action="setProject" data-value="' + data.value + '" data-id="'+ data.value +'">' + data.text + '</div>';
				}
			}
		});

		projectSelectEl[0].selectize.addOption(projectOptions);
	});

	//*************
	//	Category Selectize
	//*************
	//Build options
	var categoryOptions = [];
	var allCategories = DomainCategories.find().fetch();

	for(var i=0; i < allCategories.length; i++){
		categoryOptions.push({
			'value': allCategories[i]._id,
			'text': allCategories[i].label
		});
	}

	$('#modalTableLogs .categorySelect').each(function(k, el){
		var categorySelectEl = $(el).selectize({
			maxItems: 1,
			create: false,
			placeholder: 'Select category',
			dropdownParent: "body",
			render: {
				option: function (data, escape) {
					return '<div class="option panelAction" data-action="setCategory" data-value="' + data.value + '" data-id="'+ data.value +'">' + data.text + '</div>';
				}
			}
		});

		categorySelectEl[0].selectize.addOption(categoryOptions);
	});

}

modalTableTopFilters = '<div class="dropdown pull-left groupLogsSelector">\
							<a class="btn btn-secondary btn-sm dropdown-toggle text-black" type="button" id="selectLogsByTop" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><i class="fa fa-filter"></i> Select</a>\
							<ul class="dropdown-menu" aria-labelledby="selectLogsByTop">\
						 		<li class="dropdown-item half left">\
						 			<a href="#" data-action="selectAll" data-type="all" class="bulkSelect"><i class="fa fa-minus-square"></i> All</a>\
						 		</li>\
						 		<li class="dropdown-item half right">\
						 			<a href="#" data-action="selectNone" data-type="all" class="bulkSelect"><i class="fa fa-square-o"></i> None</a>\
						 		</li>\
						 		<li class="dropdown-item half left">\
						 			<a href="#" data-action="selectAllValid" data-type="valid" class="bulkSelect"><i class="fa fa-check"></i> Valid</a>\
						 		</li>\
						 		<li class="dropdown-item half right">\
						 			<a href="#" data-action="selectAllInvalid" data-type="valid" class="bulkSelect"><i class="fa fa-close"></i> Invalid</a>\
						 		</li>\
						 		<li class="dropdown-item half left">\
						 			<a href="#" data-action="selectAllPublic" data-type="private" class="bulkSelect"><i class="fa fa-eye"></i> Public</a>\
						 		</li>\
						 		<li class="dropdown-item half right">\
						 			<a href="#" data-action="selectAllPrivate" data-type="private" class="bulkSelect"><i class="fa fa-eye-slash"></i> Private</a>\
						 		</li>\
						  	</ul>\
						</div>\
						<div id="modalActions" class="modalActions">\
							<div class="dropdown privacy d-inline-block pull-right px-1">\
								<a class="btn btn-secondary btn-sm dropdown-toggle text-black" type="button" id="changeLogsPrivacyTop" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><i class="fa fa-filter"></i> Privacy</a>\
								<ul class="dropdown-menu" aria-labelledby="changeLogsPrivacyTop">\
							 		<li class="dropdown-item">\
							 			<a href="#" data-action="setPublic" data-type="private" class="text-black"><i class="fa fa-eye"></i> Set public</a>\
							 		</li>\
							 		<li class="dropdown-item">\
							 			<a href="#" data-action="setPrivate" data-type="private" class="text-black"><i class="fa fa-eye-slash"></i> Set private</a>\
							 		</li>\
								</ul>\
							</div>\
							<a class="btn btn-success btn-sm text-white" id="validateLogs" title="Validate all selected logs"><i class="fa fa-check"></i> Validate</a>\
						</div>';

modalTableBottomFilters = '<div class="modalActions visible bottom">\
							<div class="dropup privacy d-inline-block pull-right px-1">\
								<a class="btn btn-secondary btn-sm dropdown-toggle text-black" type="button" id="changeLogsPrivacyBottom" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><i class="fa fa-filter"></i> Privacy</a>\
								<ul class="dropdown-menu" aria-labelledby="changeLogsPrivacyBottom">\
							 		<li class="dropdown-item">\
							 			<a href="#" data-action="setPublic" data-type="private" class="text-black"><i class="fa fa-eye"></i> Set public</a>\
							 		</li>\
							 		<li class="dropdown-item">\
							 			<a href="#" data-action="setPrivate" data-type="private" class="text-black"><i class="fa fa-eye-slash"></i> Set private</a>\
							 		</li>\
								</ul>\
							</div>\
							<a class="btn btn-success btn-sm text-white pull-right px-1" id="validateLogsBottom" title="Validate all selected logs"><i class="fa fa-check"></i> Validate</a>\
						</div>';