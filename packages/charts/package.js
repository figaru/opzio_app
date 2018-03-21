Npm.depends({
  "highcharts": "4.2.5",
  //"justgage": "1.2.2",
});

Package.describe({
  name: 'mstrlaw:charts',
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
  api.versionsFrom('1.3.3.1');
  api.use('ecmascript');
  
  api.add_files('jquery.circliful.min.js', 'client');
  api.add_files('circliful.css', 'client');

  api.mainModule('highcharts.js');
  api.mainModule('gauge.js');
  api.export('NewChart', ['client', 'server']);
  api.export('NewGauge', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('jquery');
  api.use('tinytest');
  api.use('mstrlaw:charts');
  api.mainModule('charts-tests.js');
});
