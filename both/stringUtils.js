/*
s - string
n - size to keep
r - trunc starting from end
*/
truncString = function(s, n, r){
	if(s === null){ return s; }
	
	if(r){
		return (s.length-n > n) ? '...'+s.substr(s.length-n-1, s.length) : s;
	}
	else{
    	return (s.length > n) ? s.substr(0,n-1)+'...' : s;
	}
}

capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

isVowel = function(s) {
	return (/^[aeiou]$/i).test(s);
}

getDomain = function(url){
	var domain;
	//find & remove protocol (http, ftp, etc.) and get domain
	//console.log(url)
	if(url === null){ return url; }

	if (url.indexOf("://") > -1) {
		domain = url.split('/')[2];
	}
	else {
		if(url.split('/')[0] !== ''){
			domain = url.split('/')[0];
			//find & remove protocol
		}
		//Else, we're dealing with a file path, ignore first empty "/"
		else{
			domain = url.split('/');
			domain.splice(0,1);
			domain = domain.join('/')
		}
	}
	domain = domain.replace(/https:\/\/|http:\/\/|ftp:\/\/|www\d*\./g, '');

	return domain;
}

/*
 * From http://geeklad.com/remove-stop-words-in-javascript
 * String method to remove stop words
 * Written by GeekLad http://geeklad.com
 * Stop words obtained from http://www.lextek.com/manuals/onix/stopwords1.html
 *   Usage: string_variable.removeStopWords();
 *   Output: The original String with stop words removed
 */
