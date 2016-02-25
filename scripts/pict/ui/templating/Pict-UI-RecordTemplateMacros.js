/**
* This file is the record template macros, for the meta templates (and others)
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*
* @description Record Template Macros
*/
if (typeof define !== 'function') { var define = require('amdefine')(module); }

define
(
	function()
	{
		if (typeof(_ApplicationTemplates) !== 'undefined') return _ApplicationTemplates;
		var _ApplicationTemplates;

		var oNew = function(pPict)
		{
			var _Pict = pPict;

			// Template caches
			var _Templates = {};

			var getTemplate = function(pTemplateType, pTemplateRenderer)
			{
				var tmpTemplateRenderer = (typeof(pTemplateRenderer) === 'undefined') ? 'Default' : pTemplateRenderer;
				var tmpTemplateID = pTemplateType+'_'+tmpTemplateRenderer;
				// If the template is not cached, cache it
				if (!_Templates.hasOwnProperty(tmpTemplateID))
				{
					// Cache it
					var tmpTemplateString = $('#Template_'+tmpTemplateID);
					if (tmpTemplateString.size() === 0)
					{
						// Surpress the error message for row headers, since this is expected behavior often (when they want default headers but not column value templates)
						if (pTemplateType !== 'RowHeader')
							console.log('   Invalid Template Requested: '+tmpTemplateID);
						// Try to fall back to default if it isn't default
						if (tmpTemplateRenderer !== 'Default')
							return getTemplate(pTemplateType, 'Default');
						return false;
					}
					tmpFilterTemplate = _.template(tmpTemplateString.text());
					_Templates[tmpTemplateID] = tmpFilterTemplate;
				}
				// User the cached version of the template
				return _Templates[tmpTemplateID];
			};

			// Parse Template
			/*
				Options:
				{
					Type: 'Row',
					Hash: undefined,

					Title: ''
				}
			*/
			var parseTemplate = function(pTemplateType, pOptions, pRecord)
			{
				if (typeof(pOptions) !== 'object')
				{
					return '';
				}

				var tmpTemplate = getTemplate(pTemplateType, pOptions.Renderer);

				if (!tmpTemplate)
				{
					return '';
				}

				return tmpTemplate({Options: pOptions, Record: pRecord, Pict:_Pict});
			};

			var parseTemplateInput = function(pTemplateType, pOptions, pRecord)
			{
				if (typeof(pOptions) !== 'object')
				{
					return '';
				}

				var tmpTemplate = getTemplate(pTemplateType, pOptions.InputRenderer);

				if (!tmpTemplate)
				{
					return '';
				}

				return tmpTemplate({Options: pOptions, Record: pRecord, Pict:_Pict});
			};

			var parseTemplateRecord = function(pTemplateType, pOptions, pRecord)
			{
				if (typeof(pOptions) !== 'object')
				{
					return '';
				}

				var tmpTemplate = getTemplate(pTemplateType, pOptions.RecordRenderer);

				if (!tmpTemplate)
				{
					return '';
				}

				return tmpTemplate({Options: pOptions, Record: pRecord, Pict:_Pict});
			};

			////////// Singleton Object //////////
			_ApplicationTemplates = (
			{
				Parse: parseTemplate,
				ParseRecord: parseTemplateRecord,
				ParseInput: parseTemplateInput
			});
			return _ApplicationTemplates;
		};

		return { New:oNew };
	}
);