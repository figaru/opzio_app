Meteor.startup(function(){
	if(process.env.NODE_ENV === 'development'){
		process.env.WORKER_URL = Meteor.settings.public.worker_url.dev;
	}
	else{
		process.env.WORKER_URL = Meteor.settings.public.worker_url.prod;
	}

	//#######################
	//	REMOTE WORKER CONNECTION
	//#######################
	apiWorker = DDP.connect(process.env.WORKER_URL);
})