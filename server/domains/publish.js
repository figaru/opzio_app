//General project publish
Meteor.publish('domainCategories', function(params){
	return DomainCategories.find({}, { 'sort':{ 'category': 1, } });
});