// ##### Part of the Headlight platform SDK (https://developer.paviasystems.com/)
/**
* @license MIT
* @author <steven.velozo@paviasystems.com>
*/
var libUnderscore = require('underscore');
var libRestify = require('restify');
var libFS = require('fs');

/**
* Main Headlight Node SDK APP
*
* @class HeadlightApp
*/

var HeadlightApp = function()
{
	var createNew = function(pSettings)
	{
		// This object requires a settings object (*NOT A FABLE OBJECT*)
		if (typeof(pSettings) !== 'object')
		{
			return {new: createNew};
		}

		// Build the default settings
		var _SettingsDefaults = (
			{
				// Default App name
				Product:'Headlight-SDK-App',
				// Defaults to the version of the SDK, but this should be overridden
				ProductVersion: require(__dirname+'/../package.json').version,

				// By default, Apps authenticate and proxy to the staging environment
				AuthenticationServerURL: "https://headlightstg.paviasystems.com/1.0/",
				// Pass through the POST authentication API
				AuthTypes: ['POST'],
				
				"LogStreams":
		        [
		            {
		                "level": "trace",
		                "path": `${__dirname}/../../../Run.log`
		            },
		            {
		                "level": "trace",
		                "streamtype": "prettystream"
		            }
		        ],
		
				// The folder to serve static web files from for this app.
				// By default, use the Stage folder in the INCLUDING module.
				// This expects "mymodule/node_modules/headlight-nodesk/server"
				StaticContentFolder: __dirname+'/../../../stage/',
				HeadlightAppFolder: __dirname+'/../../../headlight-app/',

				StaticLoginPage: 'login.html',

				// The server application to use (by default our built-in nodesdk server)
				ServerScript: __dirname+'/Headlight-NodeSDK-Server.js',

				// The swill root (used for the sourcing of all the assets etc)
				SwillRoot: __dirname+'/../',

				APIServerPort: 8080,
				SessionTimeout: 60000,

				// By default use the in-memory session store
				SessionStrategy: "InMemory",

				// Use what most Headlight docker instances use for memcache
				MemcachedURL: "headlight-memcached.headlight:11211",

				// Load a config file if it is available
				ConfigFile: __dirname+'/../../../headlight-app/server/HeadlightApp-Orator.json'
			});
		var _SettingsPassed = (typeof(pSettings) === 'object') ? pSettings : {};
		// Map in the passed-in settings and default settings
		var _Settings = JSON.parse(JSON.stringify(libUnderscore.extend({}, _SettingsDefaults, _SettingsPassed)));

		var getAppPage = function(pRequest, pResponse, fNext)
		{
//			var tmpFile = 'login.html';
			var tmpFile = _Orator.settings.StaticLoginPage;

			if (pRequest.UserSession.LoggedIn || _Settings.RequireAppPageLogin === false)
				tmpFile = 'index.html';

			_Orator.fable.log.fatal('Sending '+tmpFile);

			var tmpServe = libRestify.plugins.serveStatic
			(
				{
					directory: _Orator.settings.StaticContentFolder,
					default: tmpFile
				}
			);
			tmpServe(pRequest, pResponse, fNext);
		};


		var _Orator = false;
		var orator = function(fCustomRouteHandler)
		{
			// If the web server is already initialized, return it.
			if (_Orator) return _Orator;

			// Build the orator web server, assign it to the module variable.
			_Orator = require('orator').new(_Settings);

			// Map in the proxy Authentication
			var _OratorSessionHttpAuth = require('orator-session-remoteauth').new(_Orator);
			_OratorSessionHttpAuth.connectRoutes(_Orator.webServer);

			_Orator.addProxyRoute('1.0/', _Orator.settings.AuthenticationServerURL);

			// Add branching on index.html to load login.html if we have no session
			_Orator.webServer.get('index.html', getAppPage);
			_Orator.webServer.get('/', getAppPage);

			//Allow the consumer to connect any additional routes before the final
			// static route handler is added.
			if (fCustomRouteHandler)
				fCustomRouteHandler(_Orator);

			// Map the staged web site to a static server on all other root requests
			_Orator.addStaticRoute(_Orator.settings.StaticContentFolder);

			// Start the web server
			//libOrator.startWebServer();
			return _Orator;
		};



		var _Swill = false;
		var setSwillSource = function(pSourceFolder)
		{
			// Change the source folder settings
			var tmpSettings = _Swill.settings;

			// Source folder redefinition
			tmpSettings.Build.Source = pSourceFolder;
			// Instrumentation code (e.g. New Relic)
			tmpSettings.Instrumentation.Production = tmpSettings.Build.Source+'Pict-ProductionInstrumentation.js';
			tmpSettings.Instrumentation.Development = tmpSettings.Build.Source+'Pict-DebugInstrumentation.js';
			// CSS Less compilation
			tmpSettings.LessCSS.Source = pSourceFolder+'less/theme.less';
			tmpSettings.LessCSS.SourceFiles = pSourceFolder+'less/**/*.less';
			// CSS Sass compilation
			tmpSettings.SassCSS.Source = pSourceFolder+'sass/theme.scss';
			tmpSettings.SassCSS.SourceFiles = pSourceFolder+'sass/**/*.scss';
			// Script compilation for the Pict requirejs app
			tmpSettings.Scripts.SourceFolder = pSourceFolder+'scripts/';
			tmpSettings.Scripts.Source = [pSourceFolder+'scripts/**/**.*'];
			tmpSettings.Scripts.LintIgnore = ['!'+pSourceFolder+'scripts/pict/dependencies/*.js'];
			// Single-script in-browser dependencies
			tmpSettings.Dependencies.Source = pSourceFolder+'bower_components/';
			// Any other assets (images; fonts; full libraries; etc.)
			tmpSettings.Assets.Source = pSourceFolder;
			// Site agglomeration
			tmpSettings.Site.Source = pSourceFolder+'html/**/*.*';
			
			tmpSettings.Site.Head = tmpSettings.AppCustomizations.Page["Index-Head-Override"] ? 
										_Swill.settings.HeadlightAppFolder+tmpSettings.AppCustomizations.Page["Index-Head-Override"] : 
									tmpSettings.AppCustomizations.Page["Site-Type"] ?
										pSourceFolder+'html/index-head-'+tmpSettings.AppCustomizations.Page["Site-Type"]+'.html' :
										pSourceFolder+'html/index-head.html';

			var tmpBuiltInPartials = pSourceFolder+'headlight-app-backbone/partials/**/*.html';
			if (tmpSettings.AppCustomizations.Page["Site-Type"])
				tmpBuiltInPartials = pSourceFolder+'headlight-app-'+tmpSettings.AppCustomizations.Page["Site-Type"]+'/partials/**/*.html';

			// TODO: Go over these folders, many are unnecessary.
			tmpSettings.Site.Partials = (
				[
					tmpBuiltInPartials,
					pSourceFolder+'html/templates/**/*.html',
					pSourceFolder+'html/static/**/*.html',
					pSourceFolder+'html/pict/**/*.html',
					pSourceFolder+'html/recordsets/**/*.html'
				]);

			tmpSettings.Site.Tail = tmpSettings.AppCustomizations.Page["Index-Tail-Override"] ? 
										_Swill.settings.HeadlightAppFolder+tmpSettings.AppCustomizations.Page["Index-Tail-Override"] : 
									tmpSettings.AppCustomizations.Page["Site-Type"] ?
										pSourceFolder+'html/index-tail-'+tmpSettings.AppCustomizations.Page["Site-Type"]+'.html' :
										pSourceFolder+'html/index-tail.html';

			tmpSettings.Site.Tail = tmpSettings.AppCustomizations.Page["Index-Tail-Override"] ? 
										_Swill.settings.HeadlightAppFolder+tmpSettings.AppCustomizations.Page["Index-Tail-Override"] : 
										pSourceFolder+'html/index-tail.html';
			tmpSettings.Site.Scripts = pSourceFolder+'scripts/**/*.js';

		};


		var setSwillDestination = function(pDestinationFolder)
		{
			// Change the destination folder settings
			var tmpSettings = _Swill.settings;

			// Destination folder redefinition
			tmpSettings.Build.Destination = pDestinationFolder;
			// CSS Less compilation
			tmpSettings.LessCSS.Destination = pDestinationFolder+'login/css/';
			// CSS Sass compilation
			tmpSettings.SassCSS.Destination = pDestinationFolder+'css/';
			// Script compilation for the Pict requirejs app
			tmpSettings.Scripts.Destination = pDestinationFolder+'scripts/';
			// Single-script in-browser dependencies
			tmpSettings.Dependencies.Destination = pDestinationFolder;
			// Any other assets (images; fonts; full libraries; etc.)
			tmpSettings.Assets.Destination = pDestinationFolder;
			// Site agglomeration
			tmpSettings.Site.Destination = pDestinationFolder;

			// Compilation of J
			// var libPath = require('path');
			// Compile from the entrypoint source/Main.js
			_Swill.settings.Compilation.EntryPoint = pDestinationFolder+'/../source/Main.js';
			// Output to the "headlight-app/Headlight-App-Script.js"
			tmpSettings.Compilation.Destination = _Swill.settings.HeadlightAppFolder;
			tmpSettings.Compilation.DestinationScript = 'Headlight-App-Script.js';

		};


		var swill = function()
		{
			if (_Swill) return _Swill;
			// If the swill object has already been created, return it.
			_Swill = require('swill').new(JSON.parse(JSON.stringify(libUnderscore.extend({}, _SettingsDefaults, _SettingsPassed))));
			
			var libPath = require('path');

			// Load the Headlight-App.json and stuff it in the settings object.
			try
			{
				_Swill.settings.AppCustomizations = require(_Swill.settings.HeadlightAppFolder+'Headlight-App.json');
			}
			catch (pError)
			{
				_Swill.settings.AppCustomizations = {Page:{}};
			}

			_Swill.settings.CSS.Less = true;
			_Swill.settings.CSS.Sass = true;

			_Swill.settings.ServerApplication = _Settings.ServerScript;

			// Set the build to go to the static content folder.
			setSwillSource(_Settings.SwillRoot);
			setSwillDestination(_Settings.StaticContentFolder);

			// JS Dependencies
//			_Swill.addDependencyCopy({ Hash:'jquery', Output: 'js/jquery.js', Input:'jquery/dist/jquery.min.js', InputDebug:'jquery/dist/jquery.js'});
//			_Swill.addDependencyCopy({ Hash:'backbone', Output: 'js/backbone.js', Input:'backbone/backbone-min.js', InputDebug:'backbone/backbone.js'});
//			_Swill.addDependencyCopy({ Hash:'underscore', Output: 'js/underscore.js', Input:'underscore/underscore-min.js', InputDebug:'underscore/underscore.js'});
//			_Swill.addDependencyCopy({ Hash:'mousetrap', Output:'js/mousetrap.js', Input:'mousetrap/mousetrap.min.js', InputDebug:'mousetrap/mousetrap.js'});
//			_Swill.addDependencyCopy({ Hash:'moment', Output: 'js/moment.js', Input:'moment/min/moment-with-locales.min.js', InputDebug:'moment/moment.js'});
			_Swill.addDependencyCopy({ Hash:'pict', Output: 'js/pict.js', Input:'pict/dist/pict.min.js', InputDebug:'pict/dist/pict.js'});
			_Swill.addDependencyCopy({ Hash:'require', Output:'js/require.js', Input:'requirejs/require.js'});
			_Swill.addDependencyCopy({ Hash:'jquery.cookie', Output: 'js/jquery.cookie.js', Input:'jquery.cookie/jquery.cookie.js'});
			_Swill.addDependencyCopy({ Hash:'jquery-locationpicker', Output: 'js/locationpicker.jquery.js', Input:'jquery-locationpicker-plugin/dist/locationpicker.jquery.min.js', InputDebug:'jquery-locationpicker-plugin/dist/locationpicker.jquery.js'});
			_Swill.addDependencyCopy({ Hash:'backbone-validation', Output: 'js/backbone-validation.js', Input:'backbone.validation/dist/backbone-validation-min.js', InputDebug:'backbone.validation/dist/backbone-validation.js'});
//			_Swill.addDependencyCopy({ Hash:'google-maps', Output: 'js/google-maps.js', Input:'google-maps/lib/Google.min.js', InputDebug:'google-maps/lib/Google.js'});
			_Swill.addDependencyCopy({ Hash:'google-places', Output: 'js/google-places.js', Input:'google-places/google-places.js', InputDebug:'google-places/google-places.js'});
			_Swill.addDependencyCopy({ Hash:'bootstrap', Output: 'js/bootstrap.js', Input:'bootstrap/dist/js/bootstrap.min.js', InputDebug:'bootstrap/dist/js/bootstrap.js'});
			_Swill.addDependencyCopy({ Hash:'c3', Output: 'js/c3.js', Input:'c3/c3.min.js', InputDebug:'c3/c3.js'});
			_Swill.addDependencyCopy({ Hash:'d3', Output: 'js/d3.js', Input:'d3/d3.min.js', InputDebug:'d3/d3.js'});
			_Swill.addDependencyCopy({ Hash:'marked', Output: 'js/marked.js', Input:'marked/marked.min.js', InputDebug:'marked/lib/marked.js'});
			_Swill.addDependencyCopy({ Hash:'moment-timezone', Output: 'js/moment-timezone.js', Input:'moment-timezone/builds/moment-timezone-with-data.min.js', InputDebug:'moment-timezone/builds/moment-timezone-with-data.js'});
			_Swill.addDependencyCopy({ Hash:'select2', Output: 'js/select2.js', Input:'select2/dist/js/select2.full.min.js', InputDebug:'select2/dist/js/select2.full.js'});
			_Swill.addDependencyCopy({ Hash:'toaster', Output: 'js/toastr.js', Input:'toastr/toastr.min.js', InputDebug:'toastr/toastr.js'});

			// Images and other graphical assets
			_Swill.addAssetCopy({Input:'assets/images/**/*.*', Output:'images/'});
			_Swill.addAssetCopy({Input:'assets/fonts/**/*.*', Output:'fonts/'});

			// Assets from the app itself.  This is tricky.
			var tmpSourceFolder = libPath.resolve(_Swill.settings.Build.Source);
			var tmpAppFolder = libPath.resolve(_Swill.settings.HeadlightAppFolder);
			var tmpRelativePath = libPath.relative(tmpSourceFolder, tmpAppFolder);
			_Swill.addAssetCopy({Input:tmpRelativePath+'/scripts/**/*.*', Output:'headlight-app/scripts/'});
			_Swill.addAssetCopy({Input:tmpRelativePath+'/assets/**/*.*', Output:'headlight-app/assets/'});
			_Swill.addAssetCopy({Input:tmpRelativePath+'/images/**/*.*', Output:'headlight-app/images/'});
			_Swill.addAssetCopy({Input:tmpRelativePath+'/css/**/*.*', Output:'headlight-app/css/'});
			//_Swill.addAssetCopy({Input:_Swill.settings.HeadlightAppFolder+'css/Headlight-App.css', Output:'headlight-app/'});

			// The login page
			_Swill.addAssetCopy({Input:'html/login.html', Output:''});

			// The Headlight App specific javascript files
			_Swill.addAssetCopy({Input:'js/*.js', Output:'js/'});


			// Copy the bootstrap fonts into the web root
			_Swill.addAssetCopy({Input:'bower_components/bootstrap/dist/fonts/**/*.*', Output:'fonts/'});
			_Swill.addAssetCopy({Input:'bower_components/font-awesome/fonts/**/*.*', Output:'fonts/'});

			_Swill.settings.Site.Partials.push(_Settings.HeadlightAppFolder+'**/*.html');

			_Swill.addAssetCopy({Input:libPath.relative(_Settings.SwillRoot,_Settings.HeadlightAppFolder)+'**/*.*', Output:''});
			
			_Swill.addAssetCopy({ Input: 'assets/fonts/**/*.*', Output: 'fonts/'});


			var libBrowserify = require('browserify');
			var libVinylSourceStream = require('vinyl-source-stream');
			var libVinylBuffer = require('vinyl-buffer');
			
//			var libUglify = require('gulp-uglify');
//			var libSourcemaps = require('gulp-sourcemaps');
			var libGulpUtil = require('gulp-util');
			
			var gulp = _Swill.gulp;
			
			// ### TASK: Concatenate all the SDK scripts into one file: sdk-scripts.js
			gulp.task('sdk-scripts-concat', function(){ 
				
				var scripts = [
				    _Swill.settings.Build.Source+'js/sdk.js',
				    _Swill.settings.Build.Source+'headlight-app-backbone/models/**/*.js',
				    _Swill.settings.Build.Source+'headlight-app-backbone/views/**/*.js',
				    _Swill.settings.Build.Source+'headlight-app-backbone/routers/**/*.js'
				];
	
			    return gulp.src(scripts)
						        .pipe(require('gulp-concat')('sdk-scripts.js'))
						        .pipe(gulp.dest(_Swill.settings.Site.Destination+'js/'));
			});
			
			// ### TASK: Build the custom application type script
			gulp.task('sdk-app-type-build', ()=>
			{
				if (!_Swill.settings.AppCustomizations.Page["Site-Type"])
					return;

				var tmpScript = 'headlight-sdk-'+_Swill.settings.AppCustomizations.Page["Site-Type"]+'.js';
				var tmpScriptPath = _Swill.settings.Build.Source+'js/'+_Swill.settings.AppCustomizations.Page["Site-Type"]+'/'+tmpScript;

				libFS.stat(tmpScriptPath, (pError, pFileStats) =>
				{
					if (pError)
					{
						if (pError.code === 'ENOENT')
							return console.log('--> Problem building app type script.  The script file '+tmpScript+' in '+tmpScriptPath+' is missing.');

						return console.log('--> Problem building app type script.  Error accessing script file '+tmpScript+' in '+tmpScriptPath+': '+pError);
					}

					var tmpBrowserify = libBrowserify(
					{
						entries: tmpScriptPath
					});
			
					return tmpBrowserify.bundle()
						.pipe(libVinylSourceStream(tmpScript))
						.pipe(libVinylBuffer())
								.on('error', libGulpUtil.log)
						.pipe(_Swill.gulp.dest(_Swill.settings.Site.Destination+'headlight-app/'));
				});
			});
			
			// ### TASK: compile all script files in the app using Browserify
			gulp.task('app-script-debug',
				function ()
				{
					// set up the custom browserify instance for this task
					var tmpBrowserify = libBrowserify(
					{
						entries: _Swill.settings.HeadlightAppFolder+'/scripts/Headlight-App.js'
					});
			
					return tmpBrowserify.bundle()
						.pipe(libVinylSourceStream('Headlight-App.js'))
						.pipe(libVinylBuffer())
								.on('error', libGulpUtil.log)
						.pipe(_Swill.gulp.dest(_Swill.settings.Site.Destination+'headlight-app/'));
				}
			);
			
			// ### TASK: compile all SASS files in the app
			gulp.task('app-sass', function(){
				var paths = [_Swill.settings.HeadlightAppFolder+'/css/**/Headlight-App.scss'];
			    return gulp.src(paths)
			        .pipe(require('gulp-sass')({
			            style: 'compressed',
			            quiet: false
			        }))
					.pipe(gulp.dest(_Swill.settings.Site.Destination+'headlight-app/'));
			});
		
			// ### TASK: Build and stage the full application
			gulp.task('build', ['less', 'sass', 'site-copy', 'asset-copy', 'dependencies', 'sdk-scripts-concat', 'sdk-app-type-build', 'app-script-debug', 'app-sass']);
		
			// ### TASK: Build and stage the full application for debug
			gulp.task('build-debug', ['less-debug', 'sass-debug', 'site-copy-debug', 'asset-copy', 'dependencies-debug', 'sdk-scripts-concat', 'sdk-app-type-build', 'app-script-debug', 'app-sass']);

			return _Swill;
		};

		/**
		* Container Object for our Factory Pattern
		*/
		var tmpNewApp = (
		{
			orator: orator,

			swill: swill,

			new: createNew
		});

		return tmpNewApp;
	};

	return createNew();
};

module.exports = new HeadlightApp();
