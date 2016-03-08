// ##### Part of the Headlight platform SDK (https://developer.paviasystems.com/)
/**
* @license MIT
* @author <steven.velozo@paviasystems.com>
*/
var libUnderscore = require('underscore');

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

				// By default, Apps authenticate and proxy to the QA environment
				AuthenticationServerURL: "http://headlight.qa.paviasystems.com/1.0/",
				// Pass through the POST authentication API
				AuthTypes: ['POST'],

				// The folder to serve static web files from for this app.
				// By default, use the Stage folder in the INCLUDING module.
				// This expects "mymodule/node_modules/headlight-nodesk/server"
				StaticContentFolder: __dirname+'/../../../stage/',
				HeadlightAppFolder: __dirname+'/../../../headlight-app/',

				// The server application to use (by default our built-in nodesdk server)
				ServerScript: __dirname+'/Headlight-NodeSDK-Server.js',

				// The swill root (used for the sourcing of all the assets etc)
				SwillRoot: __dirname+'/../',

				APIServerPort: 8080,
				SessionTimeout: 60,

				// By default use the in-memory session store
				SessionStrategy: "InMemory",

				// Use what most Headlight docker instances use for memcache
				MemcachedURL: "192.168.99.100:11211",

				// Load a config file if it is available
				ConfigFile: __dirname+"/../Headlight-App-Config.json"
			});
		// Map in the passed-in settings and default settings
		var _Settings = libUnderscore.extend({}, _SettingsDefaults, (typeof(pSettings) === 'object') ? pSettings : {});

		var _Orator = false;
		var orator = function()
		{
			// If the web server is already initialized, return it.
			if (_Orator) return _Orator;

			// Build the orator web server, assign it to the module variable.
			_Orator = require('orator').new(_Settings);

			// Map in the proxy Authentication
			var _OratorSessionHttpAuth = require('orator-session-remoteauth').new(_Orator);
			_OratorSessionHttpAuth.connectRoutes(_Orator.webServer);

			// Map the staged web site to a static server on all other root requests
			_Orator.addStaticRoute(_SettingsDefaults.StaticContentFolder);

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
			tmpSettings.Site.Head = pSourceFolder+'html/index-head.html';
			tmpSettings.Site.Partials = (
				[
					pSourceFolder+'html/templates/**/*.html',
					pSourceFolder+'html/static/**/*.html',
					pSourceFolder+'html/pict/**/*.html',
					pSourceFolder+'html/recordsets/**/*.html'
				]);
			tmpSettings.Site.Tail = pSourceFolder+'html/index-tail.html';
			tmpSettings.Site.Scripts = pSourceFolder+'scripts/**/*.js';
		};


		var setSwillDestination = function(pDestinationFolder)
		{
			// Change the destination folder settings
			var tmpSettings = _Swill.settings;

			// Destination folder redefinition
			tmpSettings.Build.Destination = pDestinationFolder;
			// CSS Less compilation
			tmpSettings.LessCSS.Destination = pDestinationFolder+'css/';
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
			var libPath = require('path');
			// Compile from the entrypoint source/Main.js
			_Swill.settings.Compilation.EntryPoint = pDestinationFolder+'/../source/Main.js';
			// Output to the "headlight-app/Headlight-App-Script.js"
			tmpSettings.Compilation.Destination = pDestinationFolder+'/../headlight-app/';
			tmpSettings.Compilation.DestinationScript = 'Headlight-App-Script.js';

		};


		var swill = function()
		{
			if (_Swill) return _Swill;
			// If the swill object has already been created, return it.
			_Swill = require('swill');

			_Swill.settings.CSS.Less = true;

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
			// Assets from the app itself
			_Swill.addAssetCopy({Input:'../../assets/images/**/*.*', Output:'images/'});


			// Copy the bootstrap fonts into the web root
			_Swill.addAssetCopy({Input:'bower_components/bootstrap/dist/fonts/**/*.*', Output:'fonts/'});
			_Swill.addAssetCopy({Input:'bower_components/font-awesome/fonts/**/*.*', Output:'fonts/'});

			_Swill.settings.Site.Partials.push(_Settings.HeadlightAppFolder+'**/*.html');

			var libPath = require('path');
			_Swill.addAssetCopy({Input:libPath.relative(_Settings.SwillRoot,_Settings.HeadlightAppFolder)+'**/*.*', Output:''});

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
