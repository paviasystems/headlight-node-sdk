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

				// The folder to serve static web files from for this app.  By default, use the Stage folder.
				StaticContentFolder: __dirname+'/../../../stage/'
	}).orator();

_Orator.startWebServer();
