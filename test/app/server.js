var _Orator = require(__dirname+'/../../server/Headlight-NodeSDK.js').new(
	{
		Product:'Headlight-SDK-App-Sample',
		// The folder to serve static web files from for this app.  By default, use the Stage folder.
		StaticContentFolder: __dirname+'/stage/'
	}).orator();

_Orator.startWebServer();