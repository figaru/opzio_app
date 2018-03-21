setEventStyles = function(event){
	try{
		var category = event.category.category;
		var label = event.category.label;
	}
	catch(err){
		var category = 'other';
		var label = 'Other';
	}

	var sourceIcon = 'fa-laptop';
	var sourceTooltip = 'Source: computer';
	var icon = 'fa-question-circle-o';
	var color = 'color-'+category;

	//console.log(event)

	switch(event.type){
		case 'code':
			sourceTooltip = 'Source: code editor';
			break;
		case 'operative_system':
			sourceIcon = 'fa-laptop';
			sourceTooltip = 'Source: computer';
			break;

		case 'browser':
			sourceIcon = 'fa-globe';
			sourceTooltip = 'Source: browser';
			break;
	}

	//Domain specific icons (activity type)
	switch(event.domain){
		case 'EXCEL':
			icon = 'fa-excel-o';
			break;

		case 'amazon.com':
			icon = 'fa-amazon'
			break;

		case 'facebook.com':
			icon = 'fa-facebook-official';
			color = 'color-facebook';
			break;

		case 'messenger.com':
			icon = 'fa-comment-o';
			color = 'color-messenger';
			break;
		
		case 'youtube.com':
			icon = 'fa-youtube-square';
			color = 'color-youtube';
			break;

		case 'codepen.io':
			icon = 'fa-codepen'
			break;

		case 'github.com':
			icon = 'fa-github';
			color = 'color-github';
			break;

		case 'bitbucket.com':
			icon = 'fa-bitbucket-square'
			break;

		case 'news.ycombinator.com':
			icon = 'fa-hacker-news'
			break;

		case 'instagram.com':
			icon = 'fa-instagram'
			break;

		case 'quora.com':
			icon = 'fa-quora';
			color = 'color-quora';
			break;

		case 'stackoverflow.com':
			icon = 'fa-stack-overflow';
			color = 'color-stackoverflow';
			break;

		case 'linkedin.com':
			icon = 'fa-linkedin';
			color = 'color-linkedin';
			break;

		case 'spotify.com':
			icon = 'fa-spotify'
			break;

		case 'trello.com':
			icon = 'fa-trello';
			color = 'color-trello';
			break;

		case 'paypal.com':
			icon = 'fa-paypal'
			break;

		case 'dribbble.com':
			icon = 'fa-dribbble';
			color = 'color-dribbble';
			break;

		case 'soundcloud.com':
			icon = 'fa-soundcloud'
			break;

		case 'pinterest.com':
			icon = 'fa-pinterest'
			break;

		case 'slack.com':
			icon = 'fa-slack'
			break;

		case 'mail.google.com':
			icon = 'fa-envelope-square';
			color = 'color-gmail';
			break;

		case 'google.com':
		case 'google.pt':
		case 'google.fr':
		case 'google.co.uk':
		case 'google.us':
		case 'google.in':
		case 'google.de':
		case 'google.nl':
			icon = 'fa-google';
			color = 'color-google';
			break;

		case 'wikipedia.org':
			icon = 'fa-wikipedia'
			break;

		case 'medium.com':
			icon = 'fa-medium';
			color = 'color-medium';
			break;

		case 'dropbox.com':
			icon = 'fa-dropbox'
			break;

		default:
			//Set generic icons
			switch(category){
				case 'development':
					icon = 'fa-code';
					break;
				case 'marketing':
					icon = 'fa-bullhorn';
					break;
				case 'communication':
					icon = 'fa-envelope-square';
					break;
				case 'management':
					icon = 'fa-bank';
					break;
				case 'WORD':
				case 'documentation':
					icon = 'fa-file-word-o';
					break;
				case 'settings':
					icon = 'fa-cogs';
					break;
				case 'social':			
					icon = 'fa-comments';
					break;
				case 'leisure':
					icon = 'fa-coffee';
					break;
				case 'financial':
					icon = 'fa-dollar';
					break;
				case 'shopping':
					icon = 'fa-shopping-basket';
					break;
				case 'technical':
					icon = 'fa-cogs';
					break;
				case 'travel':
					icon = 'fa-plane';
					break;
				case 'tools':
					icon = 'fa-wrench';
					break;
				case 'study':
					icon = 'fa-book';
					break;
				case 'inspiration':
					icon = 'fa-lightbulb-o';
					break;
				case 'search':
					icon = 'fa-search';
					break;
				case 'testing':
					icon = 'fa-bug';
					break;
				case 'miscelaneous':
					icon = 'fa-random';
					break;
				case 'other':
					icon = 'fa-question-circle-o';
					break;
			}
			break;
	}

	//Specific domains 
	//Catch Slack
	if(event.domain.match(/\w+.slack.com/g) !== null){
		icon = 'fa-slack';
		color = 'color-slack';
	}

	//if(){}

	return {
		'sourceIcon': sourceIcon,
		'sourceTooltip': sourceTooltip,
		'activityTooltip': label,
		'icon': icon,
		'color': color
	};
}