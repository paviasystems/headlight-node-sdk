/**
* Basic Bundle Creation Module
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
		////////// Initialize the bundle with the application //////////
		function oNew(pPict, pDataSetHash, pMeadowHash, fConfigureBundle)
		{
			var tmpConfigureBundle = (typeof(fConfigureBundle) === 'function') ? fConfigureBundle : function() {};

			// This assumes no config, as the PICT config will manage the basics for simple recordsets
			var _Bundle = RecordController(pDataSetHash, pMeadowHash);
			tmpConfigureBundle(_Bundle);
			_Bundle.Initialize();

			pPict.controllers.addEntity((typeof(pMeadowHash) !== 'undefined') ? pMeadowHash : pDataSetHash, _Bundle);

			return _Bundle;
		}

		////////// Return Object //////////
		var oBundle = (
		{
			New: oNew
		});

		return oBundle;
	}
);

