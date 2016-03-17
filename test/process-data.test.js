var test = require('tape'),
  fs = require('fs'),
  processData = require('../lib/process-data');


test('file that does not exist', function(t) {

  fs.readFile(__dirname + '/assets/nonexistantVersionInfo.json', function(/*err, data*/) {
    var versionInfo = processData.apply(null, arguments);

    t.equal(versionInfo.statusCode, 404, 'File not found, statusCode will be 404');

    t.end();
  });

});

test('file that contains bad JSON', function(t) {

  fs.readFile(__dirname + '/assets/versionInfoBad.json', function(/*err, data*/) {
    var versionInfo = processData.apply(null, arguments);

    t.equal(versionInfo.statusCode, 500, 'Could not parse file, statusCode will be 500');

    t.end();
  });

});

test('file that exists and is parseable', function(t) {

  fs.readFile(__dirname + '/assets/versionInfo.json', function(/*err, data*/) {
    var versionInfo = processData.apply(null, arguments);

    t.equal(versionInfo.statusCode, 200, 'File found and parsed, statusCode should be 200');

    t.end();
  });

});
