// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See charts-tests.js for an example of importing.
export const name = 'charts';

import Highcharts from 'highcharts';

NewChart = function(data, options){
	//console.log('chart constructor')
	this.data = data;
	this.el = options.el;
	this.options = options;
	this.dataContext = options.dataContext;
	this.detail = options.detail;
	this.range = options.range;

	this.startDate = new Date(options.startDate);
	this.endDate = new Date(options.endDate);

	this.startDate = moment(this.startDate);
	this.endDate = moment(this.endDate);

	//Use these to get the period's length and iterate the value
	this.firstDay = parseInt(this.startDate.format('DDD')),
	this.lastDay = parseInt(this.endDate.format('DDD'));

	this.chartColors = [
		//'#009BDD',
		'#5ECFFF',
		'#30DBD6',
		'#EA80FC', 
		'#69F0AE',
		'#EEFF41', 
		'#FF4081', 
		'#4ACFEA',
		'#8AD3C1',
		'#EBA0CC',
		'#F2CE51',
		'#CE61A1',
		//'#54DAD5',
		'#ABB6D5',
		'#ECC09C',
		'#F69D61',
		'#9D83C1',
		'#5FE5C0',
		'#CC9AE9',
		'#EDE16C',
		'#FB6C72',
		'#6CA5E1',
		'#69F0AE',
		'#EA7FFC',
		'#EEFF41',
		'#FF4081',
		'#40C4FF',
		'#5EE4C2',
		'#C99CE8',
		'#ECDE70',
		'#FA7070',
		'#70A2DE',
		'#54D9D7',
		'#A8B9D4',
		'#EBBEA0',
		'#F6A160'
	];
};

NewChart.prototype.drawBarsChart = function(){
	let data = this.data;
	let el = this.el;
	let dataContext = this.dataContext
	let detail = this.detail;
	let range = this.range;
	let chartColors = this.chartColors;
	
	
	if(range === 'day'){
		switch(dataContext){
			case 'organization':
				//console.log('prepare realtime/day data for organization')
				var preparedData = this.prepareDynamicHoursArray(data, 'organization', 'column');
				break;
			case 'projects':
				//console.log('prepare realtime/day data for projects')
				var preparedData = this.prepareDynamicHoursArray(data, 'projects', 'column');
				break;
			case 'project':
				//console.log('prepare realtime/day data single project')
				var preparedData = this.prepareDynamicHoursArray(data, 'project', 'column');
				break;
			case 'user':
				//console.log('prepare realtime/day data single user')
				var preparedData = this.prepareDynamicHoursArray(data, 'user', 'column');
				break;
		}
	}
	else{
		switch(dataContext){
			case 'organization':
				//console.log('prepare range data organization')
				var preparedData = this.prepareDynamicDaysArray(data, 'organization', 'column');
				break;
			case 'projects':
				//console.log('prepare range data projects')
				var preparedData = this.prepareDynamicDaysArray(data, 'projects', 'column');	
				break;
			case 'project':
				//console.log('prepare range data project')
				var preparedData = this.prepareDynamicDaysArray(data, 'project', 'column');
				break;
			case 'user':
				//console.log('prepare range data single user')
				var preparedData = this.prepareDynamicDaysArray(data, 'user', 'column');
				break;
		}
	}

	//console.log('drawBarsChart')
	//console.log(preparedData.series)

	if(preparedData.series.length === 0){
		el.html('')
		el.prev().remove();
		el.append(emptyBarsChart);
	}
	else{
		el.prev().remove();
		el.highcharts({
		    
		    chart: {
		        //type: 'column',
		        animation: false,
		        backgroundColor: 'transparent',
		    },
		    colors: chartColors,
		    credits: { enabled: false },
		    title: { text: '' },
		    xAxis: { 
		    	categories: preparedData.categories,
		    	/*
		    	labels:{
		    		events: {
						dblclick: function () {
						    alert('dbclick on xAxis title');
						},
						click: function () {
						    alert('click on xAxis title');
						},
						contextmenu: function () {
						    alert('context menu on xAxis title');
						}
					}
		    	}
		    	*/
		    },
		    yAxis: {
		    	visible: true,
		    	gridLineColor: 'transparent',
		        //tickPositioner: preparedData.tickPositioner,
		        tickInterval: preparedData.tickInterval,
		        min: 0,
		        title: {
		            text: '' //Accumulated Time
		        },
		        labels: {
		            formatter: function () {
		                return getStringFromEpoch(this.value, 'hoursOnly');
		            },
		        },
		        stackLabels: {
		            enabled: true,
		            formatter: function(){
		                if(this.total > 0){
		                    return getStringFromEpoch(this.total);
		                }
		                else{
		                    return '';
		                }
		            },
		            style:{
		            	'fontWeight': 'thin'
		            }
		        },
		    },
		    tooltip: {
		        useHTML: true,
		        backgroundColor: '#FFF',
		        formatter: function () {
					switch(dataContext){
						case 'organization':
					        return '<b>' + this.x +" period"+  '</b><br/>' 
					        		+ '<p>'
					        		+ this.series.name + ': ' + getStringFromEpoch(this.y) 
					        		+ '</p>';
					        break;
						case 'projects':
							return '<b>' + this.x +" period"+  '</b><br/>' 
									+ '<p>'
									+ getProjectFromID(this.series.name) + ': ' + getStringFromEpoch(this.y) 
									+ '</p>';
							break;
						case 'project':
							return '<b>' + this.x +" period"+  '</b><br/>' 
									+ '<p>'
									+ getUserShortName(this.series.name) + ': ' + getStringFromEpoch(this.y) 
									+ '</p>';
							break;
						case 'user':
							if(range === 'day'){
								return '<b>' + this.x +" period"+  '</b><br/>' 
									+ '<a href="/project/'+ this.series.name +'/dashboard">'
									+ getProjectFromID(this.series.name) + '</a>:<p>'+getStringFromEpoch(this.y) +'</p>';
							}
							else{
								return '<b>' + this.x +" period"+  '</b><br/>' 
									+ '<a href="/project/'+ this.series.name +'/dashboard">'
									+ getProjectFromID(this.series.name) + '</a>:<p>'+getStringFromEpoch(this.y) +'</p>';
							}
							
							break;
					}
		            //return '<b>' + this.x +" period"+  '</b><br/>' + '<p><em>Total</em>: ' + getStringFromEpoch(this.y) + '</p>';
		        }
		    },
		    legend:{
		    	enabled: true,
		        labelFormatter: function(){
		            switch(dataContext){
		                case 'organization':
		                    return this.name;
		                    break;

						case 'projects':
							return getProjectFromID(this.name);
							break;

						case 'project':
							return getUserShortName(this.name);
							break;

						case 'user':
							return getProjectFromID(this.name);
							break;

		                default:
		                    return this.name;
		            }
		        },
		    },
		    plotOptions: {
		        column: {
		            stacking: 'normal',
		            dataLabels: {
		                enabled: false,
		                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
		                style: {
		                    fontWeight: 'thin',
		                    color: 'black',
		                    textShadow: '0 0 3px black'
		                },
		                formatter: function(){
		                    return getStringFromEpoch(this.y, false);
		                }
		            }
		        },
		        series: {
		            animation: false,
		            cursor: 'pointer',
		            marker: {
		                enabled: false,
		                symbol: 'circle',
		                radius: 2,
		                states: {
		                    hover: {
		                        enabled: true
		                    }
		                }
		            },
		            events: {
	                    legendItemClick: function(event) {
	                        var selected = this.index;
	                        var allSeries = this.chart.series;

	                        if(this.visible){
	                        	if(allSeries.length > 0 && selected !== 0){
	                        		if(allSeries[0].visible){
				                        $.each(allSeries, function(index, series) {
				                            selected == index ? series.show() : series.hide();
				                        });
	                        		}
	                        		else{
	                        			$.each(allSeries, function(index, series) {
				                            series.show();
				                        });
	                        		}
	                        	}
	                        	else{
	                        		if(allSeries[1].visible){
				                        $.each(allSeries, function(index, series) {
				                            selected == index ? series.show() : series.hide();
				                        });
	                        		}
	                        		else{
	                        			$.each(allSeries, function(index, series) {
				                            series.show();
				                        });
	                        		}
	                        	}
	                        }
	                        else{
	                        	$.each(allSeries, function(index, series) {
		                            selected == index ? series.show() : series.hide();
		                        });
	                        }
	                        
	                        return false;
	                    }
	                }
		        }
		    },
		    series: preparedData.series,
		});
	}
};

