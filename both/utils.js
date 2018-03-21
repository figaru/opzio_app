prettyCount = function(value, format){
	if(typeof value === 'number'){
		if(value >= 1000 && value < 1000000){
			return Math.round( value / 1000 * 10 ) / 10 + 'k';
		}
		else if(value >= 1000000){
			return Math.round( value / 1000000 * 10 ) / 10 + 'm';
		}
		else{
			return value;
		}
	}
}

sortByTime = function(array, order){
	if(order === 'ascending'){
		array.sort(function(a,b){
			return a.totalTime - b.totalTime;
		})
	}
	else{
		array.sort(function(a,b){
			return b.totalTime - a.totalTime;
		})
	}
	//return array
}

orderByProperty = function(prop) {
	var args = Array.prototype.slice.call(arguments, 1);
	return function (a, b) {
		var equality = b[prop] - a[prop];
		if (equality === 0 && arguments.length > 1) {
			return orderByProperty.apply(null, args)(a, b);
		}
		return equality;
	};
};

initTooltips = function(){
	var w = Session.get('deviceWidth');

	var maxWidth = 970;

	if(w > 970){ 
		var minWidth = w * 0.2;
	}
	else if(w >= 560 && w <= 970){
		var minWidth = w * 0.4;
		var maxWidth = w;
	}
	else{
		var minWidth = w - 25;
		var maxWidth = minWidth;
	}

	var a = $('.tooltipster').tooltipster({
		contentAsHTML: true,
		trigger: 'click',
		minWidth: minWidth,
		maxWidth: maxWidth,
		interactive: true,
		// functionPosition: function(instance, helper, position){
		// 	position.coord.top += 200;
		// 	//position.coord.left += 200;
		// return position;
		// }
	});
}

validateEmail = function(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

getRandColor = function(){
	var colors = [/*'#61E4DF',*/'#40C4FF','#69F0AE','#EA80FC','#EEFF41','#FF4081','#4ACFEA'];	
	var randIndex = Math.floor(Math.random() * (colors.length - 1));
	return colors[randIndex];
}