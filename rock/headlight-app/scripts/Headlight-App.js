// {{AppName}} Script
/* global pict */
/* global $ */
"use strict";

// Script wire-up through pict-feature here!
pict.features.{{AppHash}} = {};

pict.features.{{AppHash}}.initialize = function(pSession)
{
	console.log('{{AppName}} initializing!');
};

// Initialize the Headlight App
pict.features.{{AppHash}}.load = function(pRecord, pProject, pSession)
{
	var HeadlightApp = pict.features.HeadlightApp;

	//if (pRecord.IDAppData === 0){}

	// Load the template for the app from the DOM
	var tmpAppTemplate = _.template($('#{{AppHash}}_Main').html());
	// Render the initial view for the app
	$('#headlight-app').html(template(pRecord));

	// Wire the submit for the form to our apps logic
	$('#{{AppHash}}_Form').submit(
		function()
		{
			console.log('Processing {{AppName}}...');

			// This boilerplate code
			var tmpLeft = $('#left_value').val();
			var tmpRight = $('#right_value').val();
			var tmpResult = tmpLeft+tmpRight;
			// Ridiculous
			$('#{{AppHash}}_Result').html('['+tmpLeft+'] + ['+tmpRight+'] = ['+tmpResult+']');

			console.log('...done processing {{AppName}}.');
			return false;
		});
		
	$('#{{AppHash}}_Save_Button').on('click',
		function()
		{
			var tmpLeft = $('#left_value').val();
			var tmpRight = $('#right_value').val();
			
			// Set the state to be saved in the record
			pRecord.model.Title = '['+tmpLeft+'] + ['+tmpRight+']';
			pRecord.model.Left = tmpLeft;
			pRecord.model.Right = tmpRight;

			HeadlightApp.Data.AppData.save(pRecord, 
				function(pRecord)
				{
					console.log('Successfully saved App record to server: ', pRecord);
					// Display a message to the user that the record has been saved		
					$("#{{AppHash}}_Messages").append('<div class="alert alert-success {{AppHash}}_Message">Successfully saved {{AppName}} record with record ID '+pRecord.IDAppData+' to the server.<button type="button" class="message_close">×</button></div>');
					// Auto close the message after 5 seconds
					window.setTimeout(function(){$(".{{AppHash}}_Message").fadeTo(500, 0).slideUp(500, function(){$(this).remove();});},5000);
					// Wire up the message close button
					$('.alert .message_close').on("click", function(pError){$(this).parent().fadeTo(500, 0).slideUp(500);});
				},
				function(pError)
				{
					// Display a message to the user that the record has not been saved		
					$("#{{AppHash}}_Messages").append('<div class="alert alert-danger {{AppHash}}_Message">Save of {{AppName}} record failed to save to the server!.<button type="button" class="message_close">X</button></div>');
					// Wire up the message close button
					$('.alert .message_close').on("click", function(pError){$(this).parent().fadeTo(500, 0).slideUp(500);});
				}
			);
		}
	);
};