String.prototype.removeStopWords = function() {
	var x;
	var y;
	var word;
	var stop_word;
	var regex_str;
	var regex;
	var cleansed_string = this.valueOf();
	var stop_words = new Array(
	    'a',
	    'about',
	    'above',
	    'across',
	    'after',
	    'again',
	    'against',
	    'all',
	    'almost',
	    'alone',
	    'along',
	    'already',
	    'also',
	    'although',
	    'always',
	    'among',
	    'an',
	    'and',
	    'another',
	    'any',
	    'anybody',
	    'anyone',
	    'anything',
	    'anywhere',
	    'are',
	    'area',
	    'areas',
	    'around',
	    'as',
	    'ask',
	    'asked',
	    'asking',
	    'asks',
	    'at',
	    'away',
	    'b',
	    'back',
	    'backed',
	    'backing',
	    'backs',
	    'be',
	    'became',
	    'because',
	    'become',
	    'becomes',
	    'been',
	    'before',
	    'began',
	    'behind',
	    'being',
	    'beings',
	    'best',
	    'better',
	    'between',
	    'big',
	    'both',
	    'but',
	    'by',
	    'c',
	    'came',
	    'can',
	    'cannot',
	    'case',
	    'cases',
	    'certain',
	    'certainly',
	    'clear',
	    'clearly',
	    'come',
	    'could',
	    'd',
	    'did',
	    'differ',
	    'different',
	    'differently',
	    'do',
	    'da',
	    'does',
	    'done',
	    'down',
	    'down',
	    'downed',
	    'downing',
	    'downs',
	    'during',
	    'e',
	    'each',
	    'early',
	    'either',
	    'end',
	    'ended',
	    'ending',
	    'ends',
	    'enough',
	    'even',
	    'evenly',
	    'ever',
	    'every',
	    'everybody',
	    'everyone',
	    'everything',
	    'everywhere',
	    'f',
	    'face',
	    'faces',
	    'fact',
	    'facts',
	    'far',
	    'felt',
	    'few',
	    'find',
	    'finds',
	    'first',
	    'for',
	    'four',
	    'from',
	    'full',
	    'fully',
	    'further',
	    'furthered',
	    'furthering',
	    'furthers',
	    'g',
	    'gave',
	    'general',
	    'generally',
	    'get',
	    'gets',
	    'give',
	    'given',
	    'gives',
	    'go',
	    'going',
	    'good',
	    'goods',
	    'got',
	    'great',
	    'greater',
	    'greatest',
	    'group',
	    'grouped',
	    'grouping',
	    'groups',
	    'h',
	    'had',
	    'has',
	    'have',
	    'having',
	    'he',
	    'her',
	    'here',
	    'herself',
	    'high',
	    'high',
	    'high',
	    'higher',
	    'highest',
	    'him',
	    'himself',
	    'his',
	    'how',
	    'however',
	    'i',
	    'if',
	    'important',
	    'in',
	    'interest',
	    'interested',
	    'interesting',
	    'interests',
	    'into',
	    'is',
	    'it',
	    'its',
	    'itself',
	    'j',
	    'just',
	    'k',
	    'keep',
	    'keeps',
	    'kind',
	    'knew',
	    'know',
	    'known',
	    'knows',
	    'l',
	    'large',
	    'largely',
	    'last',
	    'later',
	    'latest',
	    'least',
	    'less',
	    'let',
	    'lets',
	    'like',
	    'likely',
	    'long',
	    'longer',
	    'longest',
	    'm',
	    'made',
	    'make',
	    'making',
	    'man',
	    'many',
	    'may',
	    'me',
	    'member',
	    'members',
	    'men',
	    'might',
	    'more',
	    'most',
	    'mostly',
	    'mr',
	    'mrs',
	    'much',
	    'must',
	    'my',
	    'myself',
	    'n',
	    'necessary',
	    'need',
	    'needed',
	    'needing',
	    'needs',
	    'never',
	    'new',
	    'new',
	    'newer',
	    'newest',
	    'next',
	    'no',
	    'nobody',
	    'non',
	    'noone',
	    'not',
	    'nothing',
	    'now',
	    'nowhere',
	    'number',
	    'numbers',
	    'o',
	    'of',
	    'off',
	    'often',
	    'old',
	    'older',
	    'oldest',
	    'on',
	    'once',
	    'one',
	    'only',
	    'open',
	    'opened',
	    'opening',
	    'opens',
	    'or',
	    'order',
	    'ordered',
	    'ordering',
	    'orders',
	    'other',
	    'others',
	    'our',
	    'out',
	    'over',
	    'p',
	    'part',
	    'parted',
	    'parting',
	    'parts',
	    'per',
	    'perhaps',
	    'place',
	    'places',
	    'point',
	    'pointed',
	    'pointing',
	    'points',
	    'possible',
	    'present',
	    'presented',
	    'presenting',
	    'presents',
	    'problem',
	    'problems',
	    'put',
	    'puts',
	    'q',
	    'quite',
	    'r',
	    'rather',
	    'really',
	    'right',
	    'right',
	    'room',
	    'rooms',
	    's',
	    'said',
	    'same',
	    'saw',
	    'say',
	    'says',
	    'second',
	    'seconds',
	    'see',
	    'seem',
	    'seemed',
	    'seeming',
	    'seems',
	    'sees',
	    'several',
	    'shall',
	    'she',
	    'should',
	    'show',
	    'showed',
	    'showing',
	    'shows',
	    'side',
	    'sides',
	    'since',
	    'small',
	    'smaller',
	    'smallest',
	    'so',
	    'some',
	    'somebody',
	    'someone',
	    'something',
	    'somewhere',
	    'state',
	    'states',
	    'still',
	    'still',
	    'such',
	    'sure',
	    't',
	    'take',
	    'taken',
	    'than',
	    'that',
	    'the',
	    'their',
	    'them',
	    'then',
	    'there',
	    'therefore',
	    'these',
	    'they',
	    'thing',
	    'things',
	    'think',
	    'thinks',
	    'this',
	    'those',
	    'though',
	    'thought',
	    'thoughts',
	    'three',
	    'through',
	    'thus',
	    'to',
	    'today',
	    'together',
	    'too',
	    'took',
	    'toward',
	    'turn',
	    'turned',
	    'turning',
	    'turns',
	    'two',
	    'u',
	    'under',
	    'until',
	    'up',
	    'upon',
	    'us',
	    'use',
	    'used',
	    'uses',
	    'v',
	    'very',
	    'w',
	    'want',
	    'wanted',
	    'wanting',
	    'wants',
	    'was',
	    'way',
	    'ways',
	    'we',
	    'well',
	    'wells',
	    'went',
	    'were',
	    'what',
	    'when',
	    'where',
	    'whether',
	    'which',
	    'while',
	    'who',
	    'whole',
	    'whose',
	    'why',
	    'will',
	    'with',
	    'within',
	    'without',
	    'work',
	    'worked',
	    'working',
	    'works',
	    'would',
	    'x',
	    'y',
	    'year',
	    'years',
	    'yet',
	    'you',
	    'young',
	    'younger',
	    'youngest',
	    'your',
	    'yours',
	    'z'
	)

	

	// Split out all the individual words in the phrase
	words = cleansed_string.match(/[^\s]+|\s+[^\s+]$/g)

	// Review all the words
	for(x=0; x < words.length; x++) {
	    // For each word, check all the stop words
	    for(y=0; y < stop_words.length; y++) {
	        // Get the current word
	        word = words[x].replace(/\s+|[^a-z]+/ig, "");   // Trim the word and remove non-alpha
	         
	        // Get the stop word
	        stop_word = stop_words[y];
	         
	        // If the word matches the stop word, remove it from the keywords
	        if(word.toLowerCase() == stop_word) {
	            // Build the regex
	            regex_str = "^\\s*"+stop_word+"\\s*$";      // Only word
	            regex_str += "|^\\s*"+stop_word+"\\s+";     // First word
	            regex_str += "|\\s+"+stop_word+"\\s*$";     // Last word
	            regex_str += "|\\s+"+stop_word+"\\s+";      // Word somewhere in the middle
	            regex = new RegExp(regex_str, "ig");
	         
	            // Remove the word from the keywords
	            cleansed_string = cleansed_string.replace(regex, " ");
	        }
	    }
	}
return cleansed_string.replace(/^\s+|\s+$/g, "");
}

