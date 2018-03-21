Template.projectsTotalList.onRendered(function(){
	initMasonry();
});

Template.projectsTotalList.events({
	'input #projectSearchInput': function(e){
		e.preventDefault();
		var $searchEl = $(e.currentTarget);
		var ogValue = $searchEl.val();
		var compValue = ogValue.toUpperCase();
		
		if(ogValue.length > 0 && ogValue !== ' ' && ogValue !== '  '){
			var $panels = $('.panel');
			
			_.each($panels, function(panel, k){
				let $p = $(panel);
				let projectName = $p.attr('data-projectname').toUpperCase();
				let codeName = '';
				
				if(typeof $p.attr('data-codename') !== 'undefined'){
					codeName = $p.attr('data-codename').toUpperCase();
				}

				if(projectName.includes(compValue) || codeName.includes(compValue)){
					//Highlight text match
					console.log('MATCH!')
					$p.parent().removeClass('hidden');
					var re = new RegExp(compValue, "gi");
					var title = $p.find('.panel-title a').text();
					var highlighted = title.replace(re, "<span class='highlighted'>"+ogValue+"</span>");
					$p.find('.panel-title a').html(highlighted);
				}
				else{
					//Remove highlight and show
					var ogName = truncString($p.attr('data-projectname'), 20, false);
					$p.find('.panel-title a').text(ogName);
					$p.parent().addClass('hidden');
				}
			});
			reloadMasonry();
			console.log('-----------')
		}
		else{
			var $panels = $('.panel');			
			_.each($panels, function(p, k){
				var ogName = truncString($(p).attr('data-projectname'), 20, false);
				$(p).find('.panel-title a').text(ogName);
				$(p).parent().removeClass('hidden');
			});
			reloadMasonry();
		}
	}
});
