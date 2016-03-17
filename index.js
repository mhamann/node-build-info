var fs = require('fs'),
  path = require('path'),
  processData = require('./lib/process-data');

function getVersionInfo(opts, cb) {

  var options = Object.assign({
    filePath: '',
    fileName: 'versionInfo.json'
  }, opts);
    
  fs.readFile(path.join(options.filePath, options.fileName), function(/*err, data*/) {
    cb(processData.apply(null, arguments));
  });
}

module.exports = function(opts) {

  var options = Object.assign({}, opts);

  return function(req, res/*, next*/) {
    getVersionInfo(options, function(versionInfo) {

      if (options.metadata) {
        versionInfo.metadata = options.metadata;
      }

      if (options.deployment) {
        versionInfo.deployment = options.deployment;
      }

      res.status(versionInfo.statusCode).send(versionInfo);
    });
  };
};
