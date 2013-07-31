Package.describe({
  summary: 'Class and module system for Meteor'
});

Package.on_use(function (api) {
  api.use('ejson', ['client', 'server']);
  api.use('underscore', ['client', 'server']);

  api.add_files([
    'lib/posture.js',
    'lib/module.js',
    'lib/class.js'
  ], ['client', 'server']);

  api.export([
    'Class',
    'Module'
  ], ['client', 'server']);

  api.export('Posture', {testOnly: true});
});

Package.on_test(function (api) {
  api.use([
    'posture',
    'tinytest',
    'test-helpers'
  ], ['client', 'server']);

  api.add_files('test/posture-test.js', ['client', 'server']);
});
