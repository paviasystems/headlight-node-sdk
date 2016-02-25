/**
* This file is the skeleton framework for running Headlight Simulations
*
* @author      Steven Velozo <steven.velozo@paviasystems.com>
*
* @description Main RequireJS application.
*/
if (typeof define !== 'function') { var define = require('amdefine')(module); }

define
(
	["pict/Pict",
		"Application-Bundles",
		// The Retold services that are expected to run by the app
		'BundleUsers', 
		'BundleSession'],
	function(Pict,
		ApplicationBundles,
		BundleUsers, 
		BundleSession)
	{
		// Deal with authentication etc.
		console.log('Starting the Pavia Simulation Shell...');
		// Instantiate the Pict framework
		var _Pict = Pict;
		// Set the site prefix to Headlight
		// TODO: Put prefix on here for stage, etc.
		_Pict.sitePrefix = 'Headlight App';
		// Initialize the router
		_Pict.routermanagement.Initialize(_Pict);

		// Inject helpers
//		ApplicationHelperFunctions.New(_Pict);

		// Configure Security
		var _Session = BundleSession.New(_Pict.router, _Pict);

		// Now check if the user is logged in or not.  Pict will set the ux state properly.
		_Pict.session.ValidateAuthenticated();

		// Now set the default route... this could branch by user type easily.
		var defaultRoute = function()
		{
//			_Projects.GetProjectDashboard().DataControllers.DisplayList({Paging: {CurrentPage:0, PageSize:4}});
		};
		_Pict.routermanagement.SetDefaultRoute(defaultRoute);

		// Setup what happens when a route goes off.
		var _AutoCloseModals = [];
		// Add a function to pict to track these modals
		_Pict.RegisterAutoCloseModal = function(pModal)
		{
			_AutoCloseModals.push(pModal);
		};
		_Pict.router.on
		(
			"route",
			function(pRoute, pParameters)
			{
				// Close any open modals that are registered to autoclose
				var tmpAutoCloseModals = _AutoCloseModals;
				_AutoCloseModals = [];
				for (var i = 0; i < tmpAutoCloseModals.length; i++)
				{
					tmpAutoCloseModals[i].modal('hide');
				}

				// Scroll to the header on route change.
				var tmpHeader = $('#TitleText');
				if (tmpHeader.length > 0)
				{
					$('#navbar-main').scrollViewFast();
					// Also set the browser tab text to the header text
					document.title = _Pict.sitePrefix+' - '+$(tmpHeader).text();
				}
			}
		);

		var oApplication = ({});
	}
);