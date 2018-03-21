buildUserReport = function(user, dateRange, scheduledDate){
	var callData = {
		'userId': user._id,
		'startDate': dateRange.startDate,
		'endDate': dateRange.endDate,
		'range': dateRange.range,
		'offset': scheduledDate.utcOffset() / 60,
	}

	var range = dateRange.range;

	Meteor.call('users.getUserReport', callData, range, function(err, data){
		
		var options = {
			'detail': 'all',
			'startDate': dateRange.startDate,
			'endDate': dateRange.endDate,
			'range': dateRange.range,
			'dataContext': 'user',
			'userId': user._id
		}

		// console.log('--- return report data ---');
		// console.log(data);
		
		var missingData = [
			'<b style="font-size: 24px;">Bummer!</b><br><br>Seems you haven\'t logged any time!<br>',
			'<b style="font-size: 24px;">Oops!</b><br><br>We couldn\'t find any logged time!<br>',
			'<b style="font-size: 24px;">Yikes!</b><br><br>There\'s no registered time!<br>',
			'<b style="font-size: 24px;">Wowie!</b><br><br>Seems we couldn\'t find any registered time!<br>'
		]

		if(range === 'day'){
			var dateString = moment(callData.startDate).format("DD MMM 'YY");
			var reportTitle = 'Daily report';
		}
		else if(range === 'week'){
			var dateString = moment(callData.startDate).format("DD") +' to '+ moment(callData.endDate).format("DD MMM 'YY");
			var reportTitle = 'Past 7 days report';
		}
		else if(range === 'month'){
			var dateString = moment(callData.startDate).format("MMM 'YY");
			var reportTitle = 'Monthly report';
		}


		var primaryProjects = [],
			secondaryData = '',
			link = 'https://www.opz.io/user/'+user._id+'/calendar/fullscreen#listDay?start='+callData.startDate+'&end='+callData.endDate,
			emailBody = '',
			summary = ''
			totalTime = 0;

		if(data.current.length > 0){
			totalTime = data.current[0].totalTime;
			var validTime = data.current[0].validTime;
			var avgTime = data.current[0].avgTime;
			var margin = avgTime - avgTime*0.5;


			if(totalTime > 0){
				var currentProjects = data.current[0].projects;

				//Set worked time and valid % for period
				var validPercent = Math.round(validTime / totalTime * 100);
				var otherTime = { 'Personal': 0, 'Other': 0 }

				//Determine top and secondary projects
				for(var i=0; i<currentProjects.length; i++){
					//console.log(currentProjects[i])
					
					if(currentProjects[i].totalTime >= avgTime && currentProjects[i].name !== 'Personal'){
						primaryProjects.push(currentProjects[i])
					}
					else if(currentProjects[i].totalTime >= margin && currentProjects[i].totalTime < avgTime){
						otherTime['Other'] += currentProjects[i].totalTime;
					}
					if(currentProjects[i].name === 'Personal'){
						otherTime['Personal'] += currentProjects[i].totalTime;
					}
				}

				if(primaryProjects.length > 0){
					for(var i=0; i<primaryProjects.length; i++){
						emailBody += '<div style="background-color:transparent;">\
										    <div style="Margin: 0 auto;min-width: 320px;max-width: 620px;width: 620px;width: calc(31000% - 197780px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #FFFFFF;" class="block-grid mixed-two-up">\
										        <div style="border-collapse: collapse;display: table;width: 100%;">\
										            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 620px;"><tr class="layout-full-width" style="background-color:#FFFFFF;"><![endif]-->\
										            <!--[if (mso)|(IE)]><td align="center" width="413" style=" width:413px; padding-right: 0px; padding-left: 0px; padding-top:15px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
										            <div class="col num8" style="Float: left;min-width: 320px;max-width: 408px;width: 413px;width: calc(9800% - 62312px);background-color: #FFFFFF;">\
										                <div style="background-color: transparent; width: 100% !important;">\
										                    <!--[if (!mso)&(!IE)]><!-->\
										                    <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:15px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">\
										                    <!--<![endif]-->\
										                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->\
										                        <div style="font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#000000;line-height:120%; padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;">\
										                        <div style="font-family:Montserrat, \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;font-size:12px;line-height:14px;color:#000000;text-align:left;">\
										                            <p style="margin: 0;font-size: 12px;line-height: 14px; text-transform:uppercase;">\
										                                    <b>'+ primaryProjects[i].name +'</b>\
										                                </p>\
										                            </div>\
										                        </div><!--[if mso]></td></tr></table><![endif]-->\
										                        <!--[if (!mso)&(!IE)]><!-->\
										                    </div><!--<![endif]-->\
										                </div>\
										            </div>\
										            <!--[if (mso)|(IE)]></td><td align="center" width="207" style=" width:207px; padding-right: 0px; padding-left: 0px; padding-top:15px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
										            <div class="col num4" style="Float: left;max-width: 320px;min-width: 204px;width: 207px;width: calc(72124px - 11600%);background-color: #FFFFFF;">\
										                <div style="background-color: transparent; width: 100% !important;">\
										                    <!--[if (!mso)&(!IE)]><!-->\
										                    <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:15px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">\
										                    <!--<![endif]-->\
										                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->\
										                        <div style="font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#000000;line-height:120%; padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;">\
										                        <div style="font-family:Montserrat, \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;font-size:12px;line-height:14px;color:#000000;text-align:left;">\
										                            <p style="margin: 0;font-size: 12px;line-height: 14px">\
										                                    '+ getStringFromEpoch(currentProjects[i].totalTime) +'\
										                                </p>\
										                            </div>\
										                        </div><!--[if mso]></td></tr></table><![endif]-->\
										                        <!--[if (!mso)&(!IE)]><!-->\
										                    </div><!--<![endif]-->\
										                </div>\
										            </div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->\
										        </div>\
										    </div>\
										</div>';
					}
				}

				if(otherTime['Personal'] > 0 || otherTime['Other'] > 0){
					secondaryData += '<div style="background-color:transparent;">\
							            <div style="Margin: 10px auto 0;min-width: 320px;max-width: 620px;width: 620px;width: calc(31000% - 197780px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #f5f5f5;" class="block-grid mixed-two-up">\
							                <div style="border-collapse: collapse;display: table;width: 100%;">\
							                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 620px;"><tr class="layout-full-width" style="background-color:#f5f5f5;"><![endif]-->\
							                    <!--[if (mso)|(IE)]><td align="center" width="413" style=" width:413px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
							                    <div class="col num8" style="Float: left;min-width: 320px;max-width: 408px;width: 413px;width: calc(9800% - 62312px);background-color: #f5f5f5;">\
							                        <div style="background-color: transparent; width: 100% !important;">\
							                            <!--[if (!mso)&(!IE)]><!-->\
							                            <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">\
							                            <!--<![endif]-->\
							                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->\
							                                <div style="font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#FFFFFF;line-height:120%; padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;">\
							                                <div style="font-family:Montserrat, \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;font-size:12px;line-height:14px;color:#FFFFFF;text-align:left;">\
							                                    <p style="margin: 0;font-size: 12px;line-height: 14px">\
							                                            <span style="color: rgb(51, 51, 51); font-size: 12px; line-height: 14px;">OTHER</span>\
							                                        </p>\
							                                    </div>\
							                                </div><!--[if mso]></td></tr></table><![endif]-->\
							                                <!--[if (!mso)&(!IE)]><!-->\
							                            </div><!--<![endif]-->\
							                        </div>\
							                    </div>\
							                    <!--[if (mso)|(IE)]></td><td align="center" width="207" style=" width:207px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
							                    <div class="col num4" style="Float: left;max-width: 320px;min-width: 204px;width: 207px;width: calc(72124px - 11600%);background-color: #f5f5f5;">\
							                        <div style="background-color: transparent; width: 100% !important;">\
							                            <!--[if (!mso)&(!IE)]><!-->\
							                            <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">\
							                            <!--<![endif]-->\
							                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->\
							                                <div style="font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#FFFFFF;line-height:120%; padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;">\
							                                <div style="font-size:12px;line-height:14px;font-family:Montserrat, \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#FFFFFF;text-align:left;">\
							                                    <p style="margin: 0;font-size: 14px;line-height: 17px">\
							                                            <span style="font-size: 14px; line-height: 16px; color: rgb(51, 51, 51);"></span>\
							                                        </p>\
							                                    </div>\
							                                </div><!--[if mso]></td></tr></table><![endif]-->\
							                                <!--[if (!mso)&(!IE)]><!-->\
							                            </div><!--<![endif]-->\
							                        </div>\
							                    </div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->\
							                </div>\
							            </div>\
							        </div>';

			        if(otherTime['Personal'] > 0){
			        	secondaryData += '<div style="background-color:transparent;">\
			        				    <div style="Margin: 0 auto;min-width: 320px;max-width: 620px;width: 620px;width: calc(31000% - 197780px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #FFFFFF;" class="block-grid mixed-two-up">\
			        				        <div style="border-collapse: collapse;display: table;width: 100%;">\
			        				            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 620px;"><tr class="layout-full-width" style="background-color:#FFFFFF;"><![endif]-->\
			        				            <!--[if (mso)|(IE)]><td align="center" width="413" style=" width:413px; padding-right: 0px; padding-left: 0px; padding-top:15px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
			        				            <div class="col num8" style="Float: left;min-width: 320px;max-width: 408px;width: 413px;width: calc(9800% - 62312px);background-color: #FFFFFF;">\
			        				                <div style="background-color: transparent; width: 100% !important;">\
			        				                    <!--[if (!mso)&(!IE)]><!-->\
			        				                    <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:15px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">\
			        				                    <!--<![endif]-->\
			        				                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->\
			        				                        <div style="font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#000000;line-height:120%; padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;">\
			        				                        <div style="font-family:Montserrat, \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;font-size:12px;line-height:14px;color:#000000;text-align:left;">\
			        				                            <p style="margin: 0;font-size: 12px;line-height: 14px; text-transform:uppercase;">\
			        				                                    Personal activity\
			        				                                </p>\
			        				                            </div>\
			        				                        </div><!--[if mso]></td></tr></table><![endif]-->\
			        				                        <!--[if (!mso)&(!IE)]><!-->\
			        				                    </div><!--<![endif]-->\
			        				                </div>\
			        				            </div>\
			        				            <!--[if (mso)|(IE)]></td><td align="center" width="207" style=" width:207px; padding-right: 0px; padding-left: 0px; padding-top:15px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
			        				            <div class="col num4" style="Float: left;max-width: 320px;min-width: 204px;width: 207px;width: calc(72124px - 11600%);background-color: #FFFFFF;">\
			        				                <div style="background-color: transparent; width: 100% !important;">\
			        				                    <!--[if (!mso)&(!IE)]><!-->\
			        				                    <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:15px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">\
			        				                    <!--<![endif]-->\
			        				                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->\
			        				                        <div style="font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#000000;line-height:120%; padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;">\
			        				                        <div style="font-family:Montserrat, \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;font-size:12px;line-height:14px;color:#000000;text-align:left;">\
			        				                            <p style="margin: 0;font-size: 12px;line-height: 14px">\
			        				                                    '+ getStringFromEpoch(otherTime['Personal']) +'\
			        				                                </p>\
			        				                            </div>\
			        				                        </div><!--[if mso]></td></tr></table><![endif]-->\
			        				                        <!--[if (!mso)&(!IE)]><!-->\
			        				                    </div><!--<![endif]-->\
			        				                </div>\
			        				            </div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->\
			        				        </div>\
			        				    </div>\
			        				</div>';
			        }
			        if(otherTime['Other'] > 0){
			        	secondaryData += '<div style="background-color:transparent;">\
			        				    <div style="Margin: 0 auto;min-width: 320px;max-width: 620px;width: 620px;width: calc(31000% - 197780px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #FFFFFF;" class="block-grid mixed-two-up">\
			        				        <div style="border-collapse: collapse;display: table;width: 100%;">\
			        				            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 620px;"><tr class="layout-full-width" style="background-color:#FFFFFF;"><![endif]-->\
			        				            <!--[if (mso)|(IE)]><td align="center" width="413" style=" width:413px; padding-right: 0px; padding-left: 0px; padding-top:15px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
			        				            <div class="col num8" style="Float: left;min-width: 320px;max-width: 408px;width: 413px;width: calc(9800% - 62312px);background-color: #FFFFFF;">\
			        				                <div style="background-color: transparent; width: 100% !important;">\
			        				                    <!--[if (!mso)&(!IE)]><!-->\
			        				                    <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:15px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">\
			        				                    <!--<![endif]-->\
			        				                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->\
			        				                        <div style="font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#000000;line-height:120%; padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;">\
			        				                        <div style="font-family:Montserrat, \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;font-size:12px;line-height:14px;color:#000000;text-align:left;">\
			        				                            <p style="margin: 0;font-size: 12px;line-height: 14px; text-transform:uppercase;">\
			        				                                    Other activities\
			        				                                </p>\
			        				                            </div>\
			        				                        </div><!--[if mso]></td></tr></table><![endif]-->\
			        				                        <!--[if (!mso)&(!IE)]><!-->\
			        				                    </div><!--<![endif]-->\
			        				                </div>\
			        				            </div>\
			        				            <!--[if (mso)|(IE)]></td><td align="center" width="207" style=" width:207px; padding-right: 0px; padding-left: 0px; padding-top:15px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->\
			        				            <div class="col num4" style="Float: left;max-width: 320px;min-width: 204px;width: 207px;width: calc(72124px - 11600%);background-color: #FFFFFF;">\
			        				                <div style="background-color: transparent; width: 100% !important;">\
			        				                    <!--[if (!mso)&(!IE)]><!-->\
			        				                    <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:15px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">\
			        				                    <!--<![endif]-->\
			        				                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->\
			        				                        <div style="font-family:\'Montserrat\', \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;color:#000000;line-height:120%; padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;">\
			        				                        <div style="font-family:Montserrat, \'Trebuchet MS\', \'Lucida Grande\', \'Lucida Sans Unicode\', \'Lucida Sans\', Tahoma, sans-serif;font-size:12px;line-height:14px;color:#000000;text-align:left;">\
			        				                            <p style="margin: 0;font-size: 12px;line-height: 14px">\
			        				                                    '+ getStringFromEpoch(otherTime['Other']) +'\
			        				                                </p>\
			        				                            </div>\
			        				                        </div><!--[if mso]></td></tr></table><![endif]-->\
			        				                        <!--[if (!mso)&(!IE)]><!-->\
			        				                    </div><!--<![endif]-->\
			        				                </div>\
			        				            </div><!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->\
			        				        </div>\
			        				    </div>\
			        				</div>';
			        }
				}

			}
			else{
				randIndex = Math.floor(Math.random() * (missingData.length - 1));
				emailBody += '<p>'+missingData[randIndex]+'</p>'
			}
		}
		else{
			randIndex = Math.floor(Math.random() * (missingData.length - 1));
			emailBody = missingData[randIndex];
			secondaryData = user._id;
			if(range === 'day'){
				link = 'If you think there\'s some tracking issue, check your <a href="https://www.opz.io/user/'+user._id+'/settings" target="_blank" style="color: #009BDD;">plugin settings</a> to make sure these are active.<br><br>If you took the day off then kindly ignore this email 🙂';
			}
			else{
				link = 'If you think there\'s some tracking issue, check your <a href="https://www.opz.io/user/'+user._id+'/settings" target="_blank" style="color: #009BDD;">plugin settings</a> to make sure these are active.<br><br>If you were on vacation (sorry for bothering!), simply ignore this email 🙂';
			}
		}

		Meteor.call('emails.sendReport', user.emails[0].address, reportTitle, emailBody, secondaryData, dateString, link, totalTime);

	});
}

/*

INTROS:
- Your top allocations are:
- You split your day as follows:
- You primary focus for the day was

*/