//import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { moment } from 'meteor/momentjs:moment';
import { charts } from 'meteor/mstrlaw:charts';

import tooltipster from 'tooltipster';

Meteor.startup(function(){

    //Init defaults and other stuff that needs to be delayed for DOM load reasons
    _initDefaults();

    whitheldEvents = {};
    
    switch(process.env.NODE_ENV){
        case 'development':
            console.log('** Client Startup @'+ moment().format('HH:mm:ss')+' **');
            //Ignore mixpanel events on dev
            break;
        case 'production':
            console.log("%c\
                            _ .--.\n\
                           ( `    )\n\
  Hello there!          .-'      `--,\n\
             _..----.. (             )`-.\n\
           .'_|` _|` _|(  .__,           )\n\
          /_|  _|  _|  _(        (_,  .-'\n\
         ;|  _|  _|  _|  '-'__,--'`--'\n\
         | _|  _|  _|  _| |\n\
         ||  _|  _|  _|  _|\n\
    ( `--.\\_|  _|  _|  _|/\n\
 .-'       )--,|  _|  _|.`\n\
(__, (_      ) )_|  _| /    Curious?\n\
 `-.__.\\ _,--'\\|__|__/\n\
               ;____;     jobs@opz.io\n\
                \\TT/\n\
                 ||\n\
                |\"\"|\n\
                '=='\n\n", "font-family:monospace");
            break;
    }
});

_initDefaults = function(){

    Session.set('deviceWidth', $(window).width());
    Session.set('deviceHeight', $(window).height());

    var dateRange = {
    	'startDate': moment().startOf('day').toISOString(),
    	'endDate': moment().endOf('day').toISOString(),
        //'startDate': '2017-05-029T23:00:00.000Z',
        //'endDate': '2017-06-03T22:59:59.999Z',
    	'range': 'day',
        'verbosePeriod': 'Today',
        'altVerbosePeriod': 'Daily',
    }

    Session.set('dateRange', dateRange);

    resetToaster();
}