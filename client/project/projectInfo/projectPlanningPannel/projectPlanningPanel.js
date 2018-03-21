Template.projectPlanningPanel.events({
	//Prevent editin inputs (as they are text and not date type)
	'keypress #startDate': function(e){
	    e.preventDefault();
	},
	'keypress #endDate': function(e){
	    e.preventDefault();
	},

	/*********
	    Planed time
	*********/
	'focus #projectPlannedTime': function(e){
	    e.currentTarget.setAttribute('data-content', Template.currentData().project.plannedTime);
	},
	'blur #projectPlannedTime': function(e){
	    if(e.target.value !== ''){ var newData = e.target.value; }
	    else{
	        var newData = 0;
	        e.currentTarget.value = 0;
	    }

	    var project = Template.currentData().project;

	    //Convert input to total hours (planned time is saved in hours)
	    var hours = parseStringToHours(newData);


	    if(e.currentTarget.getAttribute('data-content') != hours){
	        console.log('---CHANGE DATA--')
	        console.log('new hours: ' + hours)
	        //Check when is the possible end date (depending on estimation)
	        estimateEndDateAndUpdateProject(project, hours);
	    };

	},
})