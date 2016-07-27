/**
* This includes the Pavia Headlight Node SDK gulpfile
*
* @license     All Rights Reserved
* @copyright   Copyright (c) 2016, Pavia
*
* @author      Ryan Vanderpol <me@ryanvanderpol.com>
*
* @description This is the swill build file to test the javascript, css, html and less.  Plus generate / minify the site.
*/

var _Swill = require('headlight-node-sdk').new({StaticContentFolder: __dirname+'/stage/'}).swill();

// watch for changes
_Swill.gulp.task('watch', function() {
    _Swill.gulp.watch(['headlight-app/**/*'],['build-debug']);
});