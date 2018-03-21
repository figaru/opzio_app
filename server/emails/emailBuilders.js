buildSignupEmail = function(timeToRelease){

	var title = 'Welcome aboard!';
	var subTitle = 'We\'re glad you decided to give it a try!';
	var messageTitle = 'See you in '+ timeToRelease +' ;)';
	var messageBody = 'Opz.io takes care of the tedious task of time tracking, providing you insights on your performance and allowing you to keep focused on your work.';
	var footer = 'You are receiving this email as confirmation of your signup on https://www.opz.io If you didn\'t signup, please ignore this email.'

	return '<body class="full-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;">'
				+'<table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #f5f7fa;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td> <div class="preheader" style="Margin: 0 auto;max-width: 560px;min-width: 280px; width: 280px;width: calc(28000% - 167440px);"> <div style="border-collapse: collapse;display: table;width: 100%;"> <div class="snippet" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 140px; width: 140px;width: calc(14000% - 78120px);padding: 10px 0 5px 0;color: #b9b9b9;font-family: &quot;Open Sans&quot;,sans-serif;"> </div><div class="webversion" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 139px; width: 139px;width: calc(14100% - 78680px);padding: 10px 0 5px 0;text-align: right;color: #b9b9b9;font-family: &quot;Open Sans&quot;,sans-serif;"> </div></div></div><div class="header" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);" id="emb-email-header-container"> <div class="logo emb-logo-margin-box" style="font-size: 26px;line-height: 32px;Margin-top: 6px;Margin-bottom: 20px;color: #c3ced9;font-family: Roboto,Tahoma,sans-serif;Margin-left: 20px;Margin-right: 20px;" align="center"> <div class="logo-center" style="font-size:0px !important;line-height:0 !important;" align="center" id="emb-email-header"><a style="text-decoration: none;transition: opacity 0.1s ease-in;color: #c3ced9;" href="https://www.opz.io" target="_blank"><img style="height: auto;width: 100%;border: 0;max-width: 160px;" src="https://www.opz.io/images/opzio_logo_transparent_black_400.png" alt="Opz.io" width="160"></a></div></div></div>'
					+'<div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background:#3949AB;background:-moz-linear-gradient(-45deg,  #3949AB 15%, #4DB6B2 92%);background:-webkit-linear-gradient(-45deg,  #3949AB 15%,#4DB6B2 92%);background:linear-gradient(-45deg,  #3949AB 15%,#4DB6B2 92%);"> <div class="column" style="text-align: left;color: #60666d;font-size: 14px;line-height: 21px;font-family: &quot;Open Sans&quot;,sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 24px;"> <div style="line-height:65px;font-size:1px">&nbsp;</div></div><div style="Margin-left: 20px;Margin-right: 20px;">'
						+'<h1 style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #44a8c7;font-size: 32px;line-height: 40px;font-family: Cabin,Avenir,sans-serif;text-align: center;"><strong><span style="color:#ffffff">'+ title +'</span></strong></h1>'
						+'<h3 style="Margin-top: 20px;Margin-bottom: 12px;font-style: normal;font-weight: normal;color: #44a8c7;font-size: 17px;line-height: 26px;text-align: center;"><span style="color:#ffffff">'+ subTitle +'</span></h3>'
					+'</div><div style="Margin-left: 20px;Margin-right: 20px;"> <div style="line-height:20px;font-size:1px">&nbsp;</div></div><div style="Margin-left: 20px;Margin-right: 20px;Margin-bottom: 24px;"> <div style="line-height:12px;font-size:1px">&nbsp;</div></div></div></div></div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;" emb-background-style=""> <div class="column" style="text-align: left;color: #60666d;font-size: 14px;line-height: 21px;font-family: &quot;Open Sans&quot;,sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 15px;Margin-bottom: 15px;"> <div style="line-height:1px;font-size:1px">&nbsp;</div></div></div></div></div>'
					+'<div class="layout fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;" emb-background-style=""> <div class="column wide" style="text-align: left;color: #60666d;font-size: 14px;line-height: 21px;font-family: &quot;Open Sans&quot;,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 24px;Margin-bottom: 24px;">'
						+'<p class="size-22" style="Margin-top: 0;Margin-bottom: 0;font-size: 22px;line-height: 26px;" lang="x-size-22">'+ messageTitle +'</p>'
						+'<p style="Margin-top: 20px;Margin-bottom: 0;">'+ messageBody +'</p>'
						+'</div></div><div class="column narrow" style="text-align: left;color: #60666d;font-size: 14px;line-height: 21px;font-family: &quot;Open Sans&quot;,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);"> <div style="font-size: 12px;font-style: normal;font-weight: normal;" align="center"> <img class="gnd-corner-image gnd-corner-image-center gnd-corner-image-top gnd-corner-image-bottom" style="border: 0;display: block;height: auto;width: 100%;max-width: 480px;" alt="" width="200" src="https://www.opz.io/images/bot/happy2_padded.png"> </div></div></div></div>'
						+'<div class="layout email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"> <div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #b9b9b9;font-family: &quot;Open Sans&quot;,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">'
							+'<div style="Margin-top: 20px;"> <div>Opz.io</div></div>'
							+'<div style="Margin-top: 18px;"> <div>'+ footer +'</div></div>'
						+'</div></div></div></div><div class="layout one-col email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"> <div class="column" style="text-align: left;font-size: 12px;line-height: 19px;color: #b9b9b9;font-family: &quot;Open Sans&quot;,sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"> <div> </div></div></div></div></div><div style="line-height:40px;font-size:40px;">&nbsp;</div></td></tr></tbody></table>'
			+'</body>';
}

