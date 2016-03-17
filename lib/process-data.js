module.exports = function processData(err, data) {
  var versionInfo;

  if (err) {
    return {
      statusCode: 404,
      message: 'Version info file not found'
    };
  }

  try {
    versionInfo = JSON.parse(data);
    versionInfo.statusCode = 200;
  } catch (err) {
        // Invalid JSON
    versionInfo = {
      statusCode: 500,
      message: 'Version info file exists, but could not be parsed.'
    };
  }

  return versionInfo;
};
