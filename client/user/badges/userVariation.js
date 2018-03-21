refreshUserVariation = function(chart, el){
	//console.log('Refresh le activity gauge (organization)')
	var dateRange = Session.get('dateRange');
	var metric = el.parent().find('.metric');
	var description = el.parent().find('.description');
	var userId = Router.current().params.userId;
	var user = Meteor.users.findOne({_id: userId }, { reactive:false });

	var callData = {
		'startDate': dateRange.startDate,
		'userId': userId,
		'user': user,
		'endDate': dateRange.endDate,
		'range': dateRange.range,
		'offset': moment().utcOffset() / 60,
	}

	//Check for time period
	//Present
	var period = 'present';
	if(moment().endOf('day').toISOString() === dateRange.endDate){
		period = 'present';
	}
	//Future
	else if(moment().isBefore(dateRange.endDate, 'day')){
		period = 'future';
	}
	//Past
	else{
		period = 'past';
	}

	var grey = '#EFEFEF';
	var green = '#4DB6B2';
	var red = '#EF9A9A';
	//Icons
	var icons = [
	  'f056', //Minus - "neutral"
	  'f139', //Up
	  'f13a' //Down
	]

	el.parent().find('.loader-overlay').remove();
	el.parent().prepend('<div class="loader-overlay boxed stats"><div class="chart-loader"></div>');

	Meteor.call('users.getUserVariation', callData, function(err, data){

		//console.log('for ' + period + ' period');

		//Default gauge data
		var gaugeData = {
			'percent': 0,
			'targetpercent': 0,
			'icon': icons[0],
			'iconColor': grey
		}

		var metricValue = 'N/A';
		var descriptionValue = '';

		
		if(!err){
			//Both current and previous periods are available
			if(data.length === 2){
				//console.log('has both')
				var currentTotal = data[0].validatedTime;
				var prevTotal = data[1].validatedTime;

				//console.log('currentTotal ' + currentTotal)
				//console.log('prevTotal ' + prevTotal)

				if(currentTotal > 0 && prevTotal > 0){
					var variation = (currentTotal * 100 / prevTotal) - 100;
					//Check variation direction
					var direction = variation > 0 ? 1 : variation == 0 ? 0 : -1;

					//POSITIVE direction
					if(direction > 0){

						//console.log('positive variation: ' + variation);

						gaugeData['percent'] = 100;
						gaugeData['targetpercent'] = Math.round(variation * 100) / 100;

						gaugeData['icon'] = icons[1];
						gaugeData['iconColor'] = green;

						metricValue = '+'+prettyCount(Math.round(variation * 10) / 10) + '%';

						//Display message depending if variation is for current day or not
						if(variation < 50){
							descriptionValue = 'Previous activity time surpassed! <i class="twa twa-tada anim-shake"></i>'
						}
						else{
							if(variation >= 50 && variation < 90){
								var randomQuotes = [
									'Over +50% activity than the previous period.',
									'+50% activity registered than previous period.',
								];
								
								descriptionValue = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
							}
							else if(variation >= 90 && variation < 100){
								descriptionValue = 'Almost reached double than previous period.';
							}
							else if(variation >= 100 && variation < 200){
								descriptionValue = 'Reached more than double from previous period!';
							}
							else{
								
								var randomQuotes = [
									'Huge increase from previous period! <i class="twa twa-tada anim-shake"></i>',
									'Skyrocket variation from previous period! <i class="twa twa-rocket anim-shake"></i>',
								];

								descriptionValue = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
							}
						}

					}
					//NEGATIVE direction
					else if(direction < 0){
						gaugeData['percent'] = 100 - Math.abs(Math.round(variation * 100) / 100);

						gaugeData['icon'] = icons[2];
						gaugeData['iconColor'] = red;

						variation = Math.round(variation * 10) / 10;

						metricValue = prettyCount(variation) + '%';
						
						//console.log('negative variation: ' + variation);


						
						if(variation >= -50){
							if(variation >= -50 && variation < -20){
								var randomQuotes = [
									'Less than half to meet your previous activity! <i class="twa twa-clap"></i>',
									'Less than half to reach your previous activity!',
									
								];

								descriptionValue = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
							}
							else{
								switch(period){
									case 'present':
										var randomQuotes = [
											'Just a tad to reach positive! <i class="twa twa-point-up"></i>',
											'Not much missing to reach positive!',
											'Not much missing to reach positive!',
											'Almost reaching your previous activity! <i class="twa twa-clap anim-shake"></i>'
										];
										if(userId === Meteor.userId()){
											randomQuotes.push('You\'re almost reaching postivie! <i class="twa twa-point-up"></i>');
										}
										break;

									case 'past':
										var randomQuotes = [
											'Missed to reach positive by a driblet! <i class="twa twa-point-up"></i>',
											'Missed to reach positive by a driblet! ',
											'Almost reached previous activity! <i class="twa twa-clap anim-shake"></i>',
											'Previous activity almost reached.'
										];
										if(userId === Meteor.userId()){
											randomQuotes.push('You almost reached postivie!');
										}
										break;
								}
								
								descriptionValue = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
							}
						}
						else if(variation === -100){

						}
						else{

							switch(period){
								case 'present':
									descriptionValue = 'Still some work to go to reach previous activity! <i class="twa twa-clap"></i>'
									break;

								case 'past':
									if(variation < 50 && variation > 40){
										descriptionValue = 'You almost reached half of your previous activity.'
									}
									else if(variation <= 40 && variation > 20){
										var randomQuotes = [
											'Not much activity registered. <i class="twa twa-zzz"></i>',
											'Not much activity registered. Nothing much happened.',
											'Nothing much happened.',
											'No significant activity registered.',
											'Nothing much happened. <i class="twa twa-zzz"></i>',
										];
										
										descriptionValue = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
									}
									else if(variation <= 20){
										var randomQuotes = [
											'Nothing much happened.',
											'Basically nothing happened. <i class="twa twa-zzz"></i>',
											'No significant activity registered.',
											'Basically nothing happened.',
										];
										
										descriptionValue = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
									}
									break;
							}
						}

					}
					//NEUTRAL direction
					else{
						//console.log('neutral variation: ' + variation);
						gaugeData['icon'] = icons[0];
						gaugeData['iconColor'] = grey;
						metricValue = '0%';
					}
				}
				else if(currentTotal === 0 && prevTotal > 0){
					var randomQuotes = [
						'No validated data found to calculate variation.',
						'No validated time for given period.',
					];

					if(userId === Meteor.userId()){
						randomQuotes.push('Maybe you need to validate time?');
						randomQuotes.push('You may need to validate your logs?');
					}
					
					descriptionValue = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
				}
				else{
					descriptionValue = 'No data found to calculate variation';
				}

			}
			//Only one of the periods is available
			else if(data.length === 1){
				if(data[0]._id === 'previous'){
					//console.log('do prev variation')
					//console.log('variation ' + variation)

					gaugeData['percent'] = 0;
					gaugeData['targetpercent'] = 0;

					gaugeData['icon'] = icons[2];
					gaugeData['iconColor'] = red;

					metricValue = '-100%';
					switch(period){
						case 'present':
							if(userId === Meteor.userId()){
								descriptionValue = 'Seems you haven\'t logged anything yet today. <i class="twa twa-zzz"></i>'
							}
							else{
								descriptionValue = 'No activity yet for today. <i class="twa twa-zzz"></i>'
							}
							break;

						case 'past':
							if(userId === Meteor.userId()){
								descriptionValue = 'Seems you didn\'t work on this day. <i class="twa twa-zzz"></i>'
							}
							else{
								descriptionValue = 'No activity logged on this day. <i class="twa twa-zzz"></i>'
							}
							break;

						case 'future':
							var randomQuotes = [
								'We\'re in the future! <i class="twa twa-crystal-ball"></i> No activity yet.',
								'No activity yet.',
								'No activity found in the future! <i class="twa twa-crystal-ball"></i>',
							];
							if(userId === Meteor.userId()){
								randomQuotes.push('You\'re viewing the future! No activity yet.');
							}
							
							descriptionValue = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
							break;
					}
				}
				else{
					//console.log('do current variation')

					var currentTotal = data[0].validatedTime;
					var variation = Math.round(currentTotal * 100) / 10;
					

					gaugeData['percent'] = variation;
					gaugeData['targetpercent'] = 0;

					gaugeData['icon'] = icons[1];
					gaugeData['iconColor'] = green;

					variation = variation / 100;

					//console.log('currentTotal ' + currentTotal)
					//console.log('variation ' + variation);

					if(variation === 0){
						//metricValue = prettyCount(variation)+'%';
						gaugeData['iconColor'] = grey;

						var randomQuotes = [
							'No validated data found to calculate variation.',
							'No validated time for given period.',
						];

						if(userId === Meteor.userId()){
							randomQuotes.push('Maybe you need to validate time?');
							randomQuotes.push('You may need to validate your logs?');
						}
						
						descriptionValue = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];

					}
					else if(variation < 50){
						metricValue = '+'+prettyCount(variation)+'%';
						
						descriptionValue = 'Previous activity time surpassed! <i class="twa twa-tada anim-shake"></i>'
					}
					else{
						metricValue = '+'+prettyCount(variation)+'%';

						if(variation >= 50 && variation < 90){
							var randomQuotes = [
								'Over +50% activity than the previous period.',
								'+50% activity registered than previous period.',
							];
							
							descriptionValue = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
						}
						else if(variation >= 90 && variation < 100){
							descriptionValue = 'Almost reached double than previous period.';
						}
						else if(variation >= 100 && variation < 200){
							descriptionValue = 'Reached more than double from previous period!';
						}
						else{
							
							var randomQuotes = [
								'Huge increase from previous period! <i class="twa twa-tada anim-shake"></i>',
								'Skyrocket variation from previous period! <i class="twa twa-rocket anim-shake"></i>',
							];

							descriptionValue = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
						}
					}

				}
			}
			else{

				if(period === 'future'){
					var randomQuotes = [
						'We\'re in the future! <i class="twa twa-crystal-ball"></i> No activity yet.',
						'No activity yet.',
						'No activity found in the future! <i class="twa twa-crystal-ball"></i>',
					];
					if(userId === Meteor.userId()){
						randomQuotes.push('You\'re viewing the future! No activity yet.');
					}
					
					descriptionValue = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
				}
				else{
					gaugeData['iconColor'] = grey;

					var randomQuotes = [
						'No data to calculate variation.',
						'No data found to calculate variation.',
						'No activity found to calculate variation.',
						'There\'s no data to calculate the variation.',
					];
					
					descriptionValue = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
				}

			}
		}
		
		//Redraw chart;
		metric.html(metricValue);
		description.html(descriptionValue);
		el.html('');
		chart.redraw(gaugeData);

		el.parent().find('.loader-overlay').remove();
	});
}

Template.userVariation.onRendered(function(){
	//console.log('render userVariation')
	var el = Template.instance().$('.chart');

	var data = {
		'percent': 0,
		'targetpercent': 0,
		'iconColor': '#EFEFEF'
	}

	var options = {
		'el': el,
		'useIcon': true,
		'icon': 'f056',
	}

	var chart = new NewGauge(data, options);

	this.userVariation = Meteor.setInterval(function(){
		refreshUserVariation(chart, el);
	}, 60 * 1000);

	
	this.autorun(function(c) {
		var dateRange = Session.get('dateRange');

		refreshUserVariation(chart, el);		
	});
	
});


Template.userVariation.onDestroyed(function(){
	Meteor.clearInterval(this.userVariation)
});