NewChart.prototype.drawAreaChart = function(){
	let data = this.data;
	let el = this.el;
	let dataContext = this.dataContext
	let detail = this.detail;
	let range = this.range;
	let chartColors = this.chartColors;
	
	
	if(range === 'day'){
		switch(dataContext){
			case 'organization':
				//console.log('prepare realtime/day data for organization')
				var preparedData = this.prepareDynamicHoursArray(data, 'organization');
				break;
			case 'projects':
				//console.log('prepare realtime/day data for projects')
				var preparedData = this.prepareDynamicHoursArray(data, 'projects');
				break;
			case 'project':
				//console.log('prepare realtime/day data single project')
				var preparedData = this.prepareDynamicHoursArray(data, 'project');
				break;
			case 'user':
				//console.log('prepare realtime/day data single user')
				var preparedData = this.prepareDynamicHoursArray(data, 'user', 'spline');
				break;
		}
	}
	else{
		switch(dataContext){
			case 'organization':
				//console.log('prepare range data organization')
				var preparedData = this.prepareDynamicDaysArray(data, 'organization');
				break;
			case 'projects':
				//console.log('prepare range data projects')
				var preparedData = this.prepareDynamicDaysArray(data, 'projects');	
				break;
			case 'project':
				//console.log('prepare range data project')
				var preparedData = this.prepareDynamicDaysArray(data, 'project');
				break;
			case 'user':
				//console.log('prepare range data single user')
				var preparedData = this.prepareDynamicDaysArray(data, 'user', 'spline');
				break;
		}
	}

	if(preparedData.series.length === 0){
		el.html('')
		el.prev().remove();
		el.append(emptyBarsChart);
	}
	else{
		el.prev().remove();

		el.highcharts({
		    
		    chart: {
		        type: 'spline',
		        animation: false,
		        backgroundColor: 'transparent',
		    },
		    colors: chartColors,
		    credits: { enabled: false },
		    title: { text: '' },
		    xAxis: { 
		    	categories: preparedData.categories,
		    },
		    yAxis: {
		    	visible: true,
		    	gridLineColor: 'transparent',
		        //tickPositioner: preparedData.tickPositioner,
		        tickInterval: preparedData.tickInterval,
		        min: 0,
		        title: {
		            text: '' //Accumulated Time
		        },
		        labels: {
		            formatter: function () {
		                return getStringFromEpoch(this.value, 'hoursOnly');
		            },
		        },
		    },
		    tooltip: {
		        useHTML: true,
		    	backgroundColor: '#FFF',
		        split: true,
		        formatter: function () {
					switch(dataContext){
						case 'organization':
					        return '<b>' + this.x +" period"+  '</b><br/>' 
					        		+ '<p>'
					        		+ this.series.name + ': ' + getStringFromEpoch(this.y) 
					        		+ '</p>';
					        break;
						case 'projects':
							return '<b>' + this.x +" period"+  '</b><br/>' 
									+ '<p>'
									+ getProjectFromID(this.series.name) + ': ' + getStringFromEpoch(this.y) 
									+ '</p>';
							break;
						case 'project':
							return '<b>' + this.x +" period"+  '</b><br/>' 
									+ '<p>'
									+ getUserShortName(this.series.name) + ': ' + getStringFromEpoch(this.y) 
									+ '</p>';
							break;
						case 'user':
							if(range === 'day'){
								return '<b>' + this.x +" period"+  '</b><br/>' 
									+ getCategoryFromID(this.series.name)+':<p>'+getStringFromEpoch(this.y) +'</p>';
							}
							else{
								return '<b>' + this.x +" period"+  '</b><br/>' 
									+ getCategoryFromID(this.series.name)+':<p>'+getStringFromEpoch(this.y) +'</p>';
							}
							
							break;
					}
		            //return '<b>' + this.x +" period"+  '</b><br/>' + '<p><em>Total</em>: ' + getStringFromEpoch(this.y) + '</p>';
		        }
		    },
		    legend:{
		    	enabled: true,
		        labelFormatter: function(){
		            switch(dataContext){
		                case 'organization':
		                    return this.name;
		                    break;

						case 'projects':
							return getProjectFromID(this.name);
							break;

						case 'project':
							return getUserShortName(this.name);
							break;

						case 'user':
							return getCategoryFromID(this.name);
							break;

		                default:
		                    return this.name;
		            }
		        },
		    },
		    plotOptions: {
		        series: {
		        	marker: {
						enabled: false,
						states: {
							hover: {
								enabled: false
							}
						}
					},
					animation: false,
		            events: {
	                    legendItemClick: function(event) {
	                        var selected = this.index;
	                        var allSeries = this.chart.series;

	                        if(this.visible){
	                        	if(allSeries.length > 0 && selected !== 0){
	                        		if(allSeries[0].visible){
				                        $.each(allSeries, function(index, series) {
				                            selected == index ? series.show() : series.hide();
				                        });
	                        		}
	                        		else{
	                        			$.each(allSeries, function(index, series) {
				                            series.show();
				                        });
	                        		}
	                        	}
	                        	else{
	                        		if(allSeries[1].visible){
				                        $.each(allSeries, function(index, series) {
				                            selected == index ? series.show() : series.hide();
				                        });
	                        		}
	                        		else{
	                        			$.each(allSeries, function(index, series) {
				                            series.show();
				                        });
	                        		}
	                        	}
	                        }
	                        else{
	                        	$.each(allSeries, function(index, series) {
		                            selected == index ? series.show() : series.hide();
		                        });
	                        }
	                        
	                        return false;
	                    }
	                }
		        }
		    },
		    series: preparedData.series,
		});
	}
};

