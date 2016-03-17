# build-info
Provides middleware for publishing app version information as a REST API.

build-version is a piece of middleware that works with Express to expose the current application build level
as an API. Though it hasn't been tested, it should work with other Node.js web app frameworks that use the
same syntax as Express middleware.

## Usage
As part of your build process, output a file to the root of your application called `versionInfo.json`.
The format of this file should (hopefully obviously) be JSON. If the JSON is malformed, build-version
will display an error when its registered route is called.

To get this up and running quickly, set up your main app script something like this:

The versionInfo file can be of any format you prefer. Here's an example:

```
{
    "buildid" : "2016-03-14_20-10-33",
    "repository" : "my-webapp",
    "branch" : "feature/apiv2",
    "timestamp" : "20160314160734",
    "docker" : {
        "image" : "product_my-webapp",
        "tag" : "98dac66"
    }
}
```

From that point, set up your web app to include the build-version middleware and assign it a route, something like this:

```
var express = require('express');
var app = express();
var buildInfo = require('build-info');

...

app.get('/build-info', buildInfo());
```

`buildVersion()` optionally accepts an object argument, allowing you to specify some properties:

- `filePath` - Accepts a relative or absolute path string if the `versionInfo.json` file is located somewhere other than the current working directory.
- `fileName` - Accepts a string allowing the target JSON file to be named something other than `versionInfo.json`.
- `deployment` - Accepts an object for setting values at runtime that are specific to the application's deployment.
- `metadata` - Accepts an object for setting additional properties not covered by other fields.

Once you start your app, invoke your route via `GET /build-info`. The output should look something like this (based on what you put in your `versionInfo` file.

```
{
    "statusCode": 200,
    "buildid" : "2016-03-14_20-10-33",
    "repository" : "my-webapp",
    "branch" : "feature/apiv2",
    "timestamp" : "20160314160734",
    "docker" : {
        "image" : "product_my-webapp",
        "tag" : "98dac66"
    }
}
```

If anything goes wrong when reading your file, `statusCode` will be set to `404` (file not found) or `500` (something else went wrong, like a JSON parse failure).
A `message` property will also be added to the response explaining what happened.
