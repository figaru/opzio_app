Template.projectGoals.events({
	'click #saveGoals': function(e, t){
		var projecId = t.data.project._id;
		
		var tr = $('#goals').find('tr[data-changed="true"]');
	
		if(tr.length > 0){
			for(var i=0; i<tr.length; i++){
				var goalType = $(tr[i]).attr('data-goaltype');

				if(typeof $(tr[i]).attr('data-newperiod') !== 'undefined'){
					var chosenPeriod = $(tr[i]).attr('data-newperiod');
				}
				else{
					var chosenPeriod = $(tr[i]).find('.periodDropdown').attr('data-currentvalue');
				}
				if(typeof $(tr[i]).attr('data-newvalue') !== 'undefined'){
					var value = $(tr[i]).attr('data-newvalue');
				}
				else{
					var value = $(tr[i]).find('.goalValue').val();
				}
				
				console.log('update new period ' + chosenPeriod);
				console.log('update new value ' + value);
				console.log('-----')

			}
		}

		Meteor.call('project.updateGoal', projecId, goalType, chosenPeriod, parseFloat(value), function(err, data){
			if(!err){
				$(e.currentTarget).removeClass('anim-shake').addClass('hidden')
				toastr.success('Updated project goals.')
			}
			else{
				toastr.success('Error updating project goals!')	
			}
		});
	}
});