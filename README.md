# Headlight App SDK

This is the SDK for building custom Node.js apps on the Pavia Systems Headlight ecosystem.

The SDK allows creation and management of arbitrary, JSON-based data structures that can be stored within Headlight.  The SDK takes care of much of the basic structure and organization of your app and provides hooks for you to create screens for managing your data.


### Getting Started

1. Create a new Node.js project
2. Install this SDK by running `npm install headlight-node-sdk --save`
3. Replace your entire `server.js` file with the following

```
var _Orator = require(__dirname+'/node_modules/headlight-node-sdk/server/Headlight-NodeSDK.js').new({
		Product: '{YOUR_UNIQUE_APP_NAME}',
		StaticContentFolder: __dirname + '/stage/',
		ConfigFile: __dirname + "/Headlight-App-Config.json"
	}).orator();

_Orator.startWebServer();
```

4. Make sure you have [Gulp](http://gulpjs.com/) installed by running `npm install gulp -g`
5. Create `gulpfile.js` in your project’s root directory with the following contents:

```
var _Swill = require('headlight-node-sdk').new({StaticContentFolder: __dirname+'/stage/'}).swill();
```

#### If you are running this in Cloud9

Remember to set your node enviroment to a modern version of node.  You can do this by running the following in the terminal:

```
nvm install 5.8
nvm use 5.8
nvm alias default 5.8
```

*It is important that you do this before* installing the global node modules or the local node modules.

### Headlight App Structure

A Headlight app contains a few key files.

```
├── headlight-app/
│   ├── Headlight-App.json
│   ├── css/
│   │   ├── Headlight-App.css
│   ├── html/
│   │   ├── Headlight-App.html
│   │   ├── Other-Arbitrary-Markup-Files.html
│   ├── scripts/
│   │   ├── Headlight-App.js
│   │   ├── Other-Arbitrary-Javascript-Files.js
├── stage/
│   ├── *** Automatically Generated ***
├── gulpfile.js
├── server.js
├── Headlight-App-Config.json (optional)
```

Refer to the [Headlight-Node-SDK-Sample](https://github.com/paviasystems/headlight-node-sdk-sample) project for more information.

The primary app Javascript file, `Headlight-App.js`, will be compiled using [Browserify](http://browserify.org/).  Therefore, you can include any other arbitrary javascript file using the following syntax:

```
require('./Other-Arbitrary-Javascript-Files.js');
```


#### App Entry Point

The entry point for your app is `Headlight-App.js`.  Your app must be structured as a [pict](https://github.com/stevenvelozo/pict) feature with the same name as the `AppHash` provided in the `Headlight-App.json` configuration file. Your pict feature must provide two specific functions.  Here is a sample skeleton app.

```
pict.features.MyHeadlightApp = {};

pict.features.MyHeadlightApp.initialize = function(pSession){
	console.log('MyHeadlightApp app initializing!');
};

pict.features.MyHeadlightApp.load = function(pRecord, pProject, pSession){
	$('#headlight-app').html('My Headlight App has loaded!');
};
```

### Configuration

The Headlight SDK will provide all the basic components of your app for you, including authentication, project management and record listings.  You can control some of these features by providing a configuration file called `Headlight-App.json` in the `headlight-app` directory.

```
{
  "AppHash": "MyHeadlightApp",
  "AppName": "My Headlight App",
  "AppAuthor": "Ryan Vanderpol <me@ryanvanderpol.com>",
  
  "AppRecordHash": "MyAppRecord",
  "AppRecordName": "My Record",
  "AppRecordNamePlural": "My Records",

  "ProjectList": true,
  "Backbone": true,

  "Page":
    {
      "Index-Head-Override": false,
      "Index-Tail-Override": false,
      
      "AppEntryTemplate": "MyHeadlightApp_Main"
    }
}
```


#### Turning Off Project Management

You can disable project management by setting the `ProjectList` attribute to `false`.  Doing this bypasses project selection and allows creation of data that is not tied to any specific project.

### Building

The Headlight SDK has an entire gulp build chain built in.  All you need to do is run the following and you’ll be on your way.

```
gulp build-debug
```

If you’d like to modify the build process, refer to the [Swill](https://github.com/stevenvelozo/swill) documentation.

### Running

Once the project is built using `gulp` running is as simple as 

```
node server.js
```

The SDK will take care of starting up a server and serving the files from your `headlight-app` directory.

### Data Proxies

While building your app you may want to store or retrieve data from the Headlight platform.  The records created by your app can be retrieved and saved via the `AppData` API proxy.  Using the API can look like this:

```
pict.features.HeadlightApp.Data.AppData.save({ id: 42, model: model }, { success: function(response){
    console.log('saved!', response);
});
```

To create a new record, you may omit or pass in `null` for the `id` parameter.

The following data proxies are available:

* AppData
* AppArtifact
* Artifact
* Observation
* Report

You will generally store all of your app's data in an `AppData` container.

If the JSON object you store in the `AppData` container has a `Title` attribute, it will be used on the Record List screen.