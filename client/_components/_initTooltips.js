initTooltips = function(){
	console.log('initTooltips')
	var el = $(document).find('.tooltipster');

	el.tooltipster({
		contentAsHTML: true,
		delay: 500,
		//minWidth: minWidth,
		//maxWidth: maxWidth,
		//arrow: true,
		trigger: 'mouseenter',
		interactive: true,
	});
}