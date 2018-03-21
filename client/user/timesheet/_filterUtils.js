clearDropdownSelectInput = function(el){
	var dropdown = el.closest('.dropdown');
	var dropdownToggle = dropdown.find('.dropdown-toggle');
	var inputGroup = dropdown.find('.dropdown-input-group');
	var selectInput = inputGroup.find('input.selectInputPanel');

	dropdown.find('.selectize-input input').attr('placeholder', '');
	
	selectInput.val('');
	inputGroup.css({'display':'none'});
	dropdownToggle.css({'display':'inline-block'});
	Meteor.setTimeout(function(){
		try{
			selectInput.data('selectize').destroy();
		}
		catch(err){}
	}, 10);
}