Template.earningsCalculator.onRendered(function(){

	estimateEarnings();

});

Template.earningsCalculator.events({
	'input #numberOfUsers': function(e){
		estimateEarnings();
	},
	'input #hourlyRate': function(e){
		estimateEarnings();
	},
	'input #nonAccountedPercentage': function(e){
		estimateEarnings();
	},
})

estimateEarnings = function(){

	var numberOfUsers = $('#numberOfUsers')[0].valueAsNumber;
	var hourlyRate = $('#hourlyRate')[0].valueAsNumber;
	var nonAccountedPercentage = $('#nonAccountedPercentage')[0].valueAsNumber / 100;

	console.log(numberOfUsers)
	console.log(hourlyRate)
	console.log(nonAccountedPercentage)

	let dailyWorkingHours = 8;
	let yearlyBusinessDays = 250;


	var totalHours = numberOfUsers * dailyWorkingHours; //Users times working hours
	
	var dailyEarning = totalHours * hourlyRate;
	var yearlyEarning = dailyEarning * yearlyBusinessDays;

	var dailyLostRate = Math.round(dailyEarning * nonAccountedPercentage);
	var yearlyLostRate = Math.round(yearlyEarning * nonAccountedPercentage);

	var dailyEl = '<h4 class="text-center">$'+ prettyCount(dailyLostRate) +'/day</h4>';
	var yearlyEl = '<h6 class="text-center text-muted">$'+ prettyCount(yearlyLostRate) + '/year<br></h6>'

	var el = '<div class="pt-2 px-3">'+dailyEl+yearlyEl+'</div>';

	$('#earningsEstimates').html(el);

	


}