buildDemoEmail = function(firstName){
	return '<body class="full-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;"> <table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #f5f7fa;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td> <div class="preheader" style="Margin: 0 auto;max-width: 560px;min-width: 280px; width: 280px;width: calc(28000% - 167440px);"> <div style="border-collapse: collapse;display: table;width: 100%;"> <div class="snippet" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 140px; width: 140px;width: calc(14000% - 78120px);padding: 10px 0 5px 0;color: #b9b9b9;font-family: &quot;Open Sans&quot;,sans-serif;"> </div><div class="webversion" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 139px; width: 139px;width: calc(14100% - 78680px);padding: 10px 0 5px 0;text-align: right;color: #b9b9b9;font-family: &quot;Open Sans&quot;,sans-serif;"> </div></div></div><div class="header" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);" id="emb-email-header-container"> <div class="logo emb-logo-margin-box" style="font-size: 26px;line-height: 32px;Margin-top: 6px;Margin-bottom: 20px;color: #c3ced9;font-family: Roboto,Tahoma,sans-serif;Margin-left: 20px;Margin-right: 20px;" align="center"> <div class="logo-center" style="font-size:0px !important;line-height:0 !important;" align="center" id="emb-email-header"><a style="text-decoration: none;transition: opacity 0.1s ease-in;color: #c3ced9;" href="https://www.opz.io" target="_blank"><img style="height: auto;width: 100%;border: 0;max-width: 160px;" src="https://www.opz.io/images/opzio_logo_transparent_black_400.png" alt="Opz.io" width="160"></a></div></div></div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background:#3949AB;background:-moz-linear-gradient(-45deg,  #3949AB 15%, #4DB6B2 92%);background:-webkit-linear-gradient(-45deg,  #3949AB 15%,#4DB6B2 92%);background:linear-gradient(-45deg,  #3949AB 15%,#4DB6B2 92%);"> <div class="column" style="text-align: left;color: #60666d;font-size: 14px;line-height: 21px;font-family: &quot;Open Sans&quot;,sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 24px;"> <div style="line-height:65px;font-size:1px">&nbsp;</div></div><div style="Margin-left: 20px;Margin-right: 20px;"> <h1 style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #44a8c7;font-size: 32px;line-height: 40px;font-family: Cabin,Avenir,sans-serif;text-align: center;"><strong><span style="color:#ffffff">Welcome aboard '+ firstName +'!</span></strong></h1><h3 style="Margin-top: 20px;Margin-bottom: 12px;font-style: normal;font-weight: normal;color: #44a8c7;font-size: 17px;line-height: 26px;text-align: center;"><span style="color:#ffffff">We\'re glad you decided to give it a try!</span></h3> </div><div style="Margin-left: 20px;Margin-right: 20px;"> <div style="line-height:20px;font-size:1px">&nbsp;</div></div><div style="Margin-left: 20px;Margin-right: 20px;Margin-bottom: 24px;"> <div style="line-height:12px;font-size:1px">&nbsp;</div></div></div></div></div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;" emb-background-style=""> <div class="column" style="text-align: left;color: #60666d;font-size: 14px;line-height: 21px;font-family: &quot;Open Sans&quot;,sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 15px;Margin-bottom: 15px;"> <div style="line-height:1px;font-size:1px">&nbsp;</div></div></div></div></div><div class="layout fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;" emb-background-style=""> <div class="column wide" style="text-align: left;color: #60666d;font-size: 14px;line-height: 21px;font-family: &quot;Open Sans&quot;,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 24px;Margin-bottom: 24px;"><p style="Margin-top: 20px;Margin-bottom: 0;">Opz.io is currently giving out access to select users and organizations as part of it\'s beta stage.<br>We\'ll get in touch to get to know you and provide you access to a demo account.<br><br>- Team Opz!</p></div></div><div class="column narrow" style="text-align: left;color: #60666d;font-size: 14px;line-height: 21px;font-family: &quot;Open Sans&quot;,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);"> <div style="font-size: 12px;font-style: normal;font-weight: normal;" align="center"> <img class="gnd-corner-image gnd-corner-image-center gnd-corner-image-top gnd-corner-image-bottom" style="border: 0;display: block;height: auto;width: 100%;max-width: 480px;" alt="" width="200" src="https://www.opz.io/images/bot/happy2_padded.png"> </div></div></div></div><div class="layout email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"> <div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #b9b9b9;font-family: &quot;Open Sans&quot;,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"> <div style="Margin-top: 20px;"> <div>Opz.io</div></div><div style="Margin-top: 18px;"> <div>You are receiving this email as confirmation of your demo request on https://www.opz.io If you didn\'t signup, please ignore this email.</div></div></div></div></div></div><div class="layout one-col email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"> <div class="column" style="text-align: left;font-size: 12px;line-height: 19px;color: #b9b9b9;font-family: &quot;Open Sans&quot;,sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"> <div> </div></div></div></div></div><div style="line-height:40px;font-size:40px;">&nbsp;</div></td></tr></tbody></table> </body>';
}

buildAnnouncementEmail = function(){
	var title = 'You can now register!';
	var subTitle = '';
	var messageTitle = 'You\'ve been selected for Beta.';
	var messageBody = 'Opz.io\'s purpose is to become your own project management assistant. Being under development, we hope that through your participation you can help us make it a trully powerful assistant.<br>You can signup <a style="color:#5ad3ce" href="https://www.opz.io/register" target="_blank">here</a> (https://www.opz.io/register)';
	var footer = 'You are receiving this email as part of your signup on https://www.opz.io If you didn\'t signup, please ignore this email.'

	return '<body class="full-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;">'
				+'<table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #f5f7fa;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td> <div class="preheader" style="Margin: 0 auto;max-width: 560px;min-width: 280px; width: 280px;width: calc(28000% - 167440px);"> <div style="border-collapse: collapse;display: table;width: 100%;"> <div class="snippet" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 140px; width: 140px;width: calc(14000% - 78120px);padding: 10px 0 5px 0;color: #b9b9b9;font-family: &quot;Open Sans&quot;,sans-serif;"> </div><div class="webversion" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 139px; width: 139px;width: calc(14100% - 78680px);padding: 10px 0 5px 0;text-align: right;color: #b9b9b9;font-family: &quot;Open Sans&quot;,sans-serif;"> </div></div></div><div class="header" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);" id="emb-email-header-container"> <div class="logo emb-logo-margin-box" style="font-size: 26px;line-height: 32px;Margin-top: 6px;Margin-bottom: 20px;color: #c3ced9;font-family: Roboto,Tahoma,sans-serif;Margin-left: 20px;Margin-right: 20px;" align="center"> <div class="logo-center" style="font-size:0px !important;line-height:0 !important;" align="center" id="emb-email-header"><a style="text-decoration: none;transition: opacity 0.1s ease-in;color: #c3ced9;" href="https://www.opz.io" target="_blank"><img style="height: auto;width: 100%;border: 0;max-width: 160px;" src="https://www.opz.io/images/opzio_logo_transparent_black_400.png" alt="Opz.io" width="160"></a></div></div></div>'
					+'<div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background:#3949AB;background:-moz-linear-gradient(-45deg,  #3949AB 15%, #4DB6B2 92%);background:-webkit-linear-gradient(-45deg,  #3949AB 15%,#4DB6B2 92%);background:linear-gradient(-45deg,  #3949AB 15%,#4DB6B2 92%);"> <div class="column" style="text-align: left;color: #60666d;font-size: 14px;line-height: 21px;font-family: &quot;Open Sans&quot;,sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 24px;"> <div style="line-height:65px;font-size:1px">&nbsp;</div></div><div style="Margin-left: 20px;Margin-right: 20px;">'
						+'<h1 style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #44a8c7;font-size: 32px;line-height: 40px;font-family: Cabin,Avenir,sans-serif;text-align: center;"><strong><span style="color:#ffffff">'+ title +'</span></strong></h1>'
						+'<h3 style="Margin-top: 20px;Margin-bottom: 12px;font-style: normal;font-weight: normal;color: #44a8c7;font-size: 17px;line-height: 26px;text-align: center;"><span style="color:#ffffff">'+ subTitle +'</span></h3>'
					+'</div><div style="Margin-left: 20px;Margin-right: 20px;"> <div style="line-height:20px;font-size:1px">&nbsp;</div></div><div style="Margin-left: 20px;Margin-right: 20px;Margin-bottom: 24px;"> <div style="line-height:12px;font-size:1px">&nbsp;</div></div></div></div></div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;" emb-background-style=""> <div class="column" style="text-align: left;color: #60666d;font-size: 14px;line-height: 21px;font-family: &quot;Open Sans&quot;,sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 15px;Margin-bottom: 15px;"> <div style="line-height:1px;font-size:1px">&nbsp;</div></div></div></div></div>'
					+'<div class="layout fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;" emb-background-style=""> <div class="column wide" style="text-align: left;color: #60666d;font-size: 14px;line-height: 21px;font-family: &quot;Open Sans&quot;,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 24px;Margin-bottom: 24px;">'
						+'<p class="size-22" style="Margin-top: 0;Margin-bottom: 0;font-size: 22px;line-height: 26px;" lang="x-size-22">'+ messageTitle +'</p>'
						+'<p style="Margin-top: 20px;Margin-bottom: 0;">'+ messageBody +'</p>'
						+'</div></div><div class="column narrow" style="text-align: left;color: #60666d;font-size: 14px;line-height: 21px;font-family: &quot;Open Sans&quot;,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);"> <div style="font-size: 12px;font-style: normal;font-weight: normal;" align="center"> <img class="gnd-corner-image gnd-corner-image-center gnd-corner-image-top gnd-corner-image-bottom" style="border: 0;display: block;height: auto;width: 100%;max-width: 480px;" alt="" width="200" src="https://www.opz.io/images/bot/happy2_padded.png"> </div></div></div></div>'
						+'<div class="layout email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"> <div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #b9b9b9;font-family: &quot;Open Sans&quot;,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">'
							+'<div style="Margin-top: 20px;"> <div>Opz.io</div></div>'
							+'<div style="Margin-top: 18px;"> <div>'+ footer +'</div></div>'
						+'</div></div></div></div><div class="layout one-col email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"> <div class="column" style="text-align: left;font-size: 12px;line-height: 19px;color: #b9b9b9;font-family: &quot;Open Sans&quot;,sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"> <div> </div></div></div></div></div><div style="line-height:40px;font-size:40px;">&nbsp;</div></td></tr></tbody></table>'
			+'</body>';
}

