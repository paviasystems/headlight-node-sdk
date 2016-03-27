/** vim: et:ts=4:sw=4:sts=4
 * Headlight App Basic Framework
 * @license Pavia Systems Closed Source License
 */

// TODO: Eventually create an open source module on pict to do the module loading and such
pict.features = {};

headlight = {};

headlight.loadModule = function(pModuleName)
{
	var tmpModuleName = (typeof(pModuleName) === 'undefined') ? false : pModuleName;

	// Load the first module if a module name isn't provided
	if (!tmpModuleName)
	{
		if ($.isEmptyObject(pict.features))
			// There are no modules defined, we are failing.
			return false;

		// Get the name of the first property
		tmpModuleName = Object.keys(pict.features)[0];
	}

	// Load the module (maybe wrap this in try catch eventually)
	if (pict.features[tmpModuleName].hasOwnProperty('initialize'))
	{
		console.log('--> Auto initializing Headlight App: '+tmpModuleName);
		pict.features[tmpModuleName].initialize();
	}
};

headlight.checkSessionStatus = function()
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

				// Put the User name in the header
				$(".fullUserName").text(pData.NameFirst + " " + pData.NameLast);	

				// Set the customer logo from the top left of the UX
				$('#HeaderLogoImage').attr("src", 'headlight-app/Headlight-App-Logo.png');

				// Write the page form content
				$('#appNavigationContainer').html(pict.libs.underscore.template($('#PageHeadlight_App_Navigation').text()));
				$('#appContentContainer').html(pict.libs.underscore.template($('#PageHeadlight_App_Form').text()));
				$('#appFooterContainer').html(pict.libs.underscore.template($('#PageHeadlight_App_Footer').text()));
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
