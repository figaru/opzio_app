//APP
import { Meteor } from 'meteor/meteor';
import stripe from 'stripe';

Meteor.startup(function(){
	//Startup message
	console.log('***');
	console.log('*** APP: STARTUP @ '+ moment().utc().toISOString() +' *****');

	//#######################
	//	EMAIL URL
	//#######################
	process.env.MAIL_URL = 'smtp://postmaster@opz.io:438e639ed0a29cee91827302126d58e2@smtp.mailgun.org:587';

	switch(process.env.NODE_ENV){
		case 'development':
			console.log('*** ENV: DEVELOPMENT');
			var stripeSecretKey = Meteor.settings.stripe.live_secret_key
			break;
		case 'production':
			console.log('*** ENV: PRODUCTION');
			var backendUrl = process.env.REMOTE_APP;
			process.env.ROOT_URL = Meteor.settings.root_url;
			var stripeSecretKey = Meteor.settings.stripe.test_secret_key
			break;
		default:
			console.log('***WAR: unknown enviroment!');
			break;
		
	};
	
	var db_url = process.env.MONGO_URL.split(':');
	
	console.log('*** DB:  ' + db_url[db_url.length -1 ]);

	//#######################
	//	STRIPE CONFIG
	//stripe = require('stripe')(stripeSecretKey);
	stripe.api_key = stripeSecretKey;


	//#######################
	//	INITIAL FIXTURES
	//#######################
	//dbFixtures();
	//plansFixtures();

	//#######################
	//	INIT CRON JOBS
	//#######################
	Meteor.setTimeout(function(){
		initCrons();
		console.log('*** SYS: A-OK!');
	}, 5000)

	
});