buildInviteEmail = function(inviteLink, organizationName){
	var title = 'You\'ve been invited to join Opz.io!';
	var subTitle = organizationName + ' organization';
	var messageTitle = 'Click <a style="color:#5ad3ce;text-decoration:none;" href="'+inviteLink+'" target="_blank">here</a> to create your account';
	var messageBody = 'Opz.io takes care of the tedious task of time tracking, providing you insights on your performance and allowing you to keep focused on your work.<br><br>(Link doesn\'t work? Copy here '+inviteLink+')';
	var footer = 'You are receiving this email because you\'ve been invited to join https://www.opz.io If you didn\'t request an invite, please ignore this email.'

	return '<body class="full-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;">'
		+'<table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #f5f7fa;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td> <div class="preheader" style="Margin: 0 auto;max-width: 560px;min-width: 280px; width: 280px;width: calc(28000% - 167440px);"> <div style="border-collapse: collapse;display: table;width: 100%;"> <div class="snippet" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 140px; width: 140px;width: calc(14000% - 78120px);padding: 10px 0 5px 0;color: #b9b9b9;font-family: &quot;Open Sans&quot;,sans-serif;"> </div><div class="webversion" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 139px; width: 139px;width: calc(14100% - 78680px);padding: 10px 0 5px 0;text-align: right;color: #b9b9b9;font-family: &quot;Open Sans&quot;,sans-serif;"> </div></div></div><div class="header" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);" id="emb-email-header-container"> <div class="logo emb-logo-margin-box" style="font-size: 26px;line-height: 32px;Margin-top: 6px;Margin-bottom: 20px;color: #c3ced9;font-family: Roboto,Tahoma,sans-serif;Margin-left: 20px;Margin-right: 20px;" align="center"> <div class="logo-center" style="font-size:0px !important;line-height:0 !important;" align="center" id="emb-email-header"><a style="text-decoration: none;transition: opacity 0.1s ease-in;color: #c3ced9;" href="https://www.opz.io" target="_blank"><img style="height: auto;width: 100%;border: 0;max-width: 160px;" src="https://www.opz.io/images/opzio_logo_transparent_black_400.png" alt="Opz.io" width="160"></a></div></div></div>'
			+'<div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background:#3949AB;background:-moz-linear-gradient(-45deg,  #3949AB 15%, #4DB6B2 92%);background:-webkit-linear-gradient(-45deg,  #3949AB 15%,#4DB6B2 92%);background:linear-gradient(-45deg,  #3949AB 15%,#4DB6B2 92%);"> <div class="column" style="text-align: left;color: #60666d;font-size: 14px;line-height: 21px;font-family: &quot;Open Sans&quot;,sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 24px;"> <div style="line-height:65px;font-size:1px">&nbsp;</div></div><div style="Margin-left: 20px;Margin-right: 20px;">'
				+'<h1 style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #44a8c7;font-size: 32px;line-height: 40px;font-family: Cabin,Avenir,sans-serif;text-align: center;"><strong><span style="color:#ffffff">'+ title +'</span></strong></h1>'
				+'<h3 style="Margin-top: 20px;Margin-bottom: 12px;font-style: normal;font-weight: normal;color: #44a8c7;font-size: 17px;line-height: 26px;text-align: center;"><span style="color:#ffffff">'+ subTitle +'</span></h3>'
			+'</div><div style="Margin-left: 20px;Margin-right: 20px;"> <div style="line-height:20px;font-size:1px">&nbsp;</div></div><div style="Margin-left: 20px;Margin-right: 20px;Margin-bottom: 24px;"> <div style="line-height:12px;font-size:1px">&nbsp;</div></div></div></div></div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;" emb-background-style=""> <div class="column" style="text-align: left;color: #60666d;font-size: 14px;line-height: 21px;font-family: &quot;Open Sans&quot;,sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 15px;Margin-bottom: 15px;"> <div style="line-height:1px;font-size:1px">&nbsp;</div></div></div></div></div>'
			+'<div class="layout fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;" emb-background-style=""> <div class="column wide" style="text-align: left;color: #60666d;font-size: 14px;line-height: 21px;font-family: &quot;Open Sans&quot;,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 24px;Margin-bottom: 24px;">'
				+'<p class="size-22" style="Margin-top: 0;Margin-bottom: 0;font-size: 22px;line-height: 26px;" lang="x-size-22">'+ messageTitle +'</p>'
				+'<p style="Margin-top: 20px;Margin-bottom: 0;">'+ messageBody +'</p>'
				+'</div></div><div class="column narrow" style="text-align: left;color: #60666d;font-size: 14px;line-height: 21px;font-family: &quot;Open Sans&quot;,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);"> <div style="font-size: 12px;font-style: normal;font-weight: normal;" align="center"> <img class="gnd-corner-image gnd-corner-image-center gnd-corner-image-top gnd-corner-image-bottom" style="border: 0;display: block;height: auto;width: 100%;max-width: 480px;" alt="" width="200" src="https://www.opz.io/images/bot/happy2_padded.png"> </div></div></div></div>'
				+'<div class="layout email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"> <div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #b9b9b9;font-family: &quot;Open Sans&quot;,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">'
					+'<div style="Margin-top: 20px;"> <div>Opz.io</div></div>'
					+'<div style="Margin-top: 18px;"> <div>'+ footer +'</div></div>'
				+'</div></div></div></div><div class="layout one-col email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"> <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"> <div class="column" style="text-align: left;font-size: 12px;line-height: 19px;color: #b9b9b9;font-family: &quot;Open Sans&quot;,sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"> <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"> <div> </div></div></div></div></div><div style="line-height:40px;font-size:40px;">&nbsp;</div></td></tr></tbody></table>'
	+'</body>';
}

