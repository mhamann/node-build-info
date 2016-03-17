var buildVersion = require('../');
var test = require('tape');
var path = require('path');
var request = require('supertest');
var express = require('express');

var goodResponse = require('./assets/versionInfo.json');
goodResponse.statusCode = 200;

function setup(opts) {
  var app = express();
  app.get('/version', buildVersion(opts));
  return app;
}

test('Version info doesn\'t exist in current working directory', function (t) {

  var app = setup();

  request(app)
    .get('/version')
    .expect(404)
    .end(function (err, res) {
      t.equal(res.body.statusCode, 404, 'Response indicates version info not found');
      t.end();
    });
});

test('Version info in other directory', function (t) {
  var app = setup({
    filePath: path.join(__dirname, 'assets')
  });

  request(app)
    .get('/version')
    .expect(200)
    .end(function (err, res) {
      t.deepEqual(res.body, goodResponse, 'Got a good response object.');
      t.end();
    });

});

test('App passes additional deployment data to processor', function (t) {
  var app = setup({
    filePath: path.join(__dirname, 'assets'),
    deployment: {
      region: 'us-west'
    }
  });

  request(app)
    .get('/version')
    .expect(200)
    .end(function (err, res) {
      var expectedResponse = Object.assign({}, goodResponse, {
        deployment: {
          region: 'us-west'
        }
      });

      t.deepEqual(res.body, expectedResponse, 'Got a response with added deployment info');
      t.end();
    });
});

test('Deployment info is still present even when versionInfo isn\'t found', function (t) {
  var app = setup({
    deployment: {
      region: 'us-west'
    }
  });

  request(app)
    .get('/version')
    .expect(404)
    .end(function (err, res) {
      var expectedResponse = {
        message: 'Version info file not found',
        statusCode: 404,
        deployment: {
          region: 'us-west'
        }
      };

      t.deepEqual(res.body, expectedResponse, 'Got a response with added deployment info');
      t.end();
    });
});

test('App passes additional metadata to processor', function (t) {
  var app = setup({
    filePath: path.join(__dirname, 'assets'),
    metadata: {
      foo: 'bar'
    }
  });

  request(app)
    .get('/version')
    .expect(200)
    .end(function (err, res) {
      var expectedResponse = Object.assign({}, goodResponse, {
        metadata: {
          foo: 'bar'
        }
      });

      t.deepEqual(res.body, expectedResponse, 'Got a response with added metadata');
      t.end();
    });
});