String.prototype.stripKeywords = function(keywords){
    var cleansed_string = this.valueOf().toLowerCase();
    var keywords = keywords;
    
    // Review all keywords
    for(var i=0; i < keywords.length; i++) {
        cleansed_string = cleansed_string.replace(keywords[i], "");
    }

    return cleansed_string;
};

String.prototype.stripTLD = function(){
    var string = this.valueOf();

    var TLDs = [ '.aero','.arpa','.biz','.cat','.com','.coop','.edu','.gov','.info','.mil','.mobi','.net','.org','.pro','.ac','.ad','.ae','.af','.ag','.ai','.al','.am','.an','.ao','.ap','.aq','.ar','.as','.at','.au','.aw','.az','.ax','.ba','.bb','.bd','.be','.bf','.bg','.bh','.bi','.bj','.bm','.bn','.bo','.br','.bs','.bt','.bv','.bw','.by','.bz','.ca','.cc','.cd','.cf','.cg','.ch','.ci','.ck','.cl','.cm','.cn','.co','.cr','.cs','.cu','.cv','.cx','.cy','.cz','.de','.dj','.dk','.dm','.do','.dz','.ec','.ee','.eg','.eh','.er','.es','.et','.eu','.fi','.fj','.fk','.fm','.fo','.fr','.ga','.gb','.gd','.ge','.gf','.gg','.gh','.gi','.gl','.gm','.gn','.gp','.gq','.gr','.gs','.gt','.gu','.gw','.gy','.hk','.hm','.hn','.hr','.ht','.hu','.id','.ie','.il','.im','.in','.io','.iq','.ir','.is','.it','.je','.jm','.jo','.jp','.ke','.kg','.kh','.ki','.km','.kn','.kp','.kr','.kw','.ky','.kz','.la','.lb','.lc','.li','.lk','.lr','.ls','.lt','.lu','.lv','.ly','.ma','.mc','.md','.mg','.mh','.mk','.ml','.mm','.mn','.mo','.mp','.mq','.mr','.ms','.mt','.mu','.mv','.mw','.mx','.my','.mz','.na','.nc','.ne','.nf','.ng','.ni','.nl','.no','.np','.nr','.nu','.nz','.om','.pa','.pe','.pf','.pg','.ph','.pk','.pl','.pm','.pn','.pr','.ps','.pt','.pw','.py','.qa','.re','.ro','.ru','.rw','.sa','.sb','.sc','.sd','.se','.sg','.sh','.si','.sj','.sk','.sl','.sm','.sn','.so','.sr','.st','.sv','.sy','.sz','.tc','.td','.tf','.tg','.th','.tj','.tk','.tl','.tm','.tn','.to','.tp','.tr','.tt','.tv','.tw','.tz','.ua','.ug','.uk','.um','.us','.uy','.uz','.va','.vc','.ve','.vg','.vi','.vn','.vu','.wf','.ws','.ye','.yt','.yu','.za','.zm','.zw','.org.uk','.org.es','.com.es','.co.uk','.xyz','.me']
    var finalExp = [];
    for(var i=0; i<TLDs.length;i++){ finalExp.push("(?![a-z])"+ TLDs[i] +"\/?(?![a-z-_.])\/?"); };
    //Join expressions with the or symbol (conveniently, won't be placed at the end of string)
    finalExp = finalExp.join('|');
    //Build regex
    var re = new RegExp(finalExp);

    return string.replace(re, ' ').replace(/ +(?= )/g, '').trim();
};

String.prototype.cleanDomain = function(){
    var cleansed_string = this.valueOf();
    
    cleansed_string = cleansed_string.stripTLD().toLowerCase();

    cleansed_string = cleansed_string
        //Replace TLDs with whitespaces, remove extra whitespaces and trim
        .replace(/ +(?= )/g,'').replace(/\s[a-z]\s/g, '')
        .replace(/ +(?= )/g,'').replace(/\s[0-9]\s/g, '')
        .split(/\.|-/)
        .join(' ')
        .trim();

    return cleansed_string;
};

String.prototype.cleanProtocol = function(){
    var cleansed_string = this.valueOf();
    return cleansed_string.replace(/https:\/\/|http:\/\/|ftp:\/\/|www\d*\./g, '');
};