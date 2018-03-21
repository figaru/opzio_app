
//Filters interaction
$(document).on('click', '.bulkSelect', function(e){
	console.log('bulkSelect')
	selectLogs(e.currentTarget);
});

$(document).on('click', 'tr .selectCheckbox', function(e){
	if($(e.currentTarget).prop('checked')){
		$(e.currentTarget).closest('tr').addClass('selected');
	}
	else{
		$(e.currentTarget).closest('tr').removeClass('selected');	
	}

	var topFiltersPosition = $(document).find('.clusterTopFilters').offset().top + 45;
	var selectedRows = $(document).find('tr.selected');
	
	if(selectedRows.length > 0){
		$(document).find('#modalActions').addClass('visible');
		if(topFiltersPosition <= 0){
			$('#modalTableFilterContainer').removeClass('hiddenFilter');
		}
		else{
			$('#modalTableFilterContainer').addClass('hiddenFilter');
		}
	}
	else{
		$(document).find('#modalActions').removeClass('visible');
		$('#modalTableFilterContainer').addClass('hiddenFilter');
	}


})

var selectedLogs = $('tr.selected');
Session.set('selectedLogs', selectedLogs.length);

selectLogs = function(el) {
	var action = el.getAttribute('data-action');
	var tableEl = $(document).find('#modalTableLogs');

	console.log(tableEl)

	switch(action){
		case 'selectAll':
			var checkboxes = tableEl.find('tr:not(.hidden) .selectCheckbox');
			if(checkboxes.length > 0){
				_.each(checkboxes, function(el, k){
					$(el).prop('checked', true);
					$(el).closest('tr').addClass('selected');
				});
			}
			else{
				toastr.warning('', 'No logs found.')
			}
			break;

		case 'selectNone':
			var checkboxes = tableEl.find('tr:not(.hidden) .selectCheckbox');
			if(checkboxes.length > 0){
				_.each(checkboxes, function(el, k){
					$(el).prop('checked', false);
					$(el).closest('tr').removeClass('selected');
				});
			}
			else{
				toastr.warning('', 'No logs found.')
			}
			break;

		case 'selectAllPublic':
			var checkboxes = tableEl.find('tr:not(.hidden)[data-private="false"] .selectCheckbox');
			if(checkboxes.length > 0){
				_.each(checkboxes, function(el, k){
					$(el).prop('checked', true);
					$(el).closest('tr').addClass('selected');
				});
			}
			else{
				toastr.warning('', 'No public logs found.')
			}
			break;

		case 'selectAllPrivate':
			var checkboxes = tableEl.find('tr:not(.hidden)[data-private="true"] .selectCheckbox');
			if(checkboxes.length > 0){
				_.each(checkboxes, function(el, k){
					$(el).prop('checked', true);
					$(el).closest('tr').addClass('selected');
				});
			}
			else{
				toastr.warning('', 'No private logs found.')
			}
			break;

		case 'selectAllValid':
			var checkboxes = tableEl.find('tr:not(.hidden)[data-validated="true"] .selectCheckbox');
			if(checkboxes.length > 0){
				_.each(checkboxes, function(el, k){
					$(el).prop('checked', true);
					$(el).closest('tr').addClass('selected');
				});
			}
			else{
				toastr.warning('', 'No valid logs found.')
			}
			break;

		case 'selectAllInvalid':
			var checkboxes = tableEl.find('tr:not(.hidden)[data-validated="false"] .selectCheckbox');
			if(checkboxes.length > 0){
				_.each(checkboxes, function(el, k){
					$(el).prop('checked', true);
					$(el).closest('tr').addClass('selected');
				});
			}
			else{
				toastr.warning('', 'No invalid logs found.')
			}
			break;

		case 'selectAllDomain':
			var selectCriteria = el.getAttribute('data-domain');
			var checkboxes = tableEl.find('tr:not(.hidden)[data-domain="'+ selectCriteria +'"] .selectCheckbox');
			_.each(checkboxes, function(el, k){
				$(el).prop('checked', true);
				$(el).closest('tr').addClass('selected');
			});
			break;

		case 'selectAllTitle':
			var selectCriteria = el.getAttribute('data-title');
			var checkboxes = tableEl.find('tr:not(.hidden)[data-title="'+ selectCriteria +'"] .selectCheckbox');
			_.each(checkboxes, function(el, k){
				$(el).prop('checked', true);
				$(el).closest('tr').addClass('selected');
			});
			break;
	}

	var selectedLogs = tableEl.find('tr.selected');
	
	if(selectedLogs.length > 0){
		$(document).find('#modalActions').addClass('visible');
	}
	else{
		$(document).find('#modalActions').removeClass('visible');
	}
}