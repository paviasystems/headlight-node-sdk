/**
* This file provides boilerplate record access operation route wireups to the UI.
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*
* @description Boilerplate Javascript Record Access
*/
if (typeof define !== 'function') { var define = require('amdefine')(module); }

define
(
	function()
	{
		function oNew(pApplicationDataOperations, pPict)
		{
			////////// CONFIGURATION STATE //////////
			var _Pict = pPict;
			var _ApplicationDataOperations = pApplicationDataOperations;

			var _Authorizers;

			// This is for any funcion hooks after we've initialized a view
			var _PreInitializeHooks;
			var _PostInitializeHooks;

			// This is for the state of the list routes (to get the last used route, returning to the right view magically)
			var _RouteLastList;

			////////// INITIALIZATION //////////
			function doInitialize(pRouter)
			{
				doConnectRoutes(pRouter);

				// Create an Authenticator collection
				_Authorizers = {};

				// By default, any logged in user has List/Read access
				_Authorizers.List = doValidateAuthorization;
				_Authorizers.Read = doValidateAuthorization;

				// By default the Create/Edit/Delete actions require administrator priveleges
				_Authorizers.Create = doValidateAuthorization;
				_Authorizers.Update = doValidateAdministrator;
				_Authorizers.Delete = doValidateAuthorization;

				_PreInitializeHooks = [];
				_PostInitializeHooks = [];

				_RouteLastList = false;

				return true;
			}

			function doConnectRoutes(pRouter)
			{
				// Wire up the routes if a valid router was passed in
				if (typeof(pRouter) !== 'undefined')
				{
					var tmpDataSetHash = _ApplicationDataOperations.Config.DataSetHash;

					// Wire up routes!
					pRouter.route(tmpDataSetHash+"create", "create"+tmpDataSetHash, displayCreate);
					pRouter.route(tmpDataSetHash+"createanother", "createanother"+tmpDataSetHash, displayCreateAnother);
					pRouter.route(tmpDataSetHash+"list", "list"+tmpDataSetHash, displayListRoute);
					pRouter.route(tmpDataSetHash+"list/:pFilter", "list/:pFilter"+tmpDataSetHash, displayListFilteredRoute);
					pRouter.route(tmpDataSetHash+"list/:pPageIndex/:pEntriesPerPage", "list/:pPageIndex/:pEntriesPerPage"+tmpDataSetHash, displayListRoute);
					pRouter.route(tmpDataSetHash+"list/:pFilter/:pPageIndex/:pEntriesPerPage", "list/:pFilter/:pPageIndex/:pEntriesPerPage"+tmpDataSetHash, displayListFilteredRoute);
					pRouter.route(tmpDataSetHash+"read/:pGUIDRecord", "view"+tmpDataSetHash, displayRecordRoute);
					pRouter.route(tmpDataSetHash+"edit/:pGUIDRecord", "edit"+tmpDataSetHash, editRecordRoute);
					pRouter.route(tmpDataSetHash+"duplicate/:pGUIDRecord", "duplicate"+tmpDataSetHash, duplicateRecordRoute);
					pRouter.route(tmpDataSetHash+"delete/:pGUIDRecord", "delete"+tmpDataSetHash, deleteRecordRoute);
					pRouter.route(tmpDataSetHash+"deleteconfirm/:pGUIDRecord", "deleteconfirm"+tmpDataSetHash, deleteRecordConfirmedRoute);
				}
			}


			////////// DATA ACCESS //////////
			function setAuthorizer(pAction, fAuthorizor)
			{
				_Authorizers[pAction] = fAuthorizor;
			}
			function getDataOperations()
			{
				return _ApplicationDataOperations;
			}

			function setPostInitializeHook(pOperation, fPostInitializeHook)
			{
				_PostInitializeHooks[pOperation] = fPostInitializeHook;
			}

			function setPreInitializeHook(pOperation, fPreInitializeHook)
			{
				_PreInitializeHooks[pOperation] = fPreInitializeHook;
			}


			////////// AUTHORIZATION VALIDATORS //////////
			function doAuthorize(pAction, pRedirectContent)
			{
				if (!_Pict.session.initialized) return false;

				var tmpAuthorizer = _Authorizers[pAction];

				if (typeof(tmpAuthorizer) === 'function')
					return tmpAuthorizer(pRedirectContent);

				// If there isn't an authorizer for this action, default to administrator.
				return doValidateAdministrator(pRedirectContent);
			}


			function doValidateAuthorization(pRedirectContent)
			{
				// Check that the user is logged in.
				if (_Pict.session.ValidateAuthenticated())
					return true;

				var tmpRedirectContent = false;
				if (typeof(pRedirectContent) === 'undefined')
					return;

				if (tmpRedirectContent)
					_Pict.WriteContent(tmpRedirectContent);

				return false;
			}

			function doValidateAdministrator(pRedirectContent)
			{
				if (doValidateAuthorization(false) && (_Pict.session.record.UserRoleIndex > 4))
					return true;


				var tmpRedirectContent = false;
				if (typeof(pRedirectContent) === 'undefined')
					tmpRedirectContent = 'AccessDenied';
				if (tmpRedirectContent)
					_Pict.WriteContent(tmpRedirectContent);

				return false;
			}

			function doValidateManagement(pRedirectContent)
			{
				if (doValidateAuthorization(false) && (_Pict.session.record.UserRoleIndex > 3))
					return true;


				var tmpRedirectContent = false;
				if (typeof(pRedirectContent) === 'undefined')
					tmpRedirectContent = 'AccessDenied';
				if (tmpRedirectContent)
					_Pict.WriteContent(tmpRedirectContent);

				return false;
			}

			function doValidateUser(pRedirectContent)
			{
				if (doValidateAuthorization(false) && (_Pict.session.record.UserRoleIndex > 0))
					return true;


				var tmpRedirectContent = false;
				if (typeof(pRedirectContent) === 'undefined')
					tmpRedirectContent = 'AccessDenied';
				if (tmpRedirectContent)
					_Pict.WriteContent(tmpRedirectContent);

				return false;
			}



			////////// Routing Wireup //////////
			function displayCreate()
			{
				if (!_Pict.session.initialized) return;
				if (!doAuthorize('Create'))
					return false;

				// Load the user edit page
				_Pict.WriteContent(_ApplicationDataOperations.Config.DataSetHash+'_Update');
				_ApplicationDataOperations.Create.DisplayCreateRecord();
			}

			function displayCreateAnother()
			{
				if (!_Pict.session.initialized) return;

				if (!doAuthorize('Create'))
					return false;

				// Load the user edit page
				_ApplicationDataOperations.SetPostOperationURI('Update', false);
				_Pict.WriteContent(_ApplicationDataOperations.Config.DataSetHash+'_Update');
				_ApplicationDataOperations.DisplayCreateRecord();
			}

			// TODO: Fix this, but first fix search.
			function displayListFilteredRoute(pFilter, pPageIndex, pEntriesPerPage)
			{
				// This is confusing because we sometimes get null values from Backbone.js routers
				var tmpPageIndex = (typeof(pPageIndex) === 'undefined') ? 0 : pPageIndex;
				tmpPageIndex = (tmpPageIndex) ? tmpPageIndex : 0;
				var tmpEntriesPerPage = (typeof(pEntriesPerPage) === 'undefined') ? _ApplicationDataOperations.ReadList.Options.Paging.PageSize : pEntriesPerPage;
				tmpEntriesPerPage = (tmpEntriesPerPage) ? tmpEntriesPerPage : _ApplicationDataOperations.ReadList.Options.Paging.PageSize;
				return displayList(
				{
					ListFilterPrefix: '/FilteredTo',
					ListFilter: pFilter,
					Paging: {
						CurrentPage:tmpPageIndex,
						PageSize:tmpEntriesPerPage
					}
				});
			}
			function displayListRoute(pPageIndex, pEntriesPerPage)
			{
				// This is confusing because we sometimes get null values from Backbone.js routers
				var tmpPageIndex = (typeof(pPageIndex) === 'undefined') ? 0 : pPageIndex;
				tmpPageIndex = (tmpPageIndex) ? tmpPageIndex : 0;
				var tmpEntriesPerPage = (typeof(pEntriesPerPage) === 'undefined') ? _ApplicationDataOperations.ReadList.Options.Paging.PageSize : pEntriesPerPage;
				tmpEntriesPerPage = (tmpEntriesPerPage) ? tmpEntriesPerPage : _ApplicationDataOperations.ReadList.Options.Paging.PageSize;
				return displayList(
				{
					Paging: {
						CurrentPage:tmpPageIndex,
						PageSize:tmpEntriesPerPage
					}
				});
			}

			function displayList(pOptions)
			{
				if (!_Pict.session.initialized)
					return false;
				if (!doAuthorize('List'))
					return false;

				var tmpCurrentRoute = Backbone.history.fragment;
				if 	(
						// If the page isn't set or is 0, and the route isn't the last route loaded, and there is no filter, and a route was loaded previously, go to the current page
						((typeof(pOptions.Paging.CurrentPage) === 'undefined') || pOptions.Paging.CurrentPage === 0) && (tmpCurrentRoute != _RouteLastList) && (typeof(pOptions.ListFilter) === 'undefined') && _RouteLastList
					)
				{
					_Pict.router.navigate('#'+_RouteLastList, {trigger: true, replace: true});
					return false;
				}

				_RouteLastList = tmpCurrentRoute;

				// TODO: This is cheating ... use Pict Getter here
				var tmpContainerDivExists = ($('#ContainerRows_'+_ApplicationDataOperations.Config.DataSetHash).length > 0);
				if (!tmpContainerDivExists)
				{
					// Only show the content wrappers if necessary
					_Pict.WriteContent(_ApplicationDataOperations.Config.DataSetHash+'_ReadList');

					// Now load the list table design
					// Determine if this list is actually a sub to another recordset.
					if ('DisplayListContainer' in _ApplicationDataOperations.Config.PreOperationHooks)
					{
						// Pass in a lambda for loading the list after the container is done
						pOptions.ListDisplayFunction = function() { _ApplicationDataOperations.ReadList.ReadRecordList(pOptions); };
						_ApplicationDataOperations.Config.PreOperationHooks.DisplayListContainer(pOptions);
					}
					else
					{
						_ApplicationDataOperations.ReadList.DisplayListContainer();
						_ApplicationDataOperations.ReadList.ReadRecordList(pOptions);
					}
				}
				else
				{
					_ApplicationDataOperations.ReadList.ReadRecordList(pOptions);
				}
			}

			function displayRecordRoute(pGUIDRecord)
			{
				displayRecord({IDRecord: pGUIDRecord});
			}
			function displayRecord(pReadOptions)
			{
				if (!_Pict.session.initialized) return;
				if (!doAuthorize('Read'))
					return false;

				// Load the user list page
				_Pict.WriteContent(_ApplicationDataOperations.Config.DataSetHash+'_Read');
				_ApplicationDataOperations.Read.ReadRecord(pReadOptions);
			}
			// Only display the record if it is not already there.
			function displayRecordSafe(pReadOptions, fCallback)
			{
				// Check if the record is there if it is, just reload the expense list
				var tmpProjectContainer = $('div.pictRecordViewContainer[DataSetHash='+_ApplicationDataOperations.Config.DataSetHash+'][ID='+pReadOptions.IDRecord+']');
				if (tmpProjectContainer.length > 1)
				{
					// The record is there -- just do our callback
					fCallback(pReadOptions);
				}
				else
				{
					// The record is not currently on screen; display it then do our callback in the Process Record Function
					var tmpReadOptions = pReadOptions;
					tmpReadOptions.ProcessRecordFunction = function(pRecord)
					{
						_ApplicationDataOperations.Read.DisplayRecord(pRecord);
						fCallback(pRecord);
					};
					displayRecord(tmpReadOptions);
				}
			}
			function editRecordRoute(pGUIDRecord)
			{
				editRecord({IDRecord: pGUIDRecord});
			}
			function editRecord(pOptions)
			{
				if (!_Pict.session.initialized) return;
				if (!doAuthorize('Update'))
					return false;

				// Load the user edit page
				_Pict.WriteContent(_ApplicationDataOperations.Config.DataSetHash+'_Update');
				_ApplicationDataOperations.Update.UpdateRecord(pOptions);
			}

			function duplicateRecordRoute(pGUIDRecord)
			{
				duplicateRecord({IDRecord:pGUIDRecord});
			}
			function duplicateRecord(pOptions)
			{
				if (!_Pict.session.initialized) return;
				if (!doAuthorize('Update'))
					return false;

				// Load the user edit page
				_Pict.WriteContent(_ApplicationDataOperations.Config.DataSetHash+'_Update');
				_ApplicationDataOperations.Duplicate.DuplicateRecord(pOptions);
			}


			function deleteRecordRoute(pGUIDRecord)
			{
				deleteRecord({IDRecord: pGUIDRecord});
			}
			function deleteRecord(pDeleteOptions)
			{
				if (!_Pict.session.initialized) return;
				if (!doAuthorize('Delete'))
					return false;

				_Pict.WriteContent(_ApplicationDataOperations.Config.DataSetHash+'_Delete');
				_ApplicationDataOperations.Delete.DeleteRecord(pDeleteOptions);
			}

			function deleteRecordConfirmedRoute(pGUIDRecord)
			{
				deleteRecordConfirmed({IDRecord: pGUIDRecord});
			}
			function deleteRecordConfirmed(pDeleteOptions)
			{
				if (!_Pict.session.initialized) return;
				if (!doAuthorize('Delete'))
					return false;

				_Pict.WriteContent(_ApplicationDataOperations.Config.DataSetHash+'_Delete');
				_ApplicationDataOperations.Delete.DeleteRecordConfirmed(pDeleteOptions);
			}


			////////// RETURN OBJECT //////////
			var oDataController = (
			{
				Initialize: doInitialize,
				SetAuthorizer: setAuthorizer,
				ConnectRoutes: doConnectRoutes,
				GetDataOperations: getDataOperations,
				SetPreInitializeHook: setPreInitializeHook,
				SetPostInitializeHook: setPostInitializeHook,
				DisplayList: displayList,
				DisplayRecord: displayRecord,
				DisplayRecordSafe: displayRecordSafe,

				ValidateManagement: doValidateManagement,
				ValidateUser: doValidateUser,

				New: oNew
			});

			return oDataController;
		}

		return oNew;
	}
);