Template.loader.onRendered(function(){
	var quotes = [
		'<li>Gearing up for a productive day!</li>',
		'<li>Heating up web sockets..</li>',
		'<li>Making all sorts of consistency checks..</li>',
		'<li>Recalculating productivity score..</li>',
		'<li>Waking up the database..</li>',
		'<li>Fetching bits and bytes of information..</li>',
		'<li>Sending information over the wire..</li>',
		'<li>Putting your profile \'<em>on the line</em>\'..</li>',
		'<li>Warming up server engines..</li>',
		'<li>Silently judging your productivity..</li>',
		'<li>Waiting for the paint to dry..</li>',
		'<li>Drawing pretty charts..</li>',
		'<li>Polishing system bells &amp; wistles..</li>',
		'<li>Polishing interface buttons..</li>',
		'<li>Changing broken server fuses..</li>',
		'<li>Fastening passenger seat belts..</li>',
		'<li>Turning on data servers one by one..</li>',
		'<li>Rounding input corners..</li>',
		'<li>Waiting for satelite positioning..</li>',
		'<li>Adding more RAM to our servers..</li>',
		'<li>Reviewing misspelled words..</li>',
		'<li>Waking up Opz..</li>',
		'<li>Dusting off interface..</li>',
		'<li>Initializing work simulation parameters..</li>',
	]

	//Populate quotes
	for(var i=0; i < 5; i++){
	  var index = Math.floor(Math.random() * (quotes.length - 1));
	  $('#randomQuotes').append(quotes[index]);
	  quotes.splice(index, 1);
	}
});