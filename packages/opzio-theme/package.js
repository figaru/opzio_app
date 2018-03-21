Package.describe({
  name: 'opzio-theme',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.4.1');
  
  api.use([
    'ecmascript',
    'jquery',
    'underscore',
    'fourseven:scss@3.13.0',
    'jeremy:selectize',
    'chrismbeckett:toastr',
  ]);

  Npm.depends({
    "tooltipster": "4.1.8",
  })
 

  api.addFiles('stylesheets/app.scss', 'client');
  api.addFiles([
    "stylesheets/imports/_variables.scss",
    "stylesheets/imports/_mixins.scss",
    "stylesheets/imports/_normalize.scss",
    "stylesheets/imports/_print.scss",
    "stylesheets/imports/_reboot.scss",
    "stylesheets/imports/_type.scss",
    "stylesheets/imports/_images.scss",
    "stylesheets/imports/_code.scss",
    "stylesheets/imports/_grid.scss",
    "stylesheets/imports/_tables.scss",
    "stylesheets/imports/_forms.scss",
    "stylesheets/imports/_selectize.scss",
    "stylesheets/imports/_buttons.scss",
    "stylesheets/imports/_transitions.scss",
    "stylesheets/imports/_dropdown.scss",
    "stylesheets/imports/_button-group.scss",
    "stylesheets/imports/_input-group.scss",
    "stylesheets/imports/_custom-forms.scss",
    "stylesheets/imports/_nav.scss",
    "stylesheets/imports/_navbar.scss",
    "stylesheets/imports/_card.scss",
    "stylesheets/imports/_breadcrumb.scss",
    "stylesheets/imports/_pagination.scss",
    "stylesheets/imports/_badge.scss",
    "stylesheets/imports/_jumbotron.scss",
    "stylesheets/imports/_toastr.scss",
    "stylesheets/imports/_progress.scss",
    "stylesheets/imports/_media.scss",
    "stylesheets/imports/_list-group.scss",
    "stylesheets/imports/_responsive-embed.scss",
    "stylesheets/imports/_close.scss",
    "stylesheets/imports/_svg-icons.scss",
    "stylesheets/imports/_modal.scss",
    "stylesheets/imports/_tooltip.scss",
    "stylesheets/imports/_popover.scss",
    "stylesheets/imports/_carousel.scss",
    "stylesheets/utilities/_utilities.scss"
  ], 'client', {isImport: true});

  //JAVASCRIPT
  api.mainModule('opzio-theme.js', 'client');
  api.mainModule('lib/js/inputs.js', 'client');
  
  api.export('MaterialLabel', 'client');
  api.export('resetToaster', 'client');
  api.export('callToast', 'client');

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  //api.use('opzio-theme');
  //api.mainModule('opzio-theme-tests.js');
});
