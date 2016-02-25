/**
* Retold Session Management Wire-up
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/
if (typeof define !== 'function') { var define = require('amdefine')(module); }

define
(
	['pict/record/controller/Pict-RecordController'],
	function(RecordController)
	{
		if (typeof(oBundle) !== 'undefined') return oBundle;

		////////// Initialize the bundle with the application //////////
		function oNew(pPict)
		{
			var _Pict = pPict;

			var _User = RecordController('User');
			_User.Initialize();


			var oBundleController = (
			{
			});

			return oBundleController;
		}

		////////// Return Object //////////
		var oBundle = (
		{
			New: oNew
		});

		return oBundle;
	}
);

