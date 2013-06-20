Package.describe({
  summary: 'Class and module system for Meteor'
});

Package.on_use(function (api) {
  api.use('EJSON', ['client', 'server']);
  api.use('underscore', ['client', 'server']);
  api.add_files('lib/posture.js', ['client', 'server']);
});

Package.on_test(function (api) {
  api.use('posture');
  api.add_files('test/posture-test.js', ['client', 'server']);
});