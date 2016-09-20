/**
* This includes the Pavia Headlight Node SDK gulpfile
*
* @license     All Rights Reserved
* @copyright   Copyright (c) 2016, Pavia
*
* @author      Steven Velozo <steven@paviasystems.com>
*
* @description This is the swill build file to test the javascript, css, html and less.  Plus generate / minify the site.
*/
var _SDKLibraryLocation = __dirname+'/../../server/Headlight-NodeSDK.js';

var _SwillSettings =
{
    StaticContentFolder: __dirname+'/stage/',
    HeadlightAppFolder: __dirname+'/headlight-app/'
};

var _Swill = require(_SDKLibraryLocation).new(_SwillSettings).swill();
