getProjectFromID = function(projectID){
    var project = Projects.findOne({_id: projectID });
    if(typeof(project) !== 'undefined'){
        if(project.type === 'personal'){
            return 'Personal';
        }
        else{
            if(typeof project.name !== 'undefined'){
                return project.name;
            }
            else{
                return project.gitName;
            }
        }
    }
    else{
        return 'Other';
        //return projectID; //Use this to return OTHERS when project is private or is under X totalTime
    }
};

getProjectNameRWD = function(projectName){
    var deviceWidth = Session.get('deviceWidth');
    if(deviceWidth > 400){
        return capitalizeFirstLetter(projectName);
    }
    else if(deviceWidth <= 420){
        projectName = capitalizeFirstLetter(projectName);
        return truncString(projectName, 10) + '..';
    }
    else{
        projectName = capitalizeFirstLetter(projectName);
        return truncString(projectName, 4) + '..';
    }
}

getProjectDate = function(date){
    var offset = moment().utcOffset() / 60;
    return formatDate(moment(date).add(offset,'hours'), 'DD/MM/YYYY');
}

hasCreatedProjects = function(){
    var projects = Projects.find({
        type: {
            $nin: ['personal', 'unknown']
        }
    }).fetch();

    if(projects.length > 0){
        return true;
    }
    else{
        return false;
    }
}

//Checks whether the planned time changes the end date of the project 
estimateEndDateAndUpdateProject = function(project, hours){

    var newDateRange = estimatedNewEndDate(hours, project);
    var newEndDate = newDateRange.newEndDate;

    //Set some toast options (wait for user action and act accordingly)
    toastr.options.timeOut = 0;
    toastr.options.extendedTimeOut = 0;
    toastr.options.tapToDismiss = false;

    var projectEndDate = moment(project.endDate);

    //project date is before newEndDate
    if(newDateRange.isBefore){
        var body = '<div>'
                    +'<p>The estimated end date <b>' + newEndDate.endOf('day').format("DD-MM-YYYY") + '</b> '
                    +'is ' +projectEndDate.to(newEndDate, true) +' ahead of your current end date (' + projectEndDate.format("DD-MM-YYYY") + ')'
                    +'<br>Do you wish to change to the estimated end date?</p>'
                    +'<button type="button" class="btn clear">Cancel</button>'
                    +'<button type="button" id="okBtn" class="btn btn-primary pull-right">Yes</button></div>';

        var toast = toastr.warning(body, 'Change end date?');
    }

    
    //project date is after newEndDate
    if(newDateRange.isAfter){
        var body = '<div>'
                    +'<p>The estimated end date <b>' + newEndDate.format("DD-MM-YYYY") + '</b> '
                    +'is ' +projectEndDate.from(newEndDate, true) +' behind your current end date (' + projectEndDate.format("DD-MM-YYYY") + ')'
                    +'<br>Do you wish to change to the estimated end date?</p>'
                    +'<button type="button" class="btn clear">Cancel</button>'
                    +'<button type="button" id="okBtn" class="btn btn-primary pull-right">Yes</button></div>';

        var toast = toastr.warning(body, 'Change end date?');
    }

    resetToastrOptions();

    //Finally, wait for user input before calling update method
    if(typeof toast !== 'undefined'){

        if (toast.find('#okBtn').length) {
            toast.delegate('#okBtn', 'click', function () {
                console.log(project._id, hours, newEndDate.toDate())
                updateProjectPlannedTime(project._id, hours, newEndDate.toDate())
                toast.remove();

            });
        }

        if (toast.find('.clear').length) {
            toast.delegate('.clear', 'click', function () {
                toast.remove();
                //toastr.clear(toast, { force: true });
            });
        }
    }
}

updateProject = function(projectId, updateData){
    Meteor.call('updateProject', projectId, updateData, function(err, data){
        if(!err){
            toastr.success('Updated project.');
        }
        else{
            toastr.error('Error updating project.');
        }
    });
}

updateProjectPlannedTime = function(projectId, hours, newEndDate){
    //console.log('SAVE THESE HOURS: ' + hours)
    Meteor.call('savePlannedTime', projectId, hours, newEndDate, function(err){
        if(!err){
            toastr.success('Planned time saved.');
        }
        else{
            toastr.error('Error saving planned time.');
        }
    });
}