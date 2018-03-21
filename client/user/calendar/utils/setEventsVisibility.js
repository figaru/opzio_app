setEventsVisibility = function(){
	var detailLevel = Session.get('calendarDetail');
	var events = $('.fc-event, .fc-list-item');

	if(detailLevel === 'all'){
		$('.toggleValid').attr('data-selected', false).text('Hide validated');
		$('.togglePublic').attr('data-selected', false).text('Hide public');
		Session.set('calendarDetail', 'highLevelDetail');
		Session.set('invalidOnly', false);
		Session.set('privateOnly', false);
	}
	else{
		var invalidOnly = Session.get('invalidOnly');
		var privateOnly = Session.get('privateOnly');

		events.each(function(k, el){
			//Deceide whether or not to show/hide event
			if(detailLevel === 'midLevelDetail'){
				console.log('midLevelDetail')
				if($(el).hasClass('midLevelDetail') || $(el).hasClass('lowLevelDetail')){
					//Display both mid and low level detail events
					if(invalidOnly === true && $(el).attr('data-validated') === 'true'){
						console.log('A')
						$(el).addClass('hidden');
					}
					else if(privateOnly === true && $(el).attr('data-private') === 'false'){
						console.log('B')
						$(el).addClass('hidden');
					}
					else{
						$(el).removeClass('hidden');
					}
				}
				else{
					console.log('C')
					$(el).addClass('hidden');
				}
			}
			else if(detailLevel === 'lowLevelDetail'){
				console.log('lowLevelDetail')
				if($(el).hasClass('lowLevelDetail')){
					if(invalidOnly === true && $(el).attr('data-validated') === 'true'){
						$(el).addClass('hidden');
					}
					else if(privateOnly === true && $(el).attr('data-private') === 'false'){
						$(el).addClass('hidden');
					}
					else{
						$(el).removeClass('hidden');
					}
				}
				else{
					$(el).addClass('hidden');
				}
			}
			else if(detailLevel === 'highLevelDetail'){
				console.log('highLevelDetail')
				if(invalidOnly === true && $(el).attr('data-validated') === 'true'){
					$(el).addClass('hidden');
				}
				else if(privateOnly === true && $(el).attr('data-private') === 'false'){
					$(el).addClass('hidden');
				}
				else{
					$(el).removeClass('hidden');
				}
			}
		});
	}
}