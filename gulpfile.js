/**
* This file is part of the Pavia Headlight Apps SDK
*
* @license     All Rights Reserved
* @copyright   Copyright (c) 2016, Pavia
*
* @author      Steven Velozo <steven@paviasystems.com>
*
* @description This is the swill build file to test the javascript, css, html and less.  Plus generate / minify the site.
*/
var _Swill = require(__dirname+'/server/Headlight-NodeSDK.js').new(
	{
		StaticContentFolder: __dirname+'/stage/',
		HeadlightAppFolder: __dirname+'/headlight-app/'
	}).swill();