buildReportEmail = function(title, projects, secondaryData, dateString, link, total){
	//console.log(title, projects, dateString, link)
	// var messageBody = 'Opz.io takes care of the tedious task of time tracking, providing you insights on your performance and allowing you to keep focused on your work.<br><br>(Link doesn\'t work? Copy here '+inviteLink+')';
	// var footer = 'You are receiving this email because you are registered on Opz.io. If you think you received it by mistake, please ignore this email.'

	return '<body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #FFFFFF">\
	    <!--[if IE]><div class="ie-browser"><![endif]-->\
	    <!--[if mso]><div class="mso-container"><![endif]-->\
	    <div class="nl-container" style="min-width: 320px;Margin: 0 auto;background-color: #FFFFFF">\
	        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #FFFFFF;"><![endif]-->\
	        <div style="background-color:transparent;">\
	            <div style="Margin: 0 auto;min-width: 320px;max-width: 620px;width: 620px;width: calc(31000% - 197780px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #009BDD;" class="block-grid two-up">\
	                <div style="border-collapse: collapse;display: table;width: 100%;">\
	                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 620px;"><tr class="layout-full-width" style="background-color:#009BDD;"><![endif]-->\
	                    <!--[if (mso)|(IE)]><td align="center" width="310" style=" width:310px; padding-right: 10px; padding-left: 10px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
	                    <div class="col num6" style="Float: left;max-width: 320px;min-width: 310px;width: 310px;width: calc(6510px - 1000%);background-color: #009BDD;">\
	                        <div style="background-color: transparent; width: 100% !important;">\
	                            <!--[if (!mso)&(!IE)]><!-->\
	                            <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 10px; padding-left: 10px;">\
	                            <!--<![endif]-->\
	                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->\
	                                <div style="color:#555555;line-height:120%;font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">\
	                                <div style="font-size:12px;line-height:14px;font-family:Montserrat, \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#555555;text-align:left;">\
	                                    <p style="margin: 0;font-size: 12px;line-height: 14px">\
	                                            <a href="https://opz.io" target="_blank" style="font-size: 36px; line-height:43px; color:rgb(255, 255, 255); text-decoration:none;">OPZ.IO</a>\
	                                        </p>\
	                                    </div>\
	                                </div><!--[if mso]></td></tr></table><![endif]-->\
	                                <!--[if (!mso)&(!IE)]><!-->\
	                            </div><!--<![endif]-->\
	                        </div>\
	                    </div>\
	                    <!--[if (mso)|(IE)]></td><td align="center" width="310" style=" width:310px; padding-right: 10px; padding-left: 10px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
	                    <div class="col num6" style="Float: left;max-width: 320px;min-width: 310px;width: 310px;width: calc(6510px - 1000%);background-color: #009BDD;">\
	                        <div style="background-color: transparent; width: 100% !important;">\
	                            <!--[if (!mso)&(!IE)]><!-->\
	                            <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 10px; padding-left: 10px;">\
	                            <!--<![endif]-->\
	                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 15px; padding-bottom: 15px;"><![endif]-->\
	                                <div style="font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#555555;line-height:120%; padding-right: 0px; padding-left: 0px; padding-top: 15px; padding-bottom: 15px;">\
	                                <div style="font-size:12px;line-height:14px;font-family:Montserrat, \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#555555;text-align:left;">\
	                                    <p style="margin: 0;font-size: 14px;line-height: 17px;text-align: right">\
	                                            <span style="font-size: 20px; line-height: 34px; color: rgb(255, 255, 255);"><em>'+ dateString +'</em></span>\
	                                        </p>\
	                                    </div>\
	                                </div><!--[if mso]></td></tr></table><![endif]-->\
	                                <!--[if (!mso)&(!IE)]><!-->\
	                            </div><!--<![endif]-->\
	                        </div>\
	                    </div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->\
	                </div>\
	            </div>\
	        </div>\
	        <div style="background-color:transparent;">\
	            <div style="Margin: 0 auto;min-width: 320px;max-width: 620px;width: 620px;width: calc(31000% - 197780px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid">\
	                <div style="border-collapse: collapse;display: table;width: 100%;">\
	                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 620px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->\
	                    <!--[if (mso)|(IE)]><td align="center" width="620" style=" width:620px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
	                    <div class="col num12" style="min-width: 320px;max-width: 620px;width: 620px;width: calc(30000% - 185380px);background-color: transparent;">\
	                        <div style="background-color: transparent; width: 100% !important;">\
	                            <!--[if (!mso)&(!IE)]><!-->\
	                            <div style= "border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">\
	                            <!--<![endif]-->\
	                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 15px; padding-bottom: 20px;"><![endif]-->\
	                                <div style= "font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#71777D;line-height:120%; padding-right: 10px; padding-left: 10px; padding-top: 15px; padding-bottom: 20px;">\
	                                <div style= "font-family:Montserrat, \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;font-size:12px;line-height:14px;color:#71777D;text-align:left;">\
	                                    <p style="margin: 0;font-size: 12px;line-height: 14px;text-align: center">\
	                                            <span style="font-size: 18px; line-height: 21px; color: rgb(51, 51, 51);">'+ title +'</span>\
	                                        </p>\
	                                    </div>\
	                                </div><!--[if mso]></td></tr></table><![endif]-->\
	                                <!--[if (!mso)&(!IE)]><!-->\
	                            </div><!--<![endif]-->\
	                        </div>\
	                    </div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->\
	                </div>\
	            </div>\
	        </div>\
	        <div style="background-color:transparent;">\
	            <div style="Margin: 0 auto;min-width: 320px;max-width: 620px;width: 620px;width: calc(31000% - 197780px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #E3E3E3;" class="block-grid mixed-two-up">\
	                <div style="border-collapse: collapse;display: table;width: 100%;">\
	                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 620px;"><tr class="layout-full-width" style="background-color:#E3E3E3;"><![endif]-->\
	                    <!--[if (mso)|(IE)]><td align="center" width="413" style=" width:413px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
	                    <div class="col num8" style="Float: left;min-width: 320px;max-width: 408px;width: 413px;width: calc(9800% - 62312px);background-color: #E3E3E3;">\
	                        <div style="background-color: transparent; width: 100% !important;">\
	                            <!--[if (!mso)&(!IE)]><!-->\
	                            <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">\
	                            <!--<![endif]-->\
	                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->\
	                                <div style="font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#FFFFFF;line-height:120%; padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;">\
	                                <div style="font-family:Montserrat, \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;font-size:12px;line-height:14px;color:#FFFFFF;text-align:left;">\
	                                    <p style="margin: 0;font-size: 12px;line-height: 14px">\
	                                            <span style="color: rgb(51, 51, 51); font-size: 12px; line-height: 14px;">PROJECTS</span>\
	                                        </p>\
	                                    </div>\
	                                </div><!--[if mso]></td></tr></table><![endif]-->\
	                                <!--[if (!mso)&(!IE)]><!-->\
	                            </div><!--<![endif]-->\
	                        </div>\
	                    </div>\
	                    <!--[if (mso)|(IE)]></td><td align="center" width="207" style=" width:207px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
	                    <div class="col num4" style="Float: left;max-width: 320px;min-width: 204px;width: 207px;width: calc(72124px - 11600%);background-color: #E3E3E3;">\
	                        <div style="background-color: transparent; width: 100% !important;">\
	                            <!--[if (!mso)&(!IE)]><!-->\
	                            <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">\
	                            <!--<![endif]-->\
	                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->\
	                                <div style="font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#FFFFFF;line-height:120%; padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;">\
	                                <div style="font-size:12px;line-height:14px;font-family:Montserrat, \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#FFFFFF;text-align:left;">\
	                                    <p style="margin: 0;font-size: 14px;line-height: 17px">\
	                                            <span style="font-size: 14px; line-height: 16px; color: rgb(51, 51, 51);">TIME</span>\
	                                        </p>\
	                                    </div>\
	                                </div><!--[if mso]></td></tr></table><![endif]-->\
	                                <!--[if (!mso)&(!IE)]><!-->\
	                            </div><!--<![endif]-->\
	                        </div>\
	                    </div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->\
	                </div>\
	            </div>\
	        </div>\
	        '+ projects + secondaryData +'\
	        <div style="background-color:transparent;">\
	            <div style="Margin: 0 auto;min-width: 320px;max-width: 620px;width: 620px;width: calc(31000% - 197780px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid">\
	                <div style="border-collapse: collapse;display: table;width: 100%;">\
	                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 620px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->\
	                    <!--[if (mso)|(IE)]><td align="center" width="620" style=" width:620px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
	                    <div class="col num12" style="min-width: 320px;max-width: 620px;width: 620px;width: calc(30000% - 185380px);background-color: transparent;">\
	                        <div style="background-color: transparent; width: 100% !important;">\
	                            <!--[if (!mso)&(!IE)]><!-->\
	                            <div style= "border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">\
	                            <!--<![endif]-->\
	                                <div style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">\
	                                    <!--[if (mso)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px;padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><table width="100%" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->\
	                                    <div align="center">\
	                                        <div style="border-top: 1px dotted #CCCCCC; width:100%; line-height:1px; height:1px; font-size:1px;">&nbsp;</div>\
	                                    </div><!--[if (mso)]></td></tr></table></td></tr></table><![endif]-->\
	                                </div><!--[if (!mso)&(!IE)]><!-->\
	                            </div><!--<![endif]-->\
	                        </div>\
	                    </div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->\
	                </div>\
	            </div>\
	        </div>\
	        <div style="background-color:transparent;">\
	            <div style="Margin: 0 auto;min-width: 320px;max-width: 620px;width: 620px;width: calc(31000% - 197780px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #FFFFFF;" class="block-grid mixed-two-up">\
	                <div style="border-collapse: collapse;display: table;width: 100%;">\
	                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 620px;"><tr class="layout-full-width" style="background-color:#FFFFFF;"><![endif]-->\
	                    <!--[if (mso)|(IE)]><td align="center" width="413" style=" width:413px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
	                    <div class="col num8" style="Float: left;min-width: 320px;max-width: 408px;width: 413px;width: calc(9800% - 62312px);background-color: #FFFFFF;">\
	                        <div style="background-color: transparent; width: 100% !important;">\
	                            <!--[if (!mso)&(!IE)]><!-->\
	                            <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">\
	                            <!--<![endif]-->\
	                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 5px; padding-bottom: 5px;"><![endif]-->\
	                                <div style="font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#000000;line-height:120%; padding-right: 20px; padding-left: 20px; padding-top: 5px; padding-bottom: 5px;">\
	                                <div style="font-size:12px;line-height:14px;font-family:Montserrat, \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#000000;text-align:left;">\
	                                    <p style="margin: 0;font-size: 14px;line-height: 17px"><strong>TOTAL</strong><br></p></div>\
	                                </div><!--[if mso]></td></tr></table><![endif]-->\
	                                <!--[if (!mso)&(!IE)]><!-->\
	                            </div><!--<![endif]-->\
	                        </div>\
	                    </div>\
	                    <!--[if (mso)|(IE)]></td><td align="center" width="207" style=" width:207px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
	                    <div class="col num4" style="Float: left;max-width: 320px;min-width: 204px;width: 207px;width: calc(72124px - 11600%);background-color: #FFFFFF;">\
	                        <div style="background-color: transparent; width: 100% !important;">\
	                            <!--[if (!mso)&(!IE)]><!-->\
	                            <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">\
	                            <!--<![endif]-->\
	                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 5px; padding-bottom: 5px;"><![endif]-->\
	                                <div style="font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#000000;line-height:120%; padding-right: 20px; padding-left: 20px; padding-top: 5px; padding-bottom: 5px;">\
	                                <div style="font-size:12px;line-height:14px;font-family:Montserrat, \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#000000;text-align:left;">\
	                                    <p style="margin: 0;font-size: 14px;line-height: 17px">\
	                                            <strong>'+ total +'</strong>\
	                                        </p>\
	                                    </div>\
	                                </div><!--[if mso]></td></tr></table><![endif]-->\
	                                <!--[if (!mso)&(!IE)]><!-->\
	                            </div><!--<![endif]-->\
	                        </div>\
	                    </div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->\
	                </div>\
	            </div>\
	        </div>\
	        <div style="background-color:transparent;">\
	            <div style="Margin: 0 auto;min-width: 320px;max-width: 620px;width: 620px;width: calc(31000% - 197780px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid">\
	                <div style="border-collapse: collapse;display: table;width: 100%;">\
	                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 620px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->\
	                    <!--[if (mso)|(IE)]><td align="center" width="620" style=" width:620px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
	                    <div class="col num12" style="min-width: 320px;max-width: 620px;width: 620px;width: calc(30000% - 185380px);background-color: transparent;">\
	                        <div style="background-color: transparent; width: 100% !important;">\
	                            <!--[if (!mso)&(!IE)]><!-->\
	                            <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">\
	                            <!--<![endif]-->\
	                                <div style="padding-right: 10px; padding-left: 10px; padding-top: 15px; padding-bottom: 15px;">\
	                                    <!--[if (mso)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px;padding-left: 10px; padding-top: 15px; padding-bottom: 15px;"><table width="100%" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->\
	                                    <div align="center">\
	                                        <div style="border-top: 1px dotted #CCCCCC; width:100%; line-height:1px; height:1px; font-size:1px;">\
	                                            &nbsp;\
	                                        </div>\
	                                    </div><!--[if (mso)]></td></tr></table></td></tr></table><![endif]-->\
	                                </div><!--[if (!mso)&(!IE)]><!-->\
	                            </div><!--<![endif]-->\
	                        </div>\
	                    </div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->\
	                </div>\
	            </div>\
	        </div>\
	        <div style="background-color:transparent;">\
	            <div style="Margin: 0 auto;min-width: 320px;max-width: 620px;width: 620px;width: calc(31000% - 197780px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid">\
	                <div style="border-collapse: collapse;display: table;width: 100%;">\
	                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 620px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->\
	                    <!--[if (mso)|(IE)]><td align="center" width="620" style=" width:620px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
	                    <div class="col num12" style="min-width: 320px;max-width: 620px;width: 620px;width: calc(30000% - 185380px);background-color: transparent;">\
	                        <div style="background-color: transparent; width: 100% !important;">\
	                            <!--[if (!mso)&(!IE)]><!-->\
	                            <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">\
	                            <!--<![endif]-->\
	                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->\
	                                <div style="font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#71777D;line-height:120%; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">\
	                                	<div style="font-size:12px;line-height:14px;color:#71777D;font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;text-align:left;">\
		                                    <p style="margin: 0;font-size: 12px;line-height: 14px;text-align: center">\
		                                        <span style="text-decoration: underline; font-size: 22px; line-height: 26px;"><a href="'+link+'" target="_blank" style="line-height: 26px; font-size: 22px; color: #009BDD;">Review and validate my activity</a></span>\
		                                    </p>\
		                                </div>\
	                                </div><!--[if mso]></td></tr></table><![endif]-->\
	                                <!--[if (!mso)&(!IE)]><!-->\
	                            </div><!--<![endif]-->\
	                        </div>\
	                    </div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->\
	                </div>\
	            </div>\
	        </div>\
	        <div style="background-color:transparent;">\
	            <div style="Margin: 0 auto;min-width: 320px;max-width: 620px;width: 620px;width: calc(31000% - 197780px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid">\
	                <div style="border-collapse: collapse;display: table;width: 100%;">\
	                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 620px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->\
	                    <!--[if (mso)|(IE)]><td align="center" width="620" style=" width:620px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
	                    <div class="col num12" style="min-width: 320px;max-width: 620px;width: 620px;width: calc(30000% - 185380px);background-color: transparent;">\
	                        <div style="background-color: transparent; width: 100% !important;">\
	                            <!--[if (!mso)&(!IE)]><!-->\
	                            <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">\
	                            <!--<![endif]-->\
	                                <div style="padding-right: 10px; padding-left: 10px; padding-top: 15px; padding-bottom: 15px;">\
	                                    <!--[if (mso)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px;padding-left: 10px; padding-top: 15px; padding-bottom: 15px;"><table width="100%" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->\
	                                    <div align="center">\
	                                        <div style="border-top: 1px dotted #CCCCCC; width:100%; line-height:1px; height:1px; font-size:1px;">\
	                                            &nbsp;\
	                                        </div>\
	                                    </div><!--[if (mso)]></td></tr></table></td></tr></table><![endif]-->\
	                                </div><!--[if (!mso)&(!IE)]><!-->\
	                            </div><!--<![endif]-->\
	                        </div>\
	                    </div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->\
	                </div>\
	            </div>\
	        </div>\
	        <div style="background-color:transparent;">\
	            <div style="Margin: 0 auto;min-width: 320px;max-width: 620px;width: 620px;width: calc(31000% - 197780px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid">\
	                <div style="border-collapse: collapse;display: table;width: 100%;">\
	                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 620px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->\
	                    <!--[if (mso)|(IE)]><td align="center" width="620" style=" width:620px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
	                    <div class="col num12" style="min-width: 320px;max-width: 620px;width: 620px;width: calc(30000% - 185380px);background-color: transparent;">\
	                        <div style="background-color: transparent; width: 100% !important;">\
	                            <!--[if (!mso)&(!IE)]><!-->\
	                            <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">\
	                            <!--<![endif]-->\
	                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->\
	                                <div style="font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#555555;line-height:120%; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">\
	                                <div style="font-size:12px;line-height:14px;font-family:Montserrat, \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#555555;text-align:left;">\
	                                    <p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center">\
	                                            <span style="font-size: 12px; line-height: 14px; color: rgb(128, 128, 128);">Copyright &copy; 2017\
	                                            	<a href="https://opz.io" target="_blank" style="color:#009BDD;">Opz.io</a> - All rights reserved.&nbsp;\
	                                            </span>\
	                                            <br>\
	                                        </p>\
	                                        <p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center">&nbsp;<br></p>\
	                                        <p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center">\
	                                            <span style="font-size: 12px; line-height: 14px; color: rgb(128, 128, 128);">You are receiving this email because you are registered on Opz.io.</span>\
	                                        </p>\
	                                        <p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center">\
	                                            <span style="font-size: 12px; line-height: 14px; color: rgb(128, 128, 128);">If you think you received it by mistake, please ignore this email.</span>\
	                                        </p>\
	                                        <p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center">\
	                                            <span style="font-size: 12px; line-height: 14px; color: rgb(128, 128, 128);">\
	                                            	<a style="color:#71777D;color:#71777D;color:#71777D;color:#71777D;color:#71777D;text-decoration: underline; color: rgb(128, 128, 128);" href="https://opz.io" target="_blank" rel="noopener noreferrer">Unsubscribe</a>\
	                                            </span>\
	                                        </p>\
	                                    </div>\
	                                </div><!--[if mso]></td></tr></table><![endif]-->\
	                                <!--[if (!mso)&(!IE)]><!-->\
	                            </div><!--<![endif]-->\
	                        </div>\
	                    </div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->\
	                </div>\
	            </div>\
	        </div><!--[if (mso)|(IE)]></td></tr></table><![endif]-->\
	    </div><!--[if (mso)|(IE)]></div><![endif]-->\
	</body>';
}

