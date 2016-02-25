/**
* This file provides boilerplate record paging with Require.js and Backbone.js
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*
* @description Boilerplate Javascript Record Paging
*/
if (typeof define !== 'function') { var define = require('amdefine')(module); }

define
(
	function()
	{
		function oNew()
		{
			var DisplayPagingControl = function(pReadListOptions, pPict)
			{
				// TODO: Add caching here?  Right now it gets the total every time the list loads
				pReadListOptions.Paging.CountFunction(
					{
						ProcessRecordFunction: function(pRecordCount)
						{
							// Set the record count
							pReadListOptions.Paging.TotalRecordSetCount = pRecordCount;
							// Now render the paging control with that state.
							RenderPagingControl(pReadListOptions, pPict);
						},
						ListFilterPrefix: pReadListOptions.ListFilterPrefix,
						ListFilter: pReadListOptions.ListFilter
					}
				);
			};

			var RenderPagingControl = function(pReadListOptions, pPict)
			{
				var tmpPagingControl = pReadListOptions.Paging.PagingTemplate({Parameters:pReadListOptions, Pict:pPict });

				for(var i = 0; i < pReadListOptions.Paging.Targets.length; i++)
				{
					$(pReadListOptions.Paging.Targets[i]).html(tmpPagingControl);
				}
			};

			var oPagingControl = (
			{
				New: oNew,
				DisplayPagingControl: DisplayPagingControl,
				RenderPagingControl: RenderPagingControl
			});

			return oPagingControl;
		}

		return oNew;
	}
);