positionEventTooltip = function(item, el){
	console.log('positionEventTooltip');
	var element = $(el);
	var windowWidth = $(document).width();
	//console.log(el)

	var itemId = item._id;

	var tooltipEl = $('<div class="timeline-tooltip card shadow"></div>');
	var tooltipWrapper = $('<div id="tooltip_'+itemId+'" class="tooltip-wrapper cluster-tooltip"></div>')

	var tooltipContent = $('<div class="card-block"></div>');
	var content = 	'<div class="row">\
						<div class="col-12">\
							<p>Some info goes here</p>\
						</div>\
					</div>';
	tooltipContent.append(content);

	tooltipEl.append('<h6 class="card-header text-uppercase">'+ item.title +' - '+ getStringFromEpoch(item.totalTime) +'</h6>')
	tooltipEl.append(tooltipContent)
	//tooltipEl.append(content)

	tooltipWrapper.append(tooltipEl);

	tooltipWrapper.css({
		position: 'absolute',
		opacity: 1
	});

	/*
	tooltipWrapper.bind('mouseleave', function(e){
		var el = $(document).find('.cluster-tooltip');
		el.animate({'opacity':0}, 200);
		Meteor.setTimeout(function(){
			el.remove();
		}, 1000);
	});
	*/

	//Append tooltip to body
	$('body').append(tooltipWrapper);

	//Once we have the tooltip element appended we can get it's height to account when positioning
	var domEl = $(document).find('.tooltip-wrapper');
	var domElH = domEl.height();

	var eventOffset = element.offset();

	

	var eventLeft = eventOffset.left;
	var eventTop = eventOffset.top;
	var eventHeight = element.height();
	
	var sectionOffset = $(document).find('.fc-view-container').offset();

	//Check if we need to position tooltip above or below event element
	var topPosition = eventTop - domElH - 8;
	if(topPosition - sectionOffset.top < 0){
		domEl.addClass('bottom');
		topPosition = eventTop + eventHeight + 10;
	}

	//Check if we need to align tooltip left or right of event element
	var rightPosition = eventLeft + domEl.width() + 150;
	if(rightPosition >= windowWidth){
		domEl.addClass('right');
		var leftPos = (eventLeft - element.width() - element.width()) + 'px';
	}
	else{
		var leftPos = eventOffset.left + 'px';
	}


	domEl.css({
		top: topPosition+'px',
		left: leftPos,
		opacity: 1
	});
}