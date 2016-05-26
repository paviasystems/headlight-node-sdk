/* global pict */
/* global $ */

pict.features = pict.features || {};

var HeadlightApp= pict.features.HeadlightApp = {};

HeadlightApp.checkSessionStatus = function()
{
	$.ajax
	(
		{
			type: 'GET',
			url: '1.0/CheckSession',
			datatype: 'json',
			async: true
		}
	)
	.done
	(
		function (pData)
		{
			if ((typeof(pData) === 'object') && 
				(typeof(pData.UserID) !== 'undefined') && (pData.UserID !== 'undefined') &&
				(typeof(pData.LoggedIn) !== 'undefined') && (pData.LoggedIn))
			{
				// We are logged in.  Set the pict.session object to be this.
				pict.session = pData;

				// Put the hidden User ID into the wrapper -- this is for Selenium mostly
				$('#wrapper #HeadlightLoggedInUserID').remove();
				$('#wrapper').append('<input type="hidden" id="HeadlightLoggedInUserID" value="'+pData.UserID+'">');

				// Write the page form content
                $('#appNavigationContainer').html(pict.libs.underscore.template($('#PageHeadlight_App_Navigation').text()));
                $('#appContentContainer').html(pict.libs.underscore.template($('#PageHeadlight_App_Form').text()));
                $('#appFooterContainer').html(pict.libs.underscore.template($('#PageHeadlight_App_Footer').text()));

				// Put the User name in the header
				$(".fullUserName").text(pData.NameFirst + " " + pData.NameLast);	

				// Now load the module
				HeadlightApp.loadModule();
			}
			else
			{
				// Reload to get the login page.
				location.reload();
			}
		}
	)
	.fail
	(
		function ()
		{
			// This indicates connectivity issues
		}
	);
};

HeadlightApp.initialize = function(){
 
    HeadlightApp.checkSessionStatus();   
    HeadlightApp.bootstrap();
    
};

HeadlightApp.start = function(appData){
    
    new DefaultRouter();
    new ProjectsRouter();
    new RecordsRouter({ recordHash: appData.AppRecordHash });
    
    Backbone.history.start();
    
};

HeadlightApp.bootstrap = function(){
    
    Backbone.ajax = function(params){
        
        var success = params.success;
        params.success = function(data, type, xhr){
            if(data && data.Error){
                if(params.error){
                    params.error.call(this, xhr, xhr.responseText, null);
                }
            }
            else if(success) {
                success.call(this, data);
            }
        };
        
        return Backbone.$.ajax.apply(Backbone.$, arguments);
    };
    
    var typeToClass = {
        'boolean': Boolean,
        'number': Number,
        'string': String,
        'array': Array,
        'regexp': RegExp,
        'function': Function
    };
    
    _.extend(Backbone.Validation.validators, {
        type: function(value, attr, customValue, model){
            if(typeToClass[typeof(value)] !== customValue) return 'Not the correct type.';
        },
        enum: function(value, attr, customValue, model){
            if(!customValue || customValue.indexOf(value) < 0) return 'Not a valid value';
        }
    });
};


HeadlightApp.loadModule = function(pModuleName)
{
	var tmpModuleName = (typeof(pModuleName) === 'undefined') ? false : pModuleName;

	if ($.isEmptyObject(pict.features) || typeof(pict.features.HeadlightApp) === 'undefined' )
		// There are no modules defined, or the HeadlightApp framework isn't loaded.  We are failing.
		return false;

	// AJAX Load the solo app manifest
	$.ajax
	(
		{
			type: 'GET',
			url: 'headlight-app/Headlight-App.json',
			datatype: 'json',
			async: true
		}
	)
	.done
	(
		function (pData)
		{
			if (typeof(pData) === 'object')
			{
				tmpModuleName = pData.AppHash;
				// Load the module (maybe wrap this in try catch eventually)
				if (pict.features[tmpModuleName].hasOwnProperty('initialize'))
				{
					console.log('--> Auto initializing Headlight App: '+tmpModuleName);
					pict.features[tmpModuleName].initialize(pict.session);
					HeadlightApp.start(pData);
				}
			}
		}
	)
	.fail
	(
		function () {} // We might want this to do something.
	);
};

