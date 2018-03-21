Router.route('/solutions',{
	name: 'solutionsList',
	controller: 'PublicController',
	action: function(){

		this.render();
		document.title = 'Opz.io - Seamless project management';

		this.render('solutionsList',{
			to: 'mainContentArea',
		});
	},
});

/* industry slugs:
it-services-agencies-project-resources-management-software
consulting-project-resources-management-software
legal-practitioners-time-management-software
*/

/*
Router.route('/solutions/:industry',{
	name: 'solutions',
	controller: 'PublicController',
	action: function(){

		params = this.getParams();
		industry = params.industry;

		if(typeof industry !== 'undefined'){
			console.log('industry ' + industry);

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
				case 'it-services-agencies-project-resources-management-software':
					
					document.title = 'Online Management Software for Agencies & IT Services';
					
					this.render('agenciesSolutions',{
						to: 'mainContentArea',
					});

					break;

				case 'consulting-project-resources-management-software':
					
					document.title = 'Online Management Software for Consulting Services';

					this.render('consultingSolutions',{
						to: 'mainContentArea',
					});

					break;

				case 'legal-practitioners-time-management-software':
					
					document.title = 'Automated Online Time Management for Legal Practitioners';

					this.render('legalSolutions',{
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
*/