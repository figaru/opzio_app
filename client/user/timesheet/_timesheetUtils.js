getBadgeStateClass = function(validCount, totalCount){
	var percentage = validCount/totalCount * 100;

	var stateClass = '';
	
	if(percentage >= 0 && percentage < 20){
		stateClass = 'very-incomplete';
	}
	else if(percentage >= 20 && percentage < 40){
		stateClass = 'incomplete';
	}
	else if(percentage >= 40 && percentage < 60){
		stateClass = 'half-complete';
	}
	else if(percentage >= 60 && percentage < 80){
		stateClass = 'mostly-complete';
	}
	else if(percentage >= 80 && percentage <= 100){
		stateClass = 'very-complete';
	}

	return stateClass;
};