Router.route('/solutions/:industry',{
	name: 'solutions',
	controller: 'PublicController',
	action: function(){

		params = this.getParams();
		industry = params.industry;

		if(typeof industry !== 'undefined'){
			//console.log('industry ' + industry);

			this.render();

			switch(industry){

				//For teams
				case 'it-service-and-agency-teams-management-software':
					document.title = 'Online Management Software for Teams';
					
					this.render('forTeams',{
						to: 'mainContentArea',
					});

					break;

				//For Individuals
				case 'freelancers-time-management-online-software':
					document.title = 'Online Management Software for Freelancers & Individuals';
					
					this.render('forIndividuals',{
						to: 'mainContentArea',
					});

					break;

				//Agencies & Services Industries
				case 'it-services-time-management-software':
					
					document.title = 'Online Management Software for Agencies & IT Services';
					
					this.render('forIT',{
						to: 'mainContentArea',
					});

					break;

				case 'consulting-project-resources-management-software':
					
					document.title = 'Online Management Software for Consulting Services';

					this.render('forConsulting',{
						to: 'mainContentArea',
					});

					break;

				case 'legal-practitioners-time-management-software':
					
					document.title = 'Automated Online Time Management for Legal Practitioners';

					this.render('forLegal',{
						to: 'mainContentArea',
					});
					break;
			}

		}
		else{
			Router.go('solutionsList');
		}
	},
});