Meteor.methods({
	'sendRegisterEmail': function(email){
		
		var body = buildAnnouncementEmail();
		
		try{
			Meteor.defer(function(){
				Email.send({
					to: email,
					from: 'info@opz.io',
					subject: 'Opz.io is now live',
					html: body
				});
			
			});
			console.log('*** EMAIL: sent register to ' + email)
		}
		catch(err){
			console.log('*** ERR: error sending email report to ' + email)
		}
	},
	'emails.sendReport': function(email, title, projects, secondaryData, dateString, link, total){
	
		if(total > 0){
			var body = buildReportEmail(title, projects, secondaryData, dateString, link, getStringFromEpoch(total));
		}
		else{
			var body = buildEmptyReportEmail(title, projects, secondaryData, dateString, link, total);
		}

		try{
			Meteor.defer(function(){
				Email.send({
					to: email,
					from: 'info@opz.io',
					subject: '📈  '+title + ' - Opz.io',
					html: body
				});
			
			});
			console.log('*** EMAIL: sent report to ' + email)
		}
		catch(err){
			console.log('*** ERR: error sending email report to ' + email)
		}
	},
})