Template.goalRow.events({
	'click .goalPeriod': function(e, t){
		var el = $(e.currentTarget);
		var tr = el.closest('.goalRow');
		
		var chosenPeriod = el.attr('data-period');
		var currentPeriod = el.closest('.periodDropdown').attr('data-currentvalue');
		
		if(chosenPeriod !== currentPeriod){
			console.log('dif period ' + chosenPeriod)
			tr.attr('data-newperiod', chosenPeriod);
			tr.attr('data-changed', true);
			el.closest('.periodDropdown').find('.dropdown-text').text(capitalizeFirstLetter(el.attr('data-period')));

			$('#saveGoals').removeClass('hidden').addClass('anim-shake');
		}
		else{
			console.log('same period')
			tr.removeAttr('data-newperiod', chosenPeriod);
			tr.removeAttr('data-changed');
			var ogPeriod = el.closest('.periodDropdown').attr('data-currentvalue');
			el.closest('.periodDropdown').find('.dropdown-text').text(capitalizeFirstLetter(ogPeriod));

			$('#saveGoals').addClass('hidden').removeClass('anim-shake');
		}
	},
	'change .goalValue': function(e, t){
		var el = $(e.currentTarget);
		var tr = el.closest('.goalRow');
		
		var chosenValue = el.val();
		var currentValue = el.attr('data-currentvalue');

		if(chosenValue !== currentValue){
			console.log('dif value')
			tr.attr('data-newvalue', chosenValue);
			tr.attr('data-changed', true);

			$('#saveGoals').removeClass('hidden').addClass('anim-shake');
		}
		else{
			console.log('same value')
			tr.removeAttr('data-newvalue');
			tr.removeAttr('data-changed');

			$('#saveGoals').addClass('hidden').removeClass('anim-shake');
		}
	},
});

Template.goalRow.helpers({
	'displayGoalType': function(goalType){
		return capitalizeFirstLetter(goalType);
	},
	'goalPeriodDropdownAndValue': function(project, goalType){
		if(goalType === 'time'){
			var goal = _.find(project.goals, function(goal) {
				return goal.type === 'time'
			});

			switch(goal.period){
				case 'daily':
					var value = goal.dailyValue;
					break;
				case 'weekly':
					var value = goal.weeklyValue;
					break;
				case 'monthly':
					var value = goal.monthlyValue;
					break;
			}

			var dropdown = '<div class="dropdown periodDropdown" data-currentvalue="'+goal.period+'">\
				<button class="btn btn-secondary dropdown-toggle" type="button" id="timeGoalMetricOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
			    <span class="dropdown-text">'+ capitalizeFirstLetter(goal.period) +'</span>\
			    </button>\
				<div class="dropdown-menu" aria-labelledby="timeGoalMetricOption">\
					<a class="dropdown-item goalPeriod" data-period="daily" href="#">Daily</a>\
				    <a class="dropdown-item goalPeriod" data-period="weekly" href="#">Weekly</a>\
				    <a class="dropdown-item goalPeriod" data-period="monthly" href="#">Monthly</a>\
				</div>\
			</div>';

			var input = '<div class="form-group">\
							<label class="control-label" for="timeGoalValue">Value (Hours)</label>\
							<input class="form-control mt-2 goalValue" type="number" placeholder="Hours to meet" id="timeGoalValue" data-currentvalue="'+ value +'" value="'+ value +'">\
						</div>';
		}
		if(goalType === 'financial'){
			var goal = _.find(project.goals, function(goal) {
				return goal.type === 'financial'
			});

			switch(goal.period){
				case 'daily':
					var value = goal.dailyValue;
					break;
				case 'weekly':
					var value = goal.weeklyValue;
					break;
				case 'monthly':
					var value = goal.monthlyValue;
					break;
			}

			var dropdown = '<div class="dropdown periodDropdown" data-currentvalue="'+goal.period+'">\
				<button class="btn btn-secondary dropdown-toggle" type="button" id="financialGoalMetricOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
			    <span class="dropdown-text">'+ capitalizeFirstLetter(goal.period) +'</span>\
			    </button>\
				<div class="dropdown-menu" aria-labelledby="financialGoalMetricOption">\
					<a class="dropdown-item goalPeriod" data-period="daily" href="#">Daily</a>\
				    <a class="dropdown-item goalPeriod" data-period="weekly" href="#">Weekly</a>\
				    <a class="dropdown-item goalPeriod" data-period="monthly" href="#">Monthly</a>\
				</div>\
			</div>';

			var input = '<div class="form-group">\
							<label class="control-label" for="financialGoalValue">Value (€)</label>\
							<input class="form-control mt-2 goalValue" type="number" placeholder="Financial value to meet" id="financialGoalValue" data-currentvalue="'+ value +'" value="'+ value +'">\
						</div>';
		}

		return '<td>\
				<div class="form-group mb-0 mt-2 mw-30">\
					'+ dropdown +'\
				</div>\
			</td>\
			<td>\
				'+ input +'\
			</td>';
	},
})