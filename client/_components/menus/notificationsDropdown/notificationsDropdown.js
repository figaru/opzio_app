Template.notificationsDropdown.onRendered(function(){
	//Open dropdown when clicking on element
	$(document).on('click', "[data-dropdown='notificationMenu']",  function(e){
		e.preventDefault();

		var el = $(e.currentTarget);

		$(document).find('#dropdownOverlay').show();

		var container = $(e.currentTarget).parent();
		var dropdown = container.find('.notification-dropdown');
		var containerWidth = container.width();
		var containerHeight = container.height();

		var anchorOffset = $(e.currentTarget).offset();

		dropdown.css({
			'right': 1 + 'px'
		})

		container.toggleClass('expanded')
	  
	});

	//Close dropdowns on document click
	$(document).on('click', '#dropdownOverlay', function(e){
	
		var el = $(e.currentTarget)[0].activeElement;

		if(typeof $(el).attr('data-dropdown') === 'undefined'){
			
			$(document).find('#dropdownOverlay').hide();

			$('.dropdown-container.expanded').removeClass('expanded');
		}
	})

	//Dropdown collapsile tabs
	$('.notification-tab').click(function(e){
	  if($(e.currentTarget).parent().hasClass('expanded')){
	    $('.notification-group').removeClass('expanded');
	  }
	  else{
	    $('.notification-group').removeClass('expanded');
	    $(e.currentTarget).parent().toggleClass('expanded');
	  }
	})
})