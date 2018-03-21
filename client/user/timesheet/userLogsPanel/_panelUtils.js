getPanelPositions = function(){
	var panelPositions = [];
	_.each($('.panel'), function(el, k){
		var panel = $(el).parent();
		var top = $(el).offset().top;
		var bottom = top + panel.outerHeight(true) - 50;
		panelPositions.push([top, bottom]);
	});
	return panelPositions;
}

setFixedHeader = function(scrollPos){
	var panelPositions = getPanelPositions();
	for(var i=0; i<panelPositions.length; i++){
		var header = $('.panel-header')[i];
		if(scrollPos >= panelPositions[i][0] && scrollPos < panelPositions[i][1]){
			//only fix if panel is not collapsed
			if($(header).closest('.panel').hasClass('collapsed') === false){ $(header).addClass('fixed'); }
		}
		else{ $(header).removeClass('fixed'); }
	}
}