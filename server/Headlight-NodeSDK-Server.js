// ##### Part of the Headlight platform SDK (https://developer.paviasystems.com/)
/**
* @license MIT
* @author <steven.velozo@paviasystems.com>
*/
/**
* Basic Node SDK APP Server
*
* @class HeadlightApp
*/
var _Orator = require(__dirname+'/Headlight-NodeSDK.js').new(
	{
				// Default App name
				Product:'Headlight-SDK-App-Default',
				
				// Default session timeout
				"SessionTimeout": 60000,

				// The folder to serve static web files from for this app.  By default, use the Stage folder.
				StaticContentFolder: __dirname+'/../../../stage/',
				ConfigFile: __dirname+'/../../../headlight-app/server/HeadlightApp-Orator.json'
	}).orator();

_Orator.startWebServer();
