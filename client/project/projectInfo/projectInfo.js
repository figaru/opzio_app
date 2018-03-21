import { Tracker } from 'meteor/tracker';

Template.projectInfo.onRendered(function(){

    initTooltips();
    
    initMasonry();

    var project = Projects.findOne({_id: Router.current().params.projectId });

    //Use tracker to re-init datepickers if Project changes
    this.autorun(function (c) {
        //console.log('run tracker');
        var tmpProject = Session.get('currentProject');
        project = Projects.findOne({_id: Router.current().params.projectId });
    });

    //Init datepickers
    var startDatepicker = $('#projectStartDate').datepicker({
        format: 'dd/mm/yyyy',
        todayHighlight: true,
        weekStart: 1,
        daysOfWeekHighlighted: [0,6],
    });
    var endDatepicker = $('#projectEndDate').datepicker({
        format: 'dd/mm/yyyy',
        todayHighlight: true,
        weekStart: 1,
        daysOfWeekHighlighted: [0,6]
    });

    if(typeof project.createDate !== null){
        startDatepicker.datepicker('setDate', project.createDate);
    }

    if(typeof project.deliveryDate !== null){
        endDatepicker.datepicker('setDate', project.deliveryDate);
    }

    //When changing startDate value, set it as the minimum start date for endDate
    startDatepicker.on('changeDate', function(){
        endDatepicker.datepicker('setStartDate', startDatepicker.datepicker('getDate'));
    });
    
});

Template.projectInfo.events({
    'click .menu-option.state': function(e){
        e.preventDefault();
        //console.log('change project state')
        var el = $(e.currentTarget);
        var state = el.attr('data-value');
        var project = Router.current().params.projectId

        if(isAdmin(this.userId)){
            Meteor.call('projects.updateProjectState', project, parseInt(state), function(err, data){
                if(!err){
                    toastr.success('Changed project state.');
                }
                else{
                    toastr.error('An error occurred changing project state.');
                }
            });
        }
    },
    'click .menu-option.priority': function(e){
        e.preventDefault();
        //console.log('change project priority')
        var el = $(e.currentTarget);
        var state = el.attr('data-value');
        var project = Router.current().params.projectId

        if(isAdmin(this.userId)){
            Meteor.call('projects.updateProjectPriority', project, state, function(err, data){
                if(!err){
                    toastr.success('Changed project priority.');
                }
                else{
                    toastr.error('An error occurred changing project priority.');
                }
            });
        }
    },
})

initProjectDatepickers = function(project){
    var offset = moment().utcOffset() / 60;
    
    var startDatepickerOptions = {
        locale: { format: 'DD/MM/YYYY' },
        'singleDatePicker': true,
    }
    var endDatepickerOptions = {
        locale: { format: 'DD/MM/YYYY' },
        'singleDatePicker': true,
    }

    //Check if we have start/end dates to use in datepicker

    if(typeof project.startDate !== 'undefined'){
        startDatepickerOptions['startDate'] = moment(project.startDate).add(offset,'hours').toDate();
        
        endDatepickerOptions['minDate'] = moment(project.startDate).add(offset,'hours').toDate();
    }

    if(typeof project.endDate !== 'undefined'){
        startDatepickerOptions['maxDate'] = project.endDate;
        
        endDatepickerOptions['startDate'] = project.endDate;

    }

    var startDate = $('#startDate').daterangepicker(startDatepickerOptions);

    var endDate = $('#endDate').daterangepicker(endDatepickerOptions);

    //Datepicker events

    startDate.on('apply.daterangepicker', function(e, picker) {
        
        var target = e.currentTarget;
        var newData = target.value;
        var projectId = project._id;

        //Build moment object from parsing input
        var dateItems = newData.split('/');
        var date = moment().date(parseInt(dateItems[0])).month(parseInt(dateItems[1]-1)).year(parseInt(dateItems[2])).startOf('day');


        //Check if chosen date is not > than current end date
        var endDate = $(document).find('#endDate').data('content')
        if(date.isAfter(endDate)){
            //FUTURE: Ask if user wants to push all project planing forward

            toastr.options.timeOut = 8000;
            toastr.error('Cannot set start date after current end date.');
            console.log(target.getAttribute('placeholder'));
            resetToastrOptions();

        }
        else{
            if(target.getAttribute('data-content') != date.toDate()){
                //target.innerHTML = '';
                if(date.isValid()){
                    console.log('update project start date')
                    Meteor.call('saveProjectStartDate', projectId, date.utc().toDate(), function(err){
                        if(!err){
                            toastr.success('Set start date to <b> '+ date.format('DD-MM-YYYY') +'</b>');
                        }
                        else{
                            toastr.error('Error setting date to <b> '+ date.format('DD-MM-YYYY') +'</b>');
                        }
                    });
                }
                else{
                    toastr.error('Invalid date input.');
                }
            }
        }

    });

    endDate.on('apply.daterangepicker', function(e, picker) {
        
        var target = e.currentTarget;
        var newData = target.value;
        var projectId = project._id;

        //Build moment object
        var dateItems = newData.split('/');
        var date = moment().date(parseInt(dateItems[0])).month(parseInt(dateItems[1]-1)).year(parseInt(dateItems[2])).endOf('day');

        if(target.getAttribute('data-content') != date.toDate()){
            //target.innerHTML = '';
            if(date.isValid()){
                console.log('---- save endDate! ----')
                Meteor.call('saveProjectEndDate', projectId, date.utc().toDate(), function(err){
                    if(!err){
                        toastr.success('Set delivery date to <b> '+ newData +'</b>, ' + moment().to(date));
                    }
                    else{
                        toastr.error('Error setting date to <b> '+ newData +'</b>, ');
                    }
                });
            }
            else{
                toastr.error('Invalid date input.');
            }
        }
    });
}

//Prompts the user if he wants to push the project in a certain direction ('forward' or 'backward')
//TODO: update its dependencies i.e. tasks
updateProjectPlanning = function(project, direction, newDate){
    toastr.options.timeOut = 0;
    toastr.options.extendedTimeOut = 0;
    toastr.options.tapToDismiss = false;

    //Get current project range in days
    var projectStartDate = moment(project.startDate);
    var projectEndDate = moment(project.endDate);

    console.log(projectStartDate.toDate())
    console.log(projectEndDate.toDate())


    //Ask if user wants to push planning forward
    if(direction === 'forward'){
        var range = projectEndDate.diff(projectStartDate, 'minutes')

        console.log('range: ' + range)

        var newEndDate = projectEndDate;
        newEndDate.add(range, 'minute');

        console.log(newDate.toDate())
        console.log(newEndDate.toDate())    
        
        var body = '<div>'
                    +'<p>The start date is ahead the current end date. Do you wish to push all project planning forward?</p>'
                    +'<button type="button" class="btn clear">Cancel</button>'
                    +'<button type="button" id="okBtn" class="btn btn-primary pull-right">Yes</button></div>';

        var toast = toastr.warning(body, 'Change end date?');
    }

    
    //Ask if user wants to pull planning back
    if(direction === 'backward'){
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
                //TODO: Update start/end of planned tasks as well 
                console.log('Update project start-end dates')

                var updateData = {
                    'startDate': newDate,
                    'endDate': newEndDate
                }
                console.log('Before method')

                updateProject(project._id, updateData);

                
                console.log('Update project dependencies')
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