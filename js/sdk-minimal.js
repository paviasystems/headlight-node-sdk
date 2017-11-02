/* global pict */
/* global window */
/* global $ */

if (typeof(pict) === 'undefined')
    pict = {};
if (typeof(pict.features) === 'undefined')
    pict.features = {};
if (typeof(pict.features.HeadlightApp) === 'undefined')
    pict.features.HeadlightApp = {};

pict.features.HeadlightApp.checkSessionStatus = function (fCallBack)
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
                //$('#appContentContainer').html(pict.libs.underscore.template($('#PageHeadlight_App_Form').text()));
                $('#appFooterContainer').html(pict.libs.underscore.template($('#PageHeadlight_App_Footer').text()));

				// Put the User name in the header
				$('.fullUserName').text(pData.NameFirst + ' ' + pData.NameLast);

                fCallBack(pData);
			}
			else
			{
				// Reload to get the login page.
				window.location.reload();
				fCallBack(false);
			}
		}
	)
	.fail
	(
	    function ()
	    {
	        fCallBack(false);
	    }
    );
};

pict.features.HeadlightApp.loadAppManifest = function ()
{
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
			    if ((typeof(pData) !== 'object') ||
				    (typeof(pData.AppHash) !== 'undefined') && (pData.UserID !== 'undefined'))
				    return false;

				var tmpModuleName = pData.AppHash;

				// Load the module (maybe wrap this in try catch eventually)
				if(!pict.features[tmpModuleName])
                    pict.features[tmpModuleName] = {};

				if (pict.features[tmpModuleName].hasOwnProperty('initialize'))
				{
					console.log('--> Auto initializing Headlight App: '+tmpModuleName);
					// Put convenience value into the pict.features.HeadlightApp object for last loaded app
					pict.features.HeadlightApp.LastLoadedApp = tmpModuleName;
					pict.features[tmpModuleName].initialize(pict.session);
					pict.features[tmpModuleName].start(pData);
				}

				if(pData.AppName)
				{
				    document.title = 'Pavia Systems - ' + pData.AppName;
				}
			}
		}
	)
	.fail
	(
		function () {} // We might want this to do something.
	);
};
