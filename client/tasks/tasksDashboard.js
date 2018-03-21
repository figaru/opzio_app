Template.tasksDashboard.onRendered(function(){
	var taskList = $('#taskList');
	var taskDetailArea = $('#taskDetailArea');

	var listHeight = $(window).height() - taskList.offset().top - $('#sideTasklist').offset().top + 15;

	console.log(listHeight)

	taskList.css({
		'max-height': listHeight + 'px'
	});

	taskDetailArea.css({
		'height': listHeight + 44 + 'px',
		'max-height': listHeight + 44 + 'px',
		'overflow-y': 'auto'
	});

	/*
	taskList.css({
		'max-height': ($('#sideTasklist').offset().top * 2) + 'px'
	})

	$('#sideTasklist').css({
		'height': listHeight + 'px'
	});
	*/
})