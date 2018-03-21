scheduledJobs = [
	//A Job that runs every hour and performs multiple tasks
	{
		name: 'HOUR JOB',
		schedule: function(parser){
			return parser.recur().first().minute().first().second();
			//return parser.recur().every(15).second();
		},
		job: function(){
			var r = hourlyJob();
			return r;
		}
	},
	{
		name: 'PROJECT TOTALS',
		schedule: function(parser){
			return parser.recur().first().minute().first().second();
			//return parser.recur().every(1).minute();
		},
		job: function(){
			var r = projectTotalJob();
			return r;
		}
	},
];