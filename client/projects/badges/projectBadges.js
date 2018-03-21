import { Tracker } from 'meteor/tracker';
import { gauge } from 'meteor/mstrlaw:charts';

Template.projectsBadges.onRendered(function(){

	//Resizes the badges witdh
	Tracker.autorun(function () {
		var deviceWidth = Session.get('deviceWidth');
		var areaWidth = $('#badgesArea').width();
		var badges = $('#badgesArea').find('.stats-badge');
		var styles = {
			'width': '100%',
			'opacity': 1
		}

		badges.attr('style', '');
		
		if(deviceWidth > 970){
			// -xx to 'correct' side margins from Bootstrap
			styles['width'] = Math.floor(areaWidth / badges.length) - 19 + 'px';

		}
		else if(deviceWidth >= 560 && deviceWidth <= 970){
			styles['width'] = Math.floor(areaWidth / (badges.length / 2)) - 22 + 'px';
		}
		else{
			styles['width'] = Math.floor(areaWidth / (badges.length / 4)) - 28 + 'px';
		}

		_.each(styles, function(val, key){
			badges.css({key:''+val});
		});

		badges.css({'width': styles['width']});
		badges.css({ 'opacity': 1 });
		
	});

});