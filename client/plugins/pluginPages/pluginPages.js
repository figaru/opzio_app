//------------
// CHROME
//------------
Template.chromeTracker.onRendered(function(){
	var userBrowser = Session.get('userBrowser');
	var t = Template.instance();

	if(typeof userBrowser === 'undefined'){
		userBrowser = bowser;
	}

	if(userBrowser.name === 'Chrome'){
		var version = userBrowser.version;
		t.$('.browserDownload').html('<span class="badge badge-success">You are using Chrome v'+version+'. </span><span class="badge badge-primary ml-2 shadow shadow-interact"><a href="https://chrome.google.com/webstore/detail/opzio-chrome/lbhmaibcoldlbmpfjhheplnpaacfoolf" target="_blank"><fa class="fa fa-download"></fa> Get Extension</a></span>');
	}
	else{
		//t.$('.browserValid').html('<i class="fa fa-times-circle grey-text"></i> Google Chrome');
		t.$('.browserDownload').html('<span class="badge badge-default">You\'re not using Google Chrome</span>');
	}
});

//------------
// FIREFOX
//------------
Template.firefoxTracker.onRendered(function(){
	var userBrowser = Session.get('userBrowser');
	var t = Template.instance();

	if(typeof userBrowser === 'undefined'){
		userBrowser = bowser;
	}

	if(userBrowser.name === 'Firefox'){
		var version = userBrowser.version;
		
		//$('.browserValid').html('<i class="fa fa-check-circle green-text"></i> Mozilla Firefox');
		t.$('.browserDownload').html('<span class="badge badge-success">You are using Firefox v'+version+'. </span><span class="badge badge-primary ml-2 shadow shadow-interact"><a href="/plugins/opzio_mozilla.xpi" target="_blank"><fa class="fa fa-download"></fa> Download Extension</a></span>');
	}
	else{
		//$('.browserValid').html('<i class="fa fa-times-circle grey-text"></i> Mozilla Firefox');
		t.$('.browserDownload').html('<span class="badge badge-default">You\'re not using Mozilla Firefox</span>');
	}
});

//------------
// OPERA
//------------
Template.operaTracker.onRendered(function(){
	var userBrowser = Session.get('userBrowser');
	var t = Template.instance();

	if(typeof userBrowser === 'undefined'){
		userBrowser = bowser;
	}

	if(userBrowser.name === 'Opera'){
		var version = userBrowser.version;
		
		//$('.browserValid').html('<i class="fa fa-check-circle green-text"></i> Opera');
		
		t.$('.browserDownload').html('<span class="badge badge-success">You are using Opera v'+version+'. </span><span class="badge badge-primary ml-2 shadow shadow-interact"><a href="/plugins/opzio_opera.nex" target="_blank"><fa class="fa fa-download"></fa> Download Extension</a></span>');
	}
	else{
		//$('.browserValid').html('<i class="fa fa-times-circle grey-text"></i> Opera');
		t.$('.browserDownload').html('<span class="badge badge-default">You\'re not using Opera</span>');
	}
});

//------------
// MAC
//------------
Template.appleTracker.onRendered(function(){
	var userSystem = getOS();
	var t = Template.instance();

	console.log(userSystem)

	if(typeof userSystem !== 'undefined'){
		if(userSystem === 'mac'){
			t.$('.browserDownload').html('<span class="badge badge-success">You are using MacOS. </span><span class="badge badge-primary ml-2 shadow shadow-interact"><a href="/plugins/opzio_mac.zip" target="_blank"><fa class="fa fa-download"></fa> Download Plugin</a></span>');
		}
		else{
			//$('.browserValid').html('<i class="fa fa-times-circle grey-text"></i> Opera');
			t.$('.browserDownload').html('<span class="badge badge-default">You\'re not using MacOS</span>');
		}
	}

});

//------------
// WINDOWS
//------------
Template.windowsTracker.onRendered(function(){
	var userSystem = getOS();
	var t = Template.instance();

	console.log(userSystem)

	if(typeof userSystem !== 'undefined'){
		if(userSystem === 'windows'){
			t.$('.browserDownload').html('<span class="badge badge-success">You are using Windows. </span><span class="badge badge-primary ml-2 shadow shadow-interact"><a href="/plugins/opzio_windows_setup.zip" target="_blank"><fa class="fa fa-download"></fa> Download Plugin</a></span>');
		}
		else{
			//$('.browserValid').html('<i class="fa fa-times-circle grey-text"></i> Opera');
			t.$('.browserDownload').html('<span class="badge badge-default">You\'re not using Windows</span>');
		}
	}

});