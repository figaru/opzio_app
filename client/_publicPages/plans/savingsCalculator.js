Template.savingsCalculator.onRendered(function(){
	
	

	$('#numberOfUsers').on('input', function(e){
		if(this.valueAsNumber >= 1){
			estimatePlanCost();
		}
	});

	//Change session variable when changing the switch
	$('#billingCycle').on('change', function(e){
		if(this.checked){
			Session.set('billingCycle', 'annual');
		}
		else{
			Session.set('billingCycle', 'monthly');
		}
		estimatePlanCost();
	});

	estimatePlanCost();

});

Template.savingsCalculator.helpers({
	'isAnnnual': function(){
		let cycle = Session.get('billingCycle');
		if(cycle === 'annual'){
			return 'checked';
		}
	},
});

estimatePlanCost = function(){
	let prices = {
		'lite': 16.99,
		'medium': 14.99,
		'large': 12.99,
	}
	var monthlyPrice = prices['lite'];
	var planType = 'Lite Plan';
	var enterprise = false;
	var price = 0;

	let users = $('#numberOfUsers')[0].valueAsNumber;
	var cycle = Session.get('billingCycle');

	if(users >= 1 && users <= 15){
		price = Math.round(prices['lite'] * users * 100) / 100;
	}
	else if(users > 15 && users <= 50){
		price = Math.round(prices['medium'] * users * 100) / 100;
		monthlyPrice = prices['medium'];
		planType = 'Medium Plan';
	}
	else if(users > 50 && users <= 100){
		price = Math.round(prices['large'] * users * 100) / 100;
		monthlyPrice = prices['large'];
		planType = 'Large Plan';
	}
	else if(users > 100){
		planType = 'Enterprise Plan';
		enterprise = true;
	}

	var yearly = Math.round(12 * price * 100) / 100;
	var savings = price * 2;

	var savingsPercent = Math.round(savings / yearly * 100 * 100) / 100;

	price = Math.round((yearly - savings) * 100) / 100;

	if(cycle === 'annual'){
		var saveEl = '<h4 class="text-center">Save $'+ savings +'/year</h4>';
		var priceEl = '<h6 class="text-center text-muted">$'+price + '/year<br>(from $'+ yearly +', '+ savingsPercent+'% savings)</h6>'
		cycle = 'year';
	}
	else{
		var saveEl = '<h4 class="text-center text-gray">Save $'+ savings +'/year</h4>';
		var priceEl = '<h6 class="text-center text-muted">$'+yearly + '/year<br>($'+price +' if billed annually)</h6>';
		cycle = 'month';
	}

	if(enterprise){
		var el = '<div class="pt-2 px-3">\
			<h3 class="text-center">'+ planType +'</h3>\
			<h4 class="text-center text-gray">Please get in touch for teams over 100 users</h4>\
		</div>';
	}
	else{
		var el = '<div class="pt-2 px-3">\
			<h3 class="text-center font-weight-light">'+ planType +'</h3>' + saveEl + priceEl + '</div>';
		//($'+yearly+' / '+ cycle+')
	}
	$('#planEstimates').html(el);

	


}