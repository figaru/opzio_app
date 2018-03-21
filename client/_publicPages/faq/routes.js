Router.route('/frequent-questions',{
	name: 'faqs',
	controller: 'PublicController',
	action: function(){
		
		document.title = 'F.A.Qs. | Opz.io';

		this.render();

		this.render('faq',{
			to: 'mainContentArea',
			/*
			data: function(){
				return {
					'canSetCustomRange': false,
				}
			}
			*/
		});

		this.render('publicFooter', {
			to: 'footerArea',
			data: function(){
				return {
					'fixed': false,
					'simple': true
				}
			}
		});

		let hash = this.getParams().hash;
		if(hash !== null){
			Meteor.setTimeout(function(){
				let top = $(document).find('#'+hash).offset().top - 75; 
				$(document).scrollTop(top)
			}, 500)
		}
	},
});