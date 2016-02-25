"use strict";

(function()
{
	var root = this;
	var appModule = function()
	{
	}

	if( typeof exports !== 'undefined' )
	{
		if( typeof module !== 'undefined' && module.exports )
		{
			exports = module.exports = appModule;
		}
		exports.mymodule = appModule;
	} 
	else
	{
		root.mymodule = appModule
	}
}).call(this);