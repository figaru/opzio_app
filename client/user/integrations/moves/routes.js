Router.route('/integrations/moves',{
	name: 'movesAuthentication',
	controller: 'PrivateController',
	action: function(){

		var canViewMenu = false;
		var canViewDateMenu = false;
		var canViewSettings = false;
		var canViewTimesheet = false;
		var canFitRange = false;
		var singleDatePicker = false;
		var canSetCustomRange = false;

		this.render(); 

		this.render('movesAuthentication',{
			data: function(){
				document.title = 'Finalizing Moves Authentication - Opz.io';
			}
		});

		//Render menu with options
		this.render('userMenu',{
			to: 'actionsMenuArea',
			data: function(){
				return {
					'canViewMenu': canViewMenu,
					'canViewSettings': canViewSettings,
					'canViewTimesheet': canViewTimesheet
				}
			}
		});

		this.render('dateRangeMenu',{
			to: 'dateRangeMenuArea',
			data: function(){
				return {
					'canViewDateMenu': canViewDateMenu,
					'singleDatePicker': singleDatePicker,
					'canFitRange': canFitRange,
					'canSetCustomRange': canSetCustomRange,
				}
			}
		});
	}
});