//APP Collections

//UserSignups
Signups = new Meteor.Collection('signups');

//User Logs
UserLogs = new Meteor.Collection('userLogs');

//Projects & their categories
Projects = new Meteor.Collection('projects');

//Stores a reference to which project a user touched last
LastTouchedProject = new Meteor.Collection('lastTouchedProject');

//Tasks & tasklists
Tasklists = new Meteor.Collection('tasklists');

//ORganization
Organizations = new Meteor.Collection('organizations');

OrganizationProfile = new Meteor.Collection('organizationProfile');

//Domains related collections
Domains = new Meteor.Collection('domains');

DomainCategories = new Meteor.Collection('domainCategories');

DomainRules = new Meteor.Collection('domainRules');

PlanTypes = new Meteor.Collection('planTypes');