NewChart.prototype.drawSimpleAreaChart = function(chartOptions, chartData){
	let el = chartOptions.el;
	let data = chartData;

	let dataContext = this.dataContext
	let detail = this.detail;
	let range = this.range;
	let chartColors = this.chartColors;
	
	//console.log('drawSimpleAreaChart', range, dataContext);

	if(range === 'day'){
		switch(dataContext){
			case 'project':
				//console.log('prepare realtime/day data single project')
				var preparedData = this.prepareDynamicHoursArray(data, 'project', 'areaspline');
				break;
			case 'user':
				//console.log('prepare realtime/day data single user')
				var preparedData = this.prepareDynamicHoursArray(data, 'user', 'areaspline');
				break;
		}
	}
	else{
		switch(dataContext){
			case 'project':
				var preparedData = this.prepareDynamicDaysArray(data, 'project', 'areaspline', true);
				break;
			case 'user':
				//console.log('prepare range data single user')
				var preparedData = this.prepareDynamicDaysArray(data, 'user', 'areaspline');
				break;
		}
	}

	//console.log('draw drawSimpleAreaChart')
	//console.log(preparedData)

	if(preparedData.series.length === 0){
		el.html('')
		el.prev().remove();
		el.append(emptyBarsChart);
	}
	else{
		el.prev().remove();
		
		var total = preparedData.series[0].data.reduce(function(prev, curr) { return prev + curr; });

		//Super shitty to change a non chart element here, but this the only place where we get the total
		if(total > 0){
			el.parent().find('.periodTotal').text(getStringFromEpoch(total, true));
		}
		else{
			el.parent().find('.periodTotal').text('No activity')
		}


		//Chech if there's data to greate Y plotline 

		if(preparedData.aggregated){
			var plotLineOptions = [{
				value: preparedData.maxValue,
				color: '#EEE',
				//className: 'maxValueLine',
				dashStyle: 'line',
				width: 1,
				label: {
					text: 'Max ' + getStringFromEpoch(preparedData.maxValue, true) + ' / day',
					x: 25,
					y: -5
				}
			}];
		}
		else{
			var plotLineOptions = []
		}


		el.highcharts({
		    chart: {
		        type: 'area',
		        animation: false,
		        backgroundColor: 'transparent',
		        marginLeft: -10,
                marginRight: -25,
                marginBottom: -2,
                style: {
                    fontFamily: "'Raleway', sans-serif",
                    fontWeight: 300
                }
		    },
		    colors: chartColors,
		    credits: { enabled: false },
		    title: { text: '' },
		    xAxis: { 
		    	categories: preparedData.categories,
		    	lineWidth: 0,
		    	minorGridLineWidth: 0,
		    	lineColor: 'transparent',
		    	labels: {
		    		enabled: false
		    	},
		    	min: 0.5,
	            max: 6.5,
		    	minPadding: 0,
        		maxPadding: 0,
		    	minorTickLength: 0,
		    	tickLength: 0,
		    },
		    yAxis: {
		    	visible: true,
		    	gridLineColor: 'transparent',
		        lineWidth: 0,
		        minorGridLineWidth: 0,
		        lineColor: 'transparent',
		        labels: {
		        	enabled: false
		        },
		        minorTickLength: 0,
		        tickLength: 0,
		        title:{
		        	text: null
		        },
		        plotLines: plotLineOptions,
		    },
		    tooltip: {
		        useHTML: true,
		        backgroundColor: '#FFF',
		        split: true,
		        formatter: function () {
					switch(dataContext){
						case 'organization':
					        return '<b>' + this.x +" period"+  '</b><br/>' 
					        		+ '<p>'
					        		+ this.series.name + ': ' + getStringFromEpoch(this.y) 
					        		+ '</p>';
					        break;
						case 'projects':
							return '<b>' + this.x +" period"+  '</b><br/>' 
									+ '<p>'
									+ getProjectFromID(this.series.name) + ': ' + getStringFromEpoch(this.y) 
									+ '</p>';
							break;
						case 'project':
							return '<b>' + this.x +  '</b><br/>' 
									+ '<p>'
									+ this.series.name + ': ' + getStringFromEpoch(this.y) 
									+ '</p>';
							break;
						case 'user':
							if(range === 'day'){
								return '<b>' + this.x +" period"+  '</b><br/>' 
									+ getCategoryFromID(this.series.name)+':<p>'+getStringFromEpoch(this.y) +'</p>';
							}
							else{
								return '<b>' + this.x +" period"+  '</b><br/>' 
									+ getCategoryFromID(this.series.name)+':<p>'+getStringFromEpoch(this.y) +'</p>';
							}
							
							break;
					}
		            //return '<b>' + this.x +" period"+  '</b><br/>' + '<p><em>Total</em>: ' + getStringFromEpoch(this.y) + '</p>';
		        }
		    },
		    legend:{
		    	enabled: false,
		        labelFormatter: function(){
		            switch(dataContext){
		                case 'organization':
		                    return this.name;
		                    break;

						case 'projects':
							return getProjectFromID(this.name);
							break;

						case 'project':
							return getUserShortName(this.name);
							break;

						case 'user':
							return getCategoryFromID(this.name);
							break;

		                default:
		                    return this.name;
		            }
		        },
		    },
		    plotOptions: {
		        series: {
		        	lineWidth: 0,
		        	marker: {
						enabled: false,
						states: {
							hover: {
								enabled: false
							}
						}
					},
					animation: false,
		        }
		    },
		    series: preparedData.series,
		});
	}	
}

NewChart.prototype.drawHorizontalBarsChart = function(){

	let data = this.data;
	let el = this.el;
	let dataContext = this.dataContext
	let detail = this.detail;
	let range = this.range;
	let chartColors = this.chartColors;
	
	
	var preparedData = this.prepareHorizontalBarsArray(data, dataContext, detail);
	
	//console.log(preparedData)

	el.highcharts({
		chart: {
			type: 'bar',
			animation: false,
			backgroundColor: 'transparent',
		},
		colors: chartColors,
		credits: { enabled: false },
		title: { text: '' },
		xAxis: {
		    categories: preparedData.categories,
		    labels: {
		    	useHTML: true,
		        formatter: function () {
					switch(dataContext){
						case 'projects':
							//console.log(this.value)
		            		return '<a href="/project/'+ this.value +'/dashboard">'+getProjectFromID(this.value) + '</a>';
							break;
						case 'project':
						case 'organization':
							return '<a href="/user/'+ this.value +'/dashboard">'+ getUserShortName(this.value) + '</a>';
							break;
						default:
							return this.value;
							break;
					}
		        },
		    },
		},
		yAxis: {
		    min: 0,
		    labels: {
		        formatter: function () {
		            return getStringFromEpoch(this.value, 'hoursOnly');
		        },
		    },
		    title: { text: '' },
		},
		legend: {
		    reversed: true
		},
		tooltip: {
		    valueSuffix: 'Hrs',
		    backgroundColor: '#FFF',
		    formatter: function(){
		    	switch(dataContext){
		    		case 'projects':
		        		return '<b>' + getProjectFromID(this.x) + '</b><br>'+this.series.name+': '+getStringFromEpoch(this.y) + '<br>Total: ' + getStringFromEpoch(this.point.stackTotal);
		        		break;
		        	case 'project':
		        	case 'organization':
		        		return '<b>' + getUserShortName(this.x) + '</b><br>'+this.series.name+': '+getStringFromEpoch(this.y) + '<br>Total: ' + getStringFromEpoch(this.point.stackTotal);
		        		break;
		    		default:
		    			return '<b>' + this.x + '</b><br>'+this.series.name+': '+getStringFromEpoch(this.y) + '<br>Total: ' + getStringFromEpoch(this.point.stackTotal);
		    			break;
		    	}
		    }
		},
		plotOptions: {
			bars: {
			    dataLabels: {
			        enabled: true,
			        formatter: function () {
			            return getStringFromEpoch(this.y);
			        }
			    }
			},
		    series: {
		        stacking: 'normal',
		        animation: false
		    }
		},
		series: preparedData.series,
	});	
};

