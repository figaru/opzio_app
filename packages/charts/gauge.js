export const name = 'gauge';

NewGauge = function(data, options){

	this.options = options;
	this.el = options.el;

	this.red = '#F03131';
	this.orange = '#FFA726';
	this.yellow = '#FFC642';
	this.aqua = '#30DBD6';
	this.green = '#35BA43'; 

	this.darkblue = '#009BDD';
	this.blue = '#5ECFFF'; 
	this.purple = '#7E8ACD';
	this.pink = '#EC407A';

	//Pick radial color
	// if(options.stateColor){
	// 	if(data.percent < 16.6){
	// 		var percentColor = this.red;
	// 	}
	// 	else if(data.percent >= 16.6 && data.percent < 33.2){
	// 		var percentColor = this.orange;
	// 	}
	// 	else if(data.percent >= 33.2 && data.percent < 50){
	// 		var percentColor = this.yellow;
	// 	}
	// 	else if(data.percent >= 50 && data.percent < 66.6){
	// 		var percentColor = this.blue;
	// 	}
	// 	else if(data.percent >= 66.6 && data.percent < 83.2){
	// 		var percentColor = this.aqua;
	// 	}
	// 	else if(data.percent >= 83.2 && data.percent <= 100){
	// 		var percentColor = this.green;
	// 	}
	// }
	// else{
	// }
	var percentColor = this.blue;

	this.radialOptions = {
		animation: 0,
		fillColor: 'transparent',
		backgroundColor: '#efefef',
		backgroundBorderWidth: '22',
		foregroundColor: percentColor,
		foregroundBorderWidth: '22',
		targetColor: this.darkblue,
		noPercentageSign: true,
		text: '',
	}

	if(options.useIcon){
		this.radialOptions.iconColor = options.iconColor;
		this.radialOptions.icon = options.icon;
		this.radialOptions.iconSize = '70';
		this.radialOptions.iconPosition = 'bottom';
		
		this.el.data({ 'percent': data.percent, 'targetpercent':  data.targetpercent, 'iconcolor': data.iconColor });
	}
	else{
		this.el.data({ 'percent': data.percent, 'targetpercent':  data.targetpercent });
	}

	this.el.circliful(this.radialOptions);
}

NewGauge.prototype.redraw = function(data){

	//Pick radial color
	if(data.stateColor){
		if(data.percent < 16.6){
			var percentColor = this.red;
		}
		else if(data.percent >= 16.6 && data.percent < 33.2){
			var percentColor = this.orange;
		}
		else if(data.percent >= 33.2 && data.percent < 50){
			var percentColor = this.yellow;
		}
		else if(data.percent >= 50 && data.percent < 66.6){
			var percentColor = this.blue;
		}
		else if(data.percent >= 66.6 && data.percent < 83.2){
			var percentColor = this.aqua;
		}
		else if(data.percent >= 83.2 && data.percent <= 100){
			var percentColor = this.green;
		}
	}
	else{
		var percentColor = this.blue;
	}

	this.radialOptions['foregroundColor'] = percentColor;

	if(this.options.useIcon){
		this.el.data({ 'percent': data.percent, 'targetpercent': data.targetpercent, 'icon': data.icon, 'iconcolor': data.iconColor });
	}
	else{
		this.el.data({ 'percent': data.percent, 'targetpercent': data.targetpercent });
	}
	this.el.html('');
	this.el.circliful(this.radialOptions);
}