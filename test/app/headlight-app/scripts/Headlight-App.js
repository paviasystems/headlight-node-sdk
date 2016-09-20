// Sample Headlight-App script below
/* global pict */
/* global $ */
"use strict";

// Script wire-up through pict-feature here!
pict.features.AppendorExample = {};

pict.features.AppendorExample.initialize = function(pSession)
{
	console.log('Test app initializing!');
};

// Initialize the Headlight App
pict.features.AppendorExample.load = function(pRecord, pProject, pSession)
{
	var HeadlightApp = pict.features.HeadlightApp;
	// Load the template
	var template = _.template($('#AppendorExample_Main').html());
	$('#headlight-app').html(template(pRecord));
	//if (pRecord.IDAppData === 0){}
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
		
	$('.save-calculation').on('click', function(){

		var tmpLeft = $('#left_value').val();
		var tmpRight = $('#right_value').val();
		
		pRecord.model.Left = tmpLeft;
		pRecord.model.Right = tmpRight;
		
		pRecord.Title = pRecord.model.Title = tmpLeft + ' + ' + tmpRight;
		pRecord.Description = 'Appending of ' + tmpLeft + ' and ' + tmpRight;

		HeadlightApp.Data.AppData.save(pRecord, { success: function(record){
			console.log('saved', record);
			$('#demoResult').html('Saved! (' + JSON.stringify(record) + ')');
		}, error: function(err){
			// TODO: handle errors
			$('#demoResult').html(err);
		}});
	});
};
