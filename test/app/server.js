var _Orator = require(__dirname+'/../../server/Headlight-NodeSDK.js').new(
	{
		Product:'Headlight-SDK-App-Sample',
		// The folder to serve static web files from for this app.  By default, use the Stage folder.
		StaticContentFolder: __dirname+'/stage/',

		// Log streams are also different because Run logs can't write to the root FS which would be the folder in this case.
		"LogStreams":
        [
            {
                "level": "trace",
                "path": `${__dirname}/Run.log`
            },
            {
                "level": "trace",
                "streamtype": "prettystream"
            }
        ],
	}).orator();

_Orator.startWebServer();