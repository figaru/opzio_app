Template.projectInfoPanel.events({
	/*******
	    Project Description
	*******/
	'focus #projectBrief' : function(e){
	    e.currentTarget.setAttribute('data-content', Template.currentData().project.brief);
	    console.log(e.currentTarget.innerText)
	},
	'blur #projectBrief' : function(e){
	    var newData = e.currentTarget.innerHTML;
	    
	    if(e.currentTarget.getAttribute('data-content') != newData){
	        var elHeight = $(e.currentTarget).height();
	        $(e.currentTarget).parent().append('<div class="spinner-wrapper" style="bottom:'+ (elHeight/2 + 5) +'px;"><span class="load-spinner load-input m-progress"></span></div>');
	        $(e.currentTarget).removeAttr('contenteditable').css({'height':elHeight+'px'});
	        e.currentTarget.innerHTML = '';

	        var projectId = Template.currentData().project._id;
	        
	        Meteor.call('saveProjectBrief', projectId, newData, function(err){
	            if(!err){
	                toastr.success('Brief saved.');
	            }
	            else{
	                toastr.error('Error saving project brief.');
	            }
	            $(e.currentTarget).parent().find('.spinner-wrapper').remove();
	            $(e.currentTarget).attr('contenteditable',true).css({'height':'auto'});
	        });
	    };

	},
	/* Cleans formatting on paste for brief*/
	'paste #projectBrief': function(e){
	    //Get current content before paste
	    var currentContent = e.currentTarget.innerHTML;
	    
	    $(e.currentTarget).addClass('saving');

	    //Wait for pasted content to be present
	    setTimeout(function(){
	        var pastedContent = e.currentTarget.innerHTML;
	        //Remove existing content
	        pastedContent.replace(currentContent, '');

	        var tempDiv = document.createElement("DIV");
	        tempDiv.innerHTML = pastedContent;
	        
	        $(e.currentTarget).removeClass('saving');
	        e.currentTarget.innerHTML = tempDiv.textContent;
	    }, 100);
	},
});