buildEmptyReportEmail = function(title, projects, userId, dateString, link, total){
	console.log(title, projects)
	// var messageBody = 'Opz.io takes care of the tedious task of time tracking, providing you insights on your performance and allowing you to keep focused on your work.<br><br>(Link doesn\'t work? Copy here '+inviteLink+')';
	// var footer = 'You are receiving this email because you are registered on Opz.io. If you think you received it by mistake, please ignore this email.'

	return '<body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #FFFFFF">\
	    <!--[if IE]><div class="ie-browser"><![endif]-->\
	    <!--[if mso]><div class="mso-container"><![endif]-->\
	    <div class="nl-container" style="min-width: 320px;Margin: 0 auto;background-color: #FFFFFF">\
	        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #FFFFFF;"><![endif]-->\
	        <div style="background-color:transparent;">\
	            <div style="Margin: 0 auto;min-width: 320px;max-width: 620px;width: 620px;width: calc(31000% - 197780px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #009BDD;" class="block-grid two-up">\
	                <div style="border-collapse: collapse;display: table;width: 100%;">\
	                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 620px;"><tr class="layout-full-width" style="background-color:#009BDD;"><![endif]-->\
	                    <!--[if (mso)|(IE)]><td align="center" width="310" style=" width:310px; padding-right: 10px; padding-left: 10px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
	                    <div class="col num6" style="Float: left;max-width: 320px;min-width: 310px;width: 310px;width: calc(6510px - 1000%);background-color: #009BDD;">\
	                        <div style="background-color: transparent; width: 100% !important;">\
	                            <!--[if (!mso)&(!IE)]><!-->\
	                            <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 10px; padding-left: 10px;">\
	                            <!--<![endif]-->\
	                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->\
	                                <div style="color:#555555;line-height:120%;font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">\
	                                <div style="font-size:12px;line-height:14px;font-family:Montserrat, \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#555555;text-align:left;">\
	                                    <p style="margin: 0;font-size: 12px;line-height: 14px">\
	                                            <a href="https://opz.io" target="_blank" style="font-size: 36px; line-height:43px; color:rgb(255, 255, 255); text-decoration:none;">OPZ.IO</a>\
	                                        </p>\
	                                    </div>\
	                                </div><!--[if mso]></td></tr></table><![endif]-->\
	                                <!--[if (!mso)&(!IE)]><!-->\
	                            </div><!--<![endif]-->\
	                        </div>\
	                    </div>\
	                    <!--[if (mso)|(IE)]></td><td align="center" width="310" style=" width:310px; padding-right: 10px; padding-left: 10px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
	                    <div class="col num6" style="Float: left;max-width: 320px;min-width: 310px;width: 310px;width: calc(6510px - 1000%);background-color: #009BDD;">\
	                        <div style="background-color: transparent; width: 100% !important;">\
	                            <!--[if (!mso)&(!IE)]><!-->\
	                            <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 10px; padding-left: 10px;">\
	                            <!--<![endif]-->\
	                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 15px; padding-bottom: 15px;"><![endif]-->\
	                                <div style="font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#555555;line-height:120%; padding-right: 0px; padding-left: 0px; padding-top: 15px; padding-bottom: 15px;">\
	                                <div style="font-size:12px;line-height:14px;font-family:Montserrat, \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#555555;text-align:left;">\
	                                    <p style="margin: 0;font-size: 14px;line-height: 17px;text-align: right">\
	                                            <span style="font-size: 20px; line-height: 34px; color: rgb(255, 255, 255);"><em>'+ dateString +'</em></span>\
	                                        </p>\
	                                    </div>\
	                                </div><!--[if mso]></td></tr></table><![endif]-->\
	                                <!--[if (!mso)&(!IE)]><!-->\
	                            </div><!--<![endif]-->\
	                        </div>\
	                    </div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->\
	                </div>\
	            </div>\
	        </div>\
	        <div style="background-color:transparent;">\
	            <div style="Margin: 0 auto;min-width: 320px;max-width: 620px;width: 620px;width: calc(31000% - 197780px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid">\
	                <div style="border-collapse: collapse;display: table;width: 100%;">\
	                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 620px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->\
	                    <!--[if (mso)|(IE)]><td align="center" width="620" style=" width:620px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
	                    <div class="col num12" style="min-width: 320px;max-width: 620px;width: 620px;width: calc(30000% - 185380px);background-color: transparent;">\
	                        <div style="background-color: transparent; width: 100% !important;">\
	                            <!--[if (!mso)&(!IE)]><!-->\
	                            <div style= "border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">\
	                            <!--<![endif]-->\
	                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 15px; padding-bottom: 20px;"><![endif]-->\
	                                <div style= "font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#71777D;line-height:120%; padding-right: 10px; padding-left: 10px; padding-top: 15px; padding-bottom: 20px;">\
	                                <div style= "font-family:Montserrat, \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;font-size:12px;line-height:14px;color:#71777D;text-align:left;">\
	                                    <p style="margin: 0;font-size: 12px;line-height: 14px;text-align: center">\
	                                            <span style="font-size: 18px; line-height: 21px; color: rgb(51, 51, 51);">'+ title +'</span>\
	                                        </p>\
	                                    </div>\
	                                </div><!--[if mso]></td></tr></table><![endif]-->\
	                                <!--[if (!mso)&(!IE)]><!-->\
	                            </div><!--<![endif]-->\
	                        </div>\
	                    </div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->\
	                </div>\
	            </div>\
	        </div>\
	        <div style="background-color:transparent;">\
	            <div style="Margin: 0 auto;min-width: 320px;max-width: 620px;width: 620px;width: calc(31000% - 197780px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid mixed-two-up">\
	                <div style="border-collapse: collapse;display: table;width: 100%;">\
	                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 620px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->\
	                    <!--[if (mso)|(IE)]><td align="center" width="413" style=" width:413px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
	                    <div class="col num8" style="Float: left;min-width: 320px;max-width: 408px;width: 413px;width: calc(9800% - 62312px);background-color: transparent;">\
	                        <div style="background-color: transparent; width: 100% !important;">\
	                            <!--[if (!mso)&(!IE)]><!-->\
	                            <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">\
	                            <!--<![endif]-->\
	                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->\
	                                <div style="font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#FFFFFF;line-height:120%; padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;">\
	                                <div style="font-family:Montserrat, \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;font-size:12px;line-height:14px;color:#FFFFFF;text-align:left;">\
	                                    <p style="margin: 0;font-size: 12px;line-height: 14px">\
	                                            <span style="color: rgb(51, 51, 51); font-size: 20px; line-height: 22px;">'+ projects +'</span>\
	                                        </p>\
	                                    </div>\
	                                </div><!--[if mso]></td></tr></table><![endif]-->\
	                                <!--[if (!mso)&(!IE)]><!-->\
	                            </div><!--<![endif]-->\
	                        </div>\
	                    </div>\
	                    <!--[if (mso)|(IE)]></td><td align="center" width="207" style=" width:207px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
	                    <div class="col num4" style="Float: left;max-width: 320px;min-width: 204px;width: 207px;width: calc(72124px - 11600%);background-color: transparent;">\
	                        <div style="background-color: transparent; width: 100% !important;">\
	                            <!--[if (!mso)&(!IE)]><!-->\
	                            <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">\
	                            <!--<![endif]-->\
	                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->\
	                                <div style="font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#FFFFFF;line-height:120%; padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;">\
	                                <div style="font-size:12px;line-height:14px;font-family:Montserrat, \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#FFFFFF;text-align:left;">\
	                                    <p style="margin: 0;font-size: 14px;line-height: 17px">\
	                                            <span style="font-size: 14px; line-height: 16px; color: rgb(51, 51, 51);"><img src="https://www.opz.io/images/bot/confused.png" alt="" style="width: 150px; height: 100%;" /></span>\
	                                        </p>\
	                                    </div>\
	                                </div><!--[if mso]></td></tr></table><![endif]-->\
	                                <!--[if (!mso)&(!IE)]><!-->\
	                            </div><!--<![endif]-->\
	                        </div>\
	                    </div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->\
	                </div>\
	            </div>\
	        </div>\
	        <div style="background-color:transparent;">\
	            <div style="Margin: 0 auto;min-width: 320px;max-width: 620px;width: 620px;width: calc(31000% - 197780px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid">\
	                <div style="border-collapse: collapse;display: table;width: 100%;">\
	                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 620px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->\
	                    <!--[if (mso)|(IE)]><td align="center" width="620" style=" width:620px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
	                    <div class="col num12" style="min-width: 320px;max-width: 620px;width: 620px;width: calc(30000% - 185380px);background-color: transparent;">\
	                        <div style="background-color: transparent; width: 100% !important;">\
	                            <!--[if (!mso)&(!IE)]><!-->\
	                            <div style= "border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">\
	                            <!--<![endif]-->\
	                                <div style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">\
	                                    <!--[if (mso)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px;padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><table width="100%" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->\
	                                    <div align="center">\
	                                        <div style="border-top: 1px dotted #CCCCCC; width:100%; line-height:1px; height:1px; font-size:1px;">&nbsp;</div>\
	                                    </div><!--[if (mso)]></td></tr></table></td></tr></table><![endif]-->\
	                                </div><!--[if (!mso)&(!IE)]><!-->\
	                            </div><!--<![endif]-->\
	                        </div>\
	                    </div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->\
	                </div>\
	            </div>\
	        </div>\
	        <div style="background-color:transparent;">\
	            <div style="Margin: 0 auto;min-width: 320px;max-width: 620px;width: 620px;width: calc(31000% - 197780px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid">\
	                <div style="border-collapse: collapse;display: table;width: 100%;">\
	                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 620px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->\
	                    <!--[if (mso)|(IE)]><td align="center" width="620" style=" width:620px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
	                    <div class="col num12" style="min-width: 320px;max-width: 620px;width: 620px;width: calc(30000% - 185380px);background-color: transparent;">\
	                        <div style="background-color: transparent; width: 100% !important;">\
                                <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">\
                                <!--<![endif]-->\
                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->\
                                    <div style="font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#71777D;line-height:120%; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">\
                                    	<div style="font-size:16px;line-height:14px;color:#71777D;font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;text-align:left;">\
    	                                    <p style="margin: 0;font-size: 12px;line-height: 14px;text-align: center">\
    	                                        <span style=" font-size: 16px; line-height: 22px;"><p style="line-height:18px;color: rgb(51, 51, 51);">'+ link +'</p></span>\
    	                                    </p>\
    	                                </div>\
                                    </div><!--[if mso]></td></tr></table><![endif]-->\
                                    <!--[if (!mso)&(!IE)]><!-->\
                                </div><!--<![endif]-->\
	                        </div>\
	                    </div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->\
	                </div>\
	            </div>\
	        </div>\
	        <div style="background-color:transparent;">\
	            <div style="Margin: 0 auto;min-width: 320px;max-width: 620px;width: 620px;width: calc(31000% - 197780px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid">\
	                <div style="border-collapse: collapse;display: table;width: 100%;">\
	                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 620px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->\
	                    <!--[if (mso)|(IE)]><td align="center" width="620" style=" width:620px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
	                    <div class="col num12" style="min-width: 320px;max-width: 620px;width: 620px;width: calc(30000% - 185380px);background-color: transparent;">\
	                        <div style="background-color: transparent; width: 100% !important;">\
	                            <!--[if (!mso)&(!IE)]><!-->\
	                            <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">\
	                            <!--<![endif]-->\
	                                <div style="padding-right: 10px; padding-left: 10px; padding-top: 15px; padding-bottom: 15px;">\
	                                    <!--[if (mso)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px;padding-left: 10px; padding-top: 15px; padding-bottom: 15px;"><table width="100%" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->\
	                                    <div align="center">\
	                                        <div style="border-top: 1px dotted #CCCCCC; width:100%; line-height:1px; height:1px; font-size:1px;">\
	                                            &nbsp;\
	                                        </div>\
	                                    </div><!--[if (mso)]></td></tr></table></td></tr></table><![endif]-->\
	                                </div><!--[if (!mso)&(!IE)]><!-->\
	                            </div><!--<![endif]-->\
	                        </div>\
	                    </div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->\
	                </div>\
	            </div>\
	        </div>\
	        <div style="background-color:transparent;">\
	            <div style="Margin: 0 auto;min-width: 320px;max-width: 620px;width: 620px;width: calc(31000% - 197780px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid">\
	                <div style="border-collapse: collapse;display: table;width: 100%;">\
	                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 620px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->\
	                    <!--[if (mso)|(IE)]><td align="center" width="620" style=" width:620px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
	                    <div class="col num12" style="min-width: 320px;max-width: 620px;width: 620px;width: calc(30000% - 185380px);background-color: transparent;">\
	                        <div style="background-color: transparent; width: 100% !important;">\
	                            <!--[if (!mso)&(!IE)]><!-->\
	                            <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">\
	                            <!--<![endif]-->\
	                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->\
	                                <div style="font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#71777D;line-height:120%; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">\
	                                	<div style="font-size:12px;line-height:14px;color:#71777D;font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;text-align:left;">\
		                                    <p style="margin: 0;font-size: 12px;line-height: 14px;text-align: center">\
		                                        <span style="text-decoration: underline; font-size: 22px; line-height: 26px;"><a href="https://www.opz.io" target="_blank" style="line-height: 26px; font-size: 22px; color: #009BDD;">Go to Opz.io</a></span>\
		                                    </p>\
		                                </div>\
	                                </div><!--[if mso]></td></tr></table><![endif]-->\
	                                <!--[if (!mso)&(!IE)]><!-->\
	                            </div><!--<![endif]-->\
	                        </div>\
	                    </div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->\
	                </div>\
	            </div>\
	        </div>\
	        <div style="background-color:transparent;">\
	            <div style="Margin: 0 auto;min-width: 320px;max-width: 620px;width: 620px;width: calc(31000% - 197780px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid">\
	                <div style="border-collapse: collapse;display: table;width: 100%;">\
	                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 620px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->\
	                    <!--[if (mso)|(IE)]><td align="center" width="620" style=" width:620px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
	                    <div class="col num12" style="min-width: 320px;max-width: 620px;width: 620px;width: calc(30000% - 185380px);background-color: transparent;">\
	                        <div style="background-color: transparent; width: 100% !important;">\
	                            <!--[if (!mso)&(!IE)]><!-->\
	                            <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">\
	                            <!--<![endif]-->\
	                                <div style="padding-right: 10px; padding-left: 10px; padding-top: 15px; padding-bottom: 15px;">\
	                                    <!--[if (mso)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px;padding-left: 10px; padding-top: 15px; padding-bottom: 15px;"><table width="100%" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->\
	                                    <div align="center">\
	                                        <div style="border-top: 1px dotted #CCCCCC; width:100%; line-height:1px; height:1px; font-size:1px;">\
	                                            &nbsp;\
	                                        </div>\
	                                    </div><!--[if (mso)]></td></tr></table></td></tr></table><![endif]-->\
	                                </div><!--[if (!mso)&(!IE)]><!-->\
	                            </div><!--<![endif]-->\
	                        </div>\
	                    </div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->\
	                </div>\
	            </div>\
	        </div>\
	        <div style="background-color:transparent;">\
	            <div style="Margin: 0 auto;min-width: 320px;max-width: 620px;width: 620px;width: calc(31000% - 197780px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid">\
	                <div style="border-collapse: collapse;display: table;width: 100%;">\
	                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 620px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->\
	                    <!--[if (mso)|(IE)]><td align="center" width="620" style=" width:620px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
	                    <div class="col num12" style="min-width: 320px;max-width: 620px;width: 620px;width: calc(30000% - 185380px);background-color: transparent;">\
	                        <div style="background-color: transparent; width: 100% !important;">\
	                            <!--[if (!mso)&(!IE)]><!-->\
	                            <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">\
	                            <!--<![endif]-->\
	                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->\
	                                <div style="font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#555555;line-height:120%; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">\
	                                <div style="font-size:12px;line-height:14px;font-family:Montserrat, \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#555555;text-align:left;">\
	                                    <p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center">\
	                                            <span style="font-size: 12px; line-height: 14px; color: rgb(128, 128, 128);">Copyright &copy; 2017\
	                                            	<a href="https://opz.io" target="_blank" style="color:#009BDD;">Opz.io</a> - All rights reserved.&nbsp;\
	                                            </span>\
	                                            <br>\
	                                        </p>\
	                                        <p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center">&nbsp;<br></p>\
	                                        <p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center">\
	                                            <span style="font-size: 12px; line-height: 14px; color: rgb(128, 128, 128);">You are receiving this email because you are registered on Opz.io.</span>\
	                                        </p>\
	                                        <p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center">\
	                                            <span style="font-size: 12px; line-height: 14px; color: rgb(128, 128, 128);">If you think you received it by mistake, please ignore this email.</span>\
	                                        </p>\
	                                        <p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center">\
	                                            <span style="font-size: 12px; line-height: 14px; color: rgb(128, 128, 128);">\
	                                            	<a style="color:#71777D;color:#71777D;color:#71777D;color:#71777D;color:#71777D;text-decoration: underline; color: rgb(128, 128, 128);" href="https://opz.io" target="_blank" rel="noopener noreferrer">Unsubscribe</a>\
	                                            </span>\
	                                        </p>\
	                                    </div>\
	                                </div><!--[if mso]></td></tr></table><![endif]-->\
	                                <!--[if (!mso)&(!IE)]><!-->\
	                            </div><!--<![endif]-->\
	                        </div>\
	                    </div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->\
	                </div>\
	            </div>\
	        </div><!--[if (mso)|(IE)]></td></tr></table><![endif]-->\
	    </div><!--[if (mso)|(IE)]></div><![endif]-->\
	</body>';
}
