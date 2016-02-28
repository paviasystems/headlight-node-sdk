"use strict";
// Script here!
var HeadlightApp = {};


// Initialize the Headlight App
HeadlightApp.initialize = function(pPict)
{
	console.log('Test app initializing!');
	$('#demoAppForm').submit(
		function()
		{
			console.log('PROCESSING CALCULATOR...');

			var tmpLeft = $('#left_value').val();
			var tmpRight = $('#right_value').val();

			var tmpResult = tmpLeft+tmpRight;

			// Ridiculous
			$('#demoResult').html('['+tmpLeft+'] + ['+tmpRight+'] = ['+tmpResult+']');

			return false;
		});
};