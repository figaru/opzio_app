// Router.route('/plugins/:pluginName?',{
// 	name: 'publicPlugins',
// 	controller: 'PublicController',
// 	action: function(){

// 		//Check if we have any specific plugin selected
// 		let plugin = this.getParams().pluginName;

// 		this.render();

// 		this.render('publicPluginsPage',{
// 			to: 'mainContentArea',
// 			/*
// 			data: function(){
// 				return {
// 					'canSetCustomRange': false,
// 				}
// 			}
// 			*/
// 		});

// 		this.render('publicFooter', {
// 			to: 'footerArea',
// 			data: function(){
// 				return {
// 					'fixed': false,
// 					'simple': true
// 				}
// 			}
// 		});

// 		if(typeof plugin !== 'undefined'){
// 			document.title = plugin + ' Plugin | Opz.io';
// 			window.location = '#'+plugin;
// 			Meteor.setTimeout(function(){
// 				let top = $(document).find('#'+plugin).offset().top - 75; 
// 				$(document).scrollTop(top)
// 			},1000)
// 		}
// 		else{
// 			document.title = 'Available Plugins | Opz.io';
// 			//window.location += '';
// 		}
// 	},
// });