NewChart.prototype.drawPieChart = function(){
	let data = this.data;
	let el = this.el;
	let dataContext = this.dataContext
	let detail = this.detail;
	let range = this.range;
	let chartColors = this.chartColors;

	var preparedData = this.preparePieChartData(data, dataContext);

	if(preparedData.length === 0){
		el.html('')
		el.prev().remove();
		el.append(emptyPieChart);
	}
	else{	
		el.highcharts({
			chart: {
	            type: 'pie',
	            backgroundColor: 'transparent',
				animation: false,
	            plotBackgroundColor: null,
	            plotBorderWidth: false,
	            plotShadow: false,
	        },
	        colors: chartColors,
	        credits: { enabled: false },
	        title: { text: '' },
	        tooltip: {
		        headerFormat: '',
		        backgroundColor: '#FFF',
		        pointFormatter: function () {
		        	switch(dataContext){
		        		case 'organization':
		        		case 'user':
							return '<b>' + this.name + '</b><br/>' 
									+ '<p>'+ getStringFromEpoch(this.y) + ' ('+ Math.round(this.percentage * 100)/100 +'%)</p>';
		        			break;
		        		case 'projects':
							return '<b>' + getProjectFromID(this.name) + '</b><br/>' 
									+ '<p>'+ getStringFromEpoch(this.y) + ' ('+ Math.round(this.percentage * 100)/100 +'%)</p>';
		        			break;
		        		case 'project':
							return '<b>' + getUserShortName(this.name) + '</b><br/>' 
									+ '<p>'+ getStringFromEpoch(this.y) + ' ('+ Math.round(this.percentage * 100)/100 +'%)</p>';
		        			break;
		        	}
		        }
	            //pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	        },
	        legend: {
	        	labelFormatter: function(){
	        		switch(dataContext){
						case 'organization':
						case 'user':
							return this.name;
							break;

						case 'projects':
							return getProjectFromID(this.name);
							break;
						
						case 'project':
							return getUserShortName(this.name);
							break;

						default:
							return this.name;
							break;
	        		}
	        	}
	        },
	        plotOptions: {
	            pie: {
	                dataLabels: {
	                    enabled: false
	                },
	                showInLegend: true,
	            },
	        },
	        series: [{
	        	animation: false,
	            name: 'Activities',
	            colorByPoint: true,
	            innerSize: '60%',
	            data: preparedData,
	        }]
		});
	}
};

//-------------
//	HELPER FUNCTIONS to manipulate/prepare data for charts
//-------------

NewChart.prototype.prepareHorizontalBarsArray = function(data, dataContext, detail){
	var seriesArray = [];
	var categories = []
	var maxValue = 0;

	var totalArray = [], validatedArray = [], unknownArray = [];

	var validatedTime = {
		'name': 'Validated',
		'color': '#5ECFFF',
		'data': []
	}

	var unknownTime = {
		'name': 'Uncertain',
		'color': '#EEE',
		'data': []
	}

	//Change some naming
	if(dataContext === 'organization'){
		validatedTime['name'] = 'Total Time'
	}

	//Get average
	var totalArray = [];
	_.each(data, function(val, key){
		totalArray.push(val.totalTime);
	});

	var avgSum = totalArray.reduce(function(acc, cur){ return acc + cur; }, 0) / totalArray.length;

	//Only consider projects/users with totalTime above acg
	_.each(data, function(val, key){
		//	ADD val.totalTime >= avgSum && 
		//	to only show above average team members
		if(val._id !== 'null' && val._id !== ''){
			
			// totalArray = totalTime['data'].slice(0);
			// totalArray.push(val.totalTime);
			// totalTime['data'] = totalArray;


			
			validatedArray = validatedTime['data'].slice(0);
			validatedArray.push(val.validatedTime);
			validatedTime['data'] = validatedArray;

			if(detail !== 'validOnly'){				
				unknownArray = unknownTime['data'].slice(0);
				unknownArray.push(val.unknownTime);
				unknownTime['data'] = unknownArray;
			}


			categories.push(val._id);

			if(val.totalTime > maxValue){
				maxValue = val.totalTime;
			}
		}
	});

	//seriesArray.push(totalTime)
	seriesArray.push(validatedTime);
	if(detail !== 'validOnly'){		
		seriesArray.push(unknownTime);
	}

	var tickData = this.yTickPositioner(maxValue);

	// switch(dataContext){
	// 	case 'organization':
	// 		console.log(dataContext)
	// 		break;
	// 	case 'projects':
	// 		console.log(dataContext)
	// 		break;
	// }

	return {
		'series': seriesArray,
		'categories': categories,
		'tickPositioner': tickData.tickPositioner,
		'tickInterval': tickData.tickInterval
	};
};

NewChart.prototype.prepareDynamicHoursArray = function(data, dataContext, type){
	//console.log('in prepareDynamicHoursArray, context ' + dataContext)
	let validatedArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	let unknownArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	let averageArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	let finalSeries = []
	let categories = [];
	let series = [];
	//let seriesName = 'Dengun';
	let timezoneOffset = moment().utcOffset() / 60; //Use this to shift placement of hour data on x axis
	
	//Holds array of data per log object (i.e. project, user)
	let dataSeries = {};

	let validatedSeries = {
		'color': '#5ECFFF',
		'type': 'column',
		'name': 'Validated',
		'data': validatedArray
	}

	let unknownSeries = {
		'color': '#EEE',
		'type': 'column',
		'name': 'Uncertain',
		'data': unknownArray
	}

	let averageSeries = {
		'color': '#EA80FC',
		'type': 'spline',
		'name': 'Average',
		'data': averageArray
	}

	if(dataContext === 'organization'){
		averageSeries['name'] = 'Team Average'
	}
	
	//Assign hour values to array index positions
	var setIndex = this.setIndex;
	var maxValue = 0;


	var tmpArray = [];
	var tmpSum = 0;
	
	switch(dataContext){
		case 'organization':
			_.each(data, function(log, key){
				let index = setIndex(log._id, timezoneOffset)
				
				validatedArray[index] = log.validatedTime;

				unknownArray[index] = log.unknownTime;
				
				if(typeof log.avgTime !== 'undefined'){ averageArray[index] = log.avgTime; }
			});

			//Build categories array and determine max time value
			for(var i = 0; i < validatedArray.length; i++){
				if(i.toString().length > 1){ categories.push(i+':00'); }
				else{ categories.push('0'+i+':00'); }

				tmpSum = validatedArray[i] + unknownArray[i];

				if(tmpSum > maxValue){ maxValue = tmpSum; }
			}

			var tickData = this.yTickPositioner(maxValue);

			var unknownSum = unknownArray.reduce(function(acc, cur){ return acc+cur; })

			if(unknownSum > 0){
				//Set data to respective series
			    unknownSeries['data'] = unknownArray;
			    series.push(unknownSeries);
			}

			var validatedSum = validatedArray.reduce(function(acc, cur){ return acc+cur; })
			if(validatedSum > 0){
			    validatedSeries['data'] = validatedArray;
			    series.push(validatedSeries);
			}
		    

		    //Check if we want to push the avg serie
			var totalAvg=0;
			for (var i=averageArray.length; i--;) { totalAvg+=averageArray[i]; }
			if(totalAvg > 0){
			    averageSeries['data'] = averageArray;
			    series.push(averageSeries);
			}

		break;

		case 'projects':
			_.each(data, function(log, key){
				let index = setIndex(log._id.hour, timezoneOffset)
				if(log.projects.length > 0){
					_.each(log.projects, function(val, key){
						if(typeof dataSeries[val.project] === 'undefined'){
							
							let tmpArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

							tmpArray[index] = val.totalTime;
							
							dataSeries[val.project] = tmpArray;
						}
						else{
							
							let tmpArray = dataSeries[val.project];
							
							tmpArray[index] = val.totalTime;
							
							dataSeries[val.project] = tmpArray;
						}

						tmpSum += val.totalTime;

					})
				}
			});

			//Build categories array and determine max time value
			for(var i = 0; i < validatedArray.length; i++){
				if(i.toString().length > 1){ categories.push(i+':00'); }
				else{ categories.push('0'+i+':00'); }
			}

			var tickData = this.yTickPositioner(maxValue);

			//Build final series array
			var averagesArray = [];
			_.each(dataSeries, function(val, key){
				var tmpTotal = val.reduce(function(acc, cur){
					return acc + cur
				}, 0);

				if(tmpTotal > 0){
					averagesArray.push(tmpTotal);
				}
			});


			var average = 0;
			if(averagesArray.length > 0){
				var avgTotal = averagesArray.reduce(function(acc, cur){
					return acc + cur
				}, 0);
				average = avgTotal / averagesArray.length;
			}

			_.each(dataSeries, function(val, key){
				var tmpTotal = val.reduce(function(acc, cur){
					return acc + cur
				}, 0);
				//Only push if total is > 30 mins (1800 seconds)
				if(tmpTotal >= average && tmpTotal > 0){
					series.push({
						type: 'column',
						name: key,
						data: val
					});
				}
			});
		//END PROJECTS CASE
		break;

		case 'project':
			_.each(data, function(log, key){
				let index = setIndex(log._id.hour, timezoneOffset)
				if(log.users.length > 0){
					_.each(log.users, function(val, key){
						if(typeof dataSeries[val.user] === 'undefined'){
							
							let tmpArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

							tmpArray[index] = val.totalTime;
							
							dataSeries[val.user] = tmpArray;
						}
						else{
							
							let tmpArray = dataSeries[val.user];
							
							tmpArray[index] = val.totalTime;
							
							dataSeries[val.user] = tmpArray;
						}

						tmpSum += val.totalTime;

					})
				}
			});

			//Build categories array and determine max time value
			for(var i = 0; i < validatedArray.length; i++){
				if(i.toString().length > 1){ categories.push(i+':00'); }
				else{ categories.push('0'+i+':00'); }
			}

			var tickData = this.yTickPositioner(maxValue);

			//Build final series array
			var averagesArray = [];
			_.each(dataSeries, function(val, key){
				var tmpTotal = val.reduce(function(acc, cur){
					return acc + cur
				}, 0);

				if(tmpTotal > 0){
					averagesArray.push(tmpTotal);
				}
			});

			var average = 0;
			if(averagesArray.length > 0){
				var avgTotal = averagesArray.reduce(function(acc, cur){
					return acc + cur
				}, 0);
				average = avgTotal / averagesArray.length;
			}

			//console.log(average);
			//console.log(dataSeries)


			_.each(dataSeries, function(val, key){
				var tmpTotal = val.reduce(function(acc, cur){
					return acc + cur
				}, 0);
				//Only push if total is > 30 mins (1800 seconds)
				if(tmpTotal >= average){
					series.push({
						type: 'column',
						name: key,
						data: val
					});
				}
			});
		//END PROJECTS CASE
		break;

		case 'user':
			if(type !== 'spline'){
				_.each(data, function(log, key){
					let index = setIndex(log._id.hour, timezoneOffset)
					if(log.projects.length > 0){
						_.each(log.projects, function(val, key){
							if(typeof dataSeries[val.project] === 'undefined'){
								
								let tmpArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

								tmpArray[index] = val.totalTime;
								
								dataSeries[val.project] = tmpArray;
							}
							else{
								
								let tmpArray = dataSeries[val.project];
								
								tmpArray[index] = val.totalTime;
								
								dataSeries[val.project] = tmpArray;
							}

							//tmpSum += val.totalTime;
						});
					}
				});
			}
			else{
				_.each(data, function(log, key){
					let index = setIndex(log._id.hour, timezoneOffset)
					if(log.categories.length > 0){
						_.each(log.categories, function(val, key){
							if(typeof dataSeries[val.category] === 'undefined'){
								
								let tmpArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

								tmpArray[index] = val.totalTime;
								
								dataSeries[val.category] = tmpArray;
							}
							else{
								
								let tmpArray = dataSeries[val.category];
								
								tmpArray[index] = val.totalTime;
								
								dataSeries[val.category] = tmpArray;
							}

							//tmpSum += val.totalTime;
						});
					}
				});
			}

			//Build categories array and determine max time value
			for(var i = 0; i < validatedArray.length; i++){
				if(i.toString().length > 1){ categories.push(i+':00'); }
				else{ categories.push('0'+i+':00'); }
			}

			var tickData = this.yTickPositioner(maxValue);

			if(type !== 'spline'){

				var averagesArray = [];
				_.each(dataSeries, function(val, key){
					var tmpTotal = val.reduce(function(acc, cur){
						return acc + cur
					}, 0);

					if(tmpTotal > 0){
						averagesArray.push(tmpTotal);
					}
				});


				var average = 0;
				if(averagesArray.length > 0){
					var avgTotal = averagesArray.reduce(function(acc, cur){
						return acc + cur
					}, 0);
					average = avgTotal / averagesArray.length;
				}

				
				var irrelevantProjectIDs = [];
				//Build final series array
				_.each(dataSeries, function(val, key){
					var tmpTotal = val.reduce(function(acc, cur){
						return acc + cur
					}, 0);
					//Only push if total is > 30 mins (1800 seconds)
					//console.log(key, tmpTotal)
					if(tmpTotal >= average && tmpTotal > 0){
						series.push({
							type: type,
							name: key,
							data: val
						});
					}
					//Get ID of irrelevant projects
					else{
						irrelevantProjectIDs.push(key);
					}
				});
				
				//Aggregate time of 'irrelevant' projects in a 'Others' serie
				var irrelevantProjects = {};
				
				_.each(data, function(log, key){
					let index = setIndex(log._id.hour, timezoneOffset)
					if(log.projects.length > 0){
						_.each(log.projects, function(val, key){
							if(irrelevantProjectIDs.indexOf(val.project) >= 0){
								if(typeof irrelevantProjects[val.project] === 'undefined'){
									
									let tmpArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

									tmpArray[index] = val.totalTime;
									
									irrelevantProjects[val.project] = tmpArray;
								}
								else{
									
									let tmpArray = irrelevantProjects[val.project];
									
									tmpArray[index] = val.totalTime;
									
									irrelevantProjects[val.project] = tmpArray;
								}
							}
							//tmpSum += val.totalTime;
						});
					}
				});

				if(Object.keys(irrelevantProjects).length > 0){
					var irrelevantArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

					_.each(irrelevantProjects, function(val, key){
						for(var i=0; i<val.length; i++){
							irrelevantArray[i] = irrelevantArray[i] + val[i];
						}
					});

					series.unshift({
						type: type,
						name: 'Other',
						data: irrelevantArray,
						color: '#EEE'
					});
				}
			}
			else{
				_.each(dataSeries, function(val, key){
					var tmpTotal = val.reduce(function(acc, cur){
						return acc + cur
					}, 0);
					//Only push if total is > 30 mins (1800 seconds)
					//console.log(key, tmpTotal)
					if(tmpTotal > 0){
						series.push({
							type: type,
							name: key,
							data: val
						});
					}
				});
			}

		//END PROJECTS CASE
		break;

	}

	return {
		'series': series,
		'categories': categories,
		'tickPositioner': tickData.tickPositioner,
		'tickInterval': tickData.tickInterval
	}
};

NewChart.prototype.prepareDynamicDaysArray = function(data, dataContext, type, aggregated){
	let dataSeries = {};
	var dynamicPeriodArray = [];
	let validatedArray = [];
	let unknownArray = [];
	let averageArray = [];
	let totalArray = [];
	let irrelevantArray = [];

	let finalSeries = [];

	let averageSeries = {
		'color': '#EA80FC',
		'type': 'spline',
		'name': 'Average',
		'data': averageArray
	}

	let validatedSeries = {
		'color': '#5ECFFF',
		'type': 'column',
		'name': 'Validated',
		'data': validatedArray
	}

	let unknownSeries = {
		'color': '#EEE',
		'type': 'column',
		'name': 'Uncertain',
		'data': unknownArray
	}

	let categories = [];
	let maxValue = 0;

	var startDate = this.startDate;
	var endDate = this.endDate;

	var firstDay = this.firstDay;
	var lastDay = this.lastDay;

    var periodLength = lastDay - firstDay + 1;
    //console.log('firstDay: ' + firstDay + ', lastDay: ' + lastDay + ', length: ' + periodLength)

    //Build empty dymanic period & average arrays
    for(var i = 0; i < periodLength; i++){
    	dynamicPeriodArray.push(0);
    	validatedArray.push(0);
    	unknownArray.push(0);
    	averageArray.push(0);
    	totalArray.push(0);
    	irrelevantArray.push(0);
    }

    //Build empty tmpArray for each projects/users
    if(dataContext === 'projects'){
		_.each(data, function(val,key ){
			//console.log(val.objectList)
			_.each(val.objectList, function(project, key){
				if(typeof dataSeries[project] === 'undefined' && project !== '' && project !== 'null'){
					dataSeries[project] = dynamicPeriodArray;
				}
			});
		});
    }if(dataContext === 'project'){
		_.each(data, function(val,key ){
			_.each(val.users, function(obj, key){
				if(typeof dataSeries[obj.user] === 'undefined' && obj.user !== '' && obj.user !== 'null'){
					dataSeries[obj.user] = dynamicPeriodArray;
				}
			});
		});
    }
    if(dataContext === 'user'){
    	var projectsAvgTime = 0;
    	_.each(data, function(val,key ){
    		//console.log(val.objectList)
    		projectsAvgTime += val.avgTime;
    		_.each(val.objectList, function(obj, key){
    			//console.log('for ' + obj)
    			if(obj !== '' && obj !== 'null'){
					if(typeof dataSeries[obj] === 'undefined'){
						if(typeof dataSeries[obj] === 'undefined'){
							dataSeries[obj] = dynamicPeriodArray;
						}
					}
    			}
    		});
    	});

    	projectsAvgTime = projectsAvgTime / data.length;
    }

	//console.log('dataSeries')
	//console.log(dataSeries)

    //Traverse the period length to populate arrays
    //Subtract to dataIndex
    for(var i = 0, dataIndex = 0; i < periodLength; i++){
    	//console.log('run ' + i)
    	//console.log(data[dataIndex])
    	//If current data[dataIndex] is defined, means we have data for that specific day
    	if(typeof data[dataIndex] !== 'undefined'){
    		
    		switch(dataContext){

    			case 'organization':
    				var dataDay = data[dataIndex]._id.dayOfYear;

    				//console.log('organization case')
    				//console.log(firstDay + ' and ' + dataDay);
    				//console.log(firstDay >= dataDay);
    				if(firstDay >= dataDay){
						
						validatedArray.splice(i, 1, data[dataIndex].validatedTime);
						unknownArray.splice(i, 1, data[dataIndex].unknownTime);
    					averageArray.splice(i, 1, data[dataIndex].avgTime);
    					
						dataIndex+=1;
    				}
					break;

    			case 'projects':

					var dataDay = data[dataIndex]._id.dayOfYear;

					if(firstDay >= dataDay){
						//console.log('has day ' + dataDay)
						_.each(data[dataIndex].projects, function(val, key){
							//console.log(val)
							if(val.project !== '' && val.project !== 'null'){
								//Use .slice(0) to do a naive clone instead of referencing to original array
								//See: https://davidwalsh.name/javascript-clone-array
								var tmpArray = dataSeries[val.project].slice(0);
								
								tmpArray.splice(i, 1, val.validatedTime);
								
								dataSeries[val.project] = tmpArray;

							}
						});
						//averageArray.splice(i, 1, data[i].avgTime);
						dataIndex+=1;
					}
					else{
						//console.log('no existing day log on i ' + i)
						_.each(dataSeries, function(val, key){
							var tmpArray = dataSeries[key];
							tmpArray.splice(i, 1, 0);
							dataSeries[key] = tmpArray;
						});
					}

					break;

    			case 'project':

    				//console.log(moment(data[dataIndex].localDate).startOf('day').toISOString(), startDate.startOf('day').toISOString())
    				//console.log( moment(data[dataIndex].localDate).startOf('day').isSame(startDate.startOf('day')) )

    				if(moment(data[dataIndex].localDate).startOf('day').isSame(startDate.startOf('day'), 'day')){
						_.each(data[dataIndex].users, function(val, key){

							var tmpArray = dataSeries[val.user].slice(0);
							
							tmpArray.splice(i, 1, val.totalTime);

							//console.log('tmp array for ' + val.user)
							//console.log(tmpArray)
							
							dataSeries[val.user] = tmpArray;

						});
						averageArray.splice(i, 1, data[dataIndex].avgTime);
						dataIndex+=1;
    				}
					break;

    			case 'user':
					var dataDay = data[dataIndex]._id.dayOfYear;
					if(firstDay >= dataDay){
						if(type !== 'spline'){
							_.each(data[dataIndex].projects, function(val, key){
								if(typeof val.project !== 'undefined' && val.project !== '' && val.project !== 'null'){
									//Use .slice(0) to do a naive clone instead of referencing to original array
									//See: https://davidwalsh.name/javascript-clone-array
									var tmpArray = dataSeries[val.project].slice(0);
									
									tmpArray.splice(i, 1, val.totalTime);
									
									dataSeries[val.project] = tmpArray;
									/*
									if(val.totalTime >= projectsAvgTime){
									}
									else{
										var tmpArray = dataSeries[val.project].slice(0);

										tmpArray[i] = tmpArray[i] + val.totalTime;

										dataSeries['Other'] = tmpArray;
									}
									*/
								}
							});
						}
						else{
							_.each(data[dataIndex].categories, function(val, key){
								if(typeof val.category !== 'undefined' && val.category !== '' && val.category !== 'null'){
									//Use .slice(0) to do a naive clone instead of referencing to original array
									//See: https://davidwalsh.name/javascript-clone-array
									var tmpArray = dataSeries[val.category].slice(0);
									
									tmpArray.splice(i, 1, val.totalTime);
									
									dataSeries[val.category] = tmpArray;
								}
							});
						}
						//averageArray.splice(i, 1, data[i].avgTime);
						dataIndex+=1;
					}
					else{
						//console.log('no existing day log on i ' + i)
						_.each(dataSeries, function(val, key){
							var tmpArray = dataSeries[key];
							tmpArray.splice(i, 1, 0);
							dataSeries[key] = tmpArray;
						});
					}

					break;	
    		}
    	}
    	//For when there's no data for a specific day between exisiting days
    	//Ex. Monday has data, Tuesday has no data, Wednesday has data as well,.
    	else{
    		//console.log('no existing day log on i ' + i)
    		_.each(dataSeries, function(val, key){
    			var tmpArray = dataSeries[key];
    			tmpArray.splice(i, 1, 0);
    			dataSeries[key] = tmpArray;
    		});

    		averageArray.splice(i, 1, 0);
    	}

		//Push respective category
		if(aggregated){
			categories.push(startDate.format('ddd, DD MMM'));
		}
		else{
			categories.push(startDate.format('dd DD/MM'));
		}
		
		//Increment date
		startDate.add(1, 'days');

		//Increment firstDate
    	firstDay++;
    }

    //console.log('data series are')
    //console.log(dataSeries)

	// var threshold = 3600;

	// if(periodLength >= 7){
	// 	threshold = 28800;
	// }

	// var globalAvg = averageArray.reduce(function(acc, cur){
	// 	return acc + cur
	// }, 0);	

	//Build final series array

	//Build with separate series (ex. each user, each project, etc)
	if(dataContext !== 'organization'){
		if(typeof aggregated === 'undefined' || aggregated === false){


			var totalSum = 0;
			var average = 0;
			//Only push serie if total time is > 0
			var averagesArray = [];

			_.each(dataSeries, function(val, key){
				totalSum = val.reduce(function(prev, curr) { return prev + curr; });
				averagesArray.push(totalSum);
			});

			if(averagesArray.length > 0){
				var avgSum = averagesArray.reduce(function(prev, curr) { return prev + curr; });
				average = avgSum / averagesArray.length;
			}

			var irrelevantProjects = {};

			_.each(dataSeries, function(val, key){
			    //Check if we want to push the avg serie
				totalSum = val.reduce(function(prev, curr) { return prev + curr; });

				if(totalSum >= average && totalSum > 0){
					finalSeries.push({
						type: type,
						name: key,
						data: val
					});			    
				}
				//Increment 'Other' serie
				else{
					irrelevantProjects[key] = val;
				}

				if(totalSum > maxValue) maxValue = totalSum;
			});

			if(Object.keys(irrelevantProjects).length > 0){
				_.each(irrelevantProjects, function(val, key){
					for(var i=0; i<val.length; i++){
						irrelevantArray[i] = irrelevantArray[i] + val[i];
					}
				});

				finalSeries.unshift({
					type: type,
					name: 'Other',
					data: irrelevantArray,
					color: '#EEE'
				});
			}

			var tickData = this.yTickPositioner(maxValue);
		
		}
		//Build with aggregated data, a single serie object
		else{
			var a = 0;
			var teamDistribution = [];
			//Reset max value to 0 to draw Y plot line
			_.each(dataSeries, function(val, key){
				maxValue = 0;
				totalSum = val.reduce(function(prev, curr) { return prev + curr; });
				if(totalSum > 0){
					for(var i=0; i < val.length; i++){
						totalArray[i] += val[i];
						if(totalArray[i] > maxValue) maxValue = totalArray[i];
					}
				}

				//Store team data
				teamDistribution.push({
					user: key,
					totalTime: totalSum
				});

				a+=1;
			});

			finalSeries.push({
				type: type,
				name: 'Total',
				data: totalArray,
				color: '#5ECFFF',
			});
		}

	}
	else{
		unknownSeries['data'] = unknownArray;
		finalSeries.push(unknownSeries);
		
		validatedSeries['data'] = validatedArray;
		finalSeries.push(validatedSeries);
	}

	//console.log(finalSeries)

	return {
		'series': finalSeries,
		'categories': categories,
		'aggregated': aggregated,
		'maxValue': maxValue,
		'teamDistribution': teamDistribution
		//'tickPositioner': tickData.tickPositioner,
		//'tickInterval': tickData.tickInterval
	}
};

NewChart.prototype.preparePieChartData = function(data, dataContext){
	var preparedData = [];
	if(typeof data !== 'undefined' && data.length > 0){
		switch(dataContext){
			case 'organization':
				var averagesArray = [];
				var categoriesAverage = 0;

				//Get categories average first
				for(var i=0; i<data.length; i++){
					averagesArray.push(data[i].totalTime);
				};

				if(averagesArray.length > 0){
					var arraySum = averagesArray.reduce(function(acc, cur){ return acc + cur; }, 0);
					var categoriesAverage = arraySum / averagesArray.length;
				}

				//console.log('average is ' + categoriesAverage)

				for(var i=0; i<data.length; i++){
					if(data[i].totalTime >= categoriesAverage){
						//console.log('push ' + data[i].label + ' with ' + data[i].totalTime)
						preparedData.push({
							name: data[i].label,
							y: data[i].totalTime
						});
					}
				}
				break;

			case 'project':
				var seriesArray = {};
				for(var i=0; i<data.length; i++){
					_.each(data[i].users, function(obj,key){
						if(typeof seriesArray[obj.user] !== 'undefined'){
							seriesArray[obj.user] += obj.totalTime;
						}
						else{
							seriesArray[obj.user] = obj.totalTime;
						}
					});
				};

				_.each(seriesArray, function(time, user){
					preparedData.push({
						name: user,
						y: time
					});
				});
				break;

			case 'projects':
				var seriesArray = {};
				
				var averagesArray = [];
				var tmpTimeArray = {};
				//Get projects average first
				for(var i=0; i<data.length; i++){
					_.each(data[i].projects, function(obj,key){
						if(typeof tmpTimeArray[obj.project] !== 'undefined'){
							tmpTimeArray[obj.project].push(obj.totalTime);
						}
						else{
							tmpTimeArray[obj.project] = [obj.totalTime];
						}
					});
				}

				//Calculate average
				_.each(tmpTimeArray, function(values, project){
					var sum = values.reduce(function(acc, cur){
						return acc + cur
					}, 0);
					averagesArray.push(sum);
				});

				if(averagesArray.length > 0){
					var arrayLen = averagesArray.length;
					var arraySum = averagesArray.reduce(function(acc, cur){
						return acc + cur;
					}, 0);
					var projectsAverage = arraySum / arrayLen;
				}
				else{
					var projectsAverage = 0;
				}

				//Reset empty tmpTimeArray
				tmpTimeArray = {};

				for(var i=0; i<data.length; i++){
					_.each(data[i].projects, function(obj,key){
						if(typeof tmpTimeArray[obj.project] !== 'undefined'){
							tmpTimeArray[obj.project] += obj.validatedTime;
						}
						else{
							tmpTimeArray[obj.project] = obj.validatedTime;
						}
					});
				};

				//Finally, check which projects to push according to projectsAverage
				_.each(tmpTimeArray, function(time, project){
					if(time >= projectsAverage && time > 0){
						preparedData.push({
							name: project,
							y: time
						});
					}
				});
				break;

			case 'user':
				var seriesArray = {};
				var averagesArray = [];

				var otherSeries = {
					'name': 'Other',
					'color': '#EEE',
					'y': 0
				}

				_.each(data, function(obj, key){
					averagesArray.push(obj.totalTime);
					if(typeof seriesArray[obj.label] !== 'undefined'){
						seriesArray[obj.label] += obj.totalTime;
					}
					else{
						seriesArray[obj.label] = obj.totalTime;
					}
				});

				if(averagesArray.length > 0){
					var arraySum = averagesArray.reduce(function(acc, cur){ return acc + cur; }, 0);
					var categoriesAverage = arraySum / averagesArray.length;
				}

				//Calculate a margin from the average to also consider
				//projects that are not too far from the average
				var margin = categoriesAverage * 0.3;

				_.each(seriesArray, function(time, label){

					if((time + margin) >= categoriesAverage){
						preparedData.push({
							name: label,
							y: time
						});
					}
					else{
						otherSeries['y'] += time;
					}
				});

				if(otherSeries['y'] > 0){
					preparedData.push(otherSeries);
				}

				break;

		}

		//Return sorted
		return preparedData.sort(function(a, b){ return b.y - a.y; });
	}
	else{
		return preparedData;
	}

	

}

NewChart.prototype.exportBarsChart = function(){
	let data = this.data;
	let el = this.el;
	let dataContext = this.dataContext
	let detail = this.detail;
	let range = this.range;
	let chartColors = this.chartColors;

	//console.log('##### EXPORT #####')

	if(range === 'day'){
		switch(dataContext){
			case 'organization':
				//console.log('prepare realtime/day data for organization')
				var preparedData = this.prepareDynamicHoursArray(data, 'organization', 'areaspline');
				break;
			case 'projects':
				//console.log('prepare realtime/day data for projects')
				var preparedData = this.prepareDynamicHoursArray(data, 'projects', 'areaspline');
				break;
			case 'project':
				//console.log('prepare realtime/day data single project')
				var preparedData = this.prepareDynamicHoursArray(data, 'project', 'areaspline');
				break;
			case 'user':
				//console.log('prepare realtime/day data single user')
				var preparedData = this.prepareDynamicHoursArray(data, 'user', 'areaspline');
				break;
		}
	}
	else{
		switch(dataContext){
			case 'organization':
				//console.log('prepare range data organization')
				var preparedData = this.prepareDynamicDaysArray(data, 'organization', 'areaspline');
				break;
			case 'projects':
				//console.log('prepare range data projects')
				var preparedData = this.prepareDynamicDaysArray(data, 'projects', 'areaspline');	
				break;
			case 'project':
				//console.log('prepare range data project')
				var preparedData = this.prepareDynamicDaysArray(data, 'project', 'areaspline');
				break;
			case 'user':
				//console.log('prepare range data single user')
				var preparedData = this.prepareDynamicDaysArray(data, 'user', 'areaspline');
				break;
		}
	}


	if(preparedData.series.length > 0){
		var chartOptions = {
			title: '',
		    xAxis: {
		        categories: preparedData.categories,
	        	title: {
	    			text: '' //Accumulated Time
	    		},
	    		labels:{ enabled: false },
	    		lineWidth: 0,
	    		minorGridLineWidth: 0,
	    		minorTickLength: 0,
	    		tickLength: 0,
		    },
		    yAxis:{
		    	title: {
					text: '' //Accumulated Time
				},
				labels: {
		        	enabled: false,
		        	formatter: function(){ return this.value*1000+'hrs' },
		        	// formatter: function () {
		        	// 	var d=new Date(this.value*1000);var days=d.getDate()-1;var hours=d.getHours();var minutes=d.getMinutes();if(days>0){var dayToHours=days*24;hours+=dayToHours;}return hours+'h'+minutes+'m';
		        	// },
		      	},
		      	lineWidth: 0,
		      	minorGridLineWidth: 0,
		      	minorTickLength: 0,
		      	tickLength: 0,
		      	stackLabels: { enabled: false, },
		  //     	plotLines: [{
				// 	value: preparedData.maxValue,
				// 	color: '#EEE',
				// 	//className: 'maxValueLine',
				// 	dashStyle: 'line',
				// 	width: 1,
				// 	label: {
				// 		text: 'Max ' + getStringFromEpoch(preparedData.maxValue, true) + ' / day',
				// 		x: 25,
				// 		y: -5
				// 	}
				// }],
		    },
			credits: { enabled: false },
			legend:{
		    	enabled: false,
		    },
		    plotOptions: {
		    	// areaspline: {
		    	// 	stacking: 'normal',
		    	// },
				series: {
					marker: {
						enabled: false,
						states: {
							hover: {
								enabled: false
							}
						}
					},
				}
		    },
		    series: preparedData.series,
		}

		return chartOptions;
	}

}


NewChart.prototype.yTickPositioner = function(maxValue){
	//console.log('max is ' + maxValue)
	var epochHour = 3600;
	var tickInterval = 3600;
	var cumulator = 0;
	
	var ticks = Math.round(maxValue / epochHour);
	
	var tickPositioner = [];

	//console.log('# ticks ' + ticks)

	for(var i = 0; i < ticks; i++){
		tickPositioner.push(cumulator);
		cumulator += epochHour;
	}

	if(tickPositioner.length > 8){
		tickInterval = 7200;
	}

	return {
		'tickPositioner':tickPositioner,
		'tickInterval': tickInterval
	};
};

NewChart.prototype.setIndex = function(hour, offset){
    var index = parseInt(hour) + offset;
    //console.log(parseInt(hour), offset, index);
    if(index >= 24){
        index = index - 24;
    }
    if(index < 0){
        index = 24 + index;
    }
    return index;
};