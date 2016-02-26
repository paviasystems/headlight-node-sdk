/**
* Session Management Wire-up
*
* @license     All Rights Reserved
*
* @copyright   Copyright (c) 2015, Pavia Systems
*
* @author      Steven Velozo <steven@paviasystems.com>
*/
if (typeof define !== 'function') { var define = require('amdefine')(module); }

define
(
	["SessionBrowserFunctions"],
	function(SessionBrowserFunctions)
	{
		if (typeof(oBundle) !== 'undefined') return oBundle;

		////////// Initialize the bundle with the application //////////
		function oNew(pRouter, pPict)
		{
			var _Pict = pPict;
			var _Router = pRouter;

			// Initialize the browser functionality for session (e.g. password saving)
			SessionBrowserFunctions.New(_Pict);

			// Overwrite definition of login route to accomodate existence of new register route
			// and an a register modal
			_Router.route("login","displayLogin", function(){
					if(!$('#loginModal').hasClass('in'))
					{
						$('#loginModal').removeClass('hide');
						$('#loginModal').on('show.bs.modal', function (e) {
							$('.modal').modal('hide');
						}).delay(250).modal('show');
					}
			});

			// Define register route
			// _Router.route("register", "displayRegister", function(){
			// 	if(!$('#registerModal').hasClass('in'))
			// 		{
			// 			$('#registerModal').removeClass('hide');
			// 			$('#registerModal').on('show.bs.modal', function (e) {
			// 				$('.modal').modal('hide');
			// 			}).delay(250).modal('show');
			// 		}
			// });

			// Authenticate the user
			_Pict.session.behaviors.Authenticate = function(pUserName, pPassword, fCallback)
			{
				var tmpLoginData = {};

				tmpLoginData.UserName = pUserName;
				tmpLoginData.Password = pPassword;

				$.ajax
				(
					{
						type: 'POST',
						url: _Pict.apiServer+'Authenticate',
						dataType: 'json',
						contentType: 'application/json',
						data: JSON.stringify(tmpLoginData)
					}
				)
				.done
				(
					function (pData)
					{
						if ((typeof(pData) === 'object') && (typeof(pData.UserID) !== 'undefined') && (pData.UserID !== 'undefined'))
						{
							_ForceReload = true;

							fCallback(pData);

							if ($('input[name="rememberUser"]').prop('checked'))
							{
								// If you logged in successfully and the remember user checkbox is checked

								var tempUserName = $('input#loginUsername').val();
								// Store username in local storage
								if (window.localStorage)
								{
									window.localStorage.setItem('_pict_user', tempUserName);
								}
								else
								{
									$.cookie('_pict_user', tempUserName);
								}
							}
							else
							{
								// If not clear anything stored
								if (window.localStorage && window.localStorage.getItem('_pict_user') !== null)
								{
									window.localStorage.removeItem('_pict_user');
								}
								if ($.cookie('_pict_user') !== null)
								{
									$.removeCookie('_pict_user');
								}
							}
						}
						else
						{
							// Set the UI state to "Bad Password"
							$('#loginPassword').parent('div').addClass('has-error');
							$('#loginValidateError').removeClass('hidden');
							$('#loginPassword').val('');
							$('#loginPassword').focus();

							fCallback(false);
						}
					}
				)
				.fail
				(
					function ()
					{
						// TODO: This technically needs an "internet connectivity" error message.
						$('#loginValidateError').removeClass('hidden');
					}
				);
			};

			// Register the user
			_Pict.session.behaviors.Register = function(pNameFirst, pNameLast, pEmail, pPassword, pPhone, pCompany, pState, pSize, pRevenue, pPosition)
			{
				var tmpRegisterData = {};

				tmpRegisterData.NameFirst = pNameFirst;
				tmpRegisterData.NameLast = pNameLast;
				tmpRegisterData.Email = pEmail;
				tmpRegisterData.Password = pPassword;
				tmpRegisterData.Phone = pPhone;
				tmpRegisterData.CompanyName = pCompany;
				tmpRegisterData.CompanyDetails = {"State": pState, "Size": parseInt(pSize), "EstimatedAnnualRevenue": pRevenue};
				tmpRegisterData.Position = pPosition;

				$.ajax(
				{
					type: 'POST',
					url: _Pict.apiServer+'User/Signup',
					dataType: 'json',
					contentType: 'application/json',
					data: JSON.stringify(tmpRegisterData)
				})
				.done
				(
					// TODO: Determine if this is the right place to handle registration error/success
					function(pData)
					{
						// Ensure customer registered successfully
						if((typeof(pData) === 'object') && (typeof(pData.Success) !== 'undefined') && pData.Success)
						{
							$('#RegisterFormMain').addClass('hidden');
							$('#RegisterFormComplete').delay(250).removeClass('hidden');
						}
						else // Customer wasn't registered for some reason
						{
							if((typeof(pData) === 'object') && (typeof(pData.Error) !== 'undefined'))
							{
								toastr.error("Error: " + pData.Error);
							}
						}
					}
				);
			};

			// Deauthenticate the user
			_Pict.session.behaviors.Deauthenticate = function(fCallback)
			{
				// Logout and clear the session data
				$.ajax
				(
					{
						type: 'GET',
						url: _Pict.apiServer+'Deauthenticate',
						datatype: 'json'
					}
				)
				.done
				(
					function ()
					{
						fCallback();
					}
				);
			};

			// Check the headlight server's status
			_Pict.session.behaviors.CheckSessionStatus = function(fCallback)
			{
				$.ajax
				(
					{
						type: 'GET',
						url: _Pict.apiServer+'CheckSession',
						datatype: 'json',
						async: true
					}
				)
				.done
				(
					function (pData)
					{
						_Initialized = true;
						if ((typeof(pData) === 'object') && (typeof(pData.UserID) !== 'undefined') && (pData.UserID !== 'undefined'))
						{
							fCallback(pData);
						}
						else
						{
							fCallback(false);
						}
					}
				)
				.fail
				(
					function ()
					{
						// This indicates connective issues
						$('#ValidationErrorLogin').removeClass('hidden');
						fCallback(false);
					}
				);
			};

			// Setup the user interface for a user just logging in
			_Pict.session.behaviors.UXSetUser = function(pRecord)
			{
				// Add a hidden DOM element for Selenium to hook into
				$('#wrapper #HeadlightLoggedInUserID').remove();
				$('#wrapper').append('<input type="hidden" id="HeadlightLoggedInUserID" value="'+pRecord.UserID+'">');

				// Put the User name in the header
				$(".fullUserName").text(pRecord.NameFirst + " " + pRecord.NameLast);

				// Show the role-specific menu
				var tmpMenuTemplate = _.template($('#NavigationMenu_'+pRecord.UserRoleIndex).text());
				$('#main-nav').html(tmpMenuTemplate({ }));

				// Set the UI state to "Logged In"
				$('#loginResetValidateError').addClass('hidden');
				$('input#loginPassword').val('');
				$('body').removeClass('login');
				$('#loginModal').modal('hide');
				$('.login-bg').hide();
				$('#loginModal input').off('keyup');
				$('#loginValidateError').removeClass('hidden');

				// Set the customer logo from the top left of the UX
				$('#HeaderLogoImage').attr("src", _Pict.apiServer + 'Customer/Logo/' + pRecord.CustomerID);

				// Making sure the route updates to the correct default URL after user authenticated
				// Otherwise URL remains '/#login' and doesn't show project list
				if (Backbone.history.fragment == 'login' || Backbone.history.fragment == 'register') {
					_Router.navigate("", {trigger: true, replace: true});
				}

				_Pict.WriteContent('Headlight_App_Form');
				if (typeof(HeadlightApp) === 'object')
					HeadlightApp.initialize(_Pict);
			};

			// Set the user interface to a non-logged-in state after a logout action
			_Pict.session.behaviors.UXClearUser = function()
			{
				// Remove the selenium hook DOM element
				$('#wrapper #HeadlightLoggedInUserID').remove();

				// Show the login modal
				$('body').addClass('login');
				$('.login-bg').show();

				if (Backbone.history.fragment.startsWith('EmailConfirmed')){
					var email = Backbone.history.fragment.substring(Backbone.history.fragment.indexOf('EmailConfirmHash=')).split('&')[0].split('=')[1];
					toastr.success('Your account "' + email + '"" is confirmed', null, {timeOut: 1500});
				}

				// Make sure URL updateds to '/#login' and to ensure login modal shown
				_Router.navigate("login", {trigger: true});

				// Clear the customer logo from the top left of the UX
				// TODO: This needs to change to Mongo once we have the thumbnailer
				//$('#HeaderLogoImage').attr("src", _Pict.apiServer + 'Customer/Logo/blank');

				// Hide the logged-in navigation
				$("#LoggedInUserMenu").addClass('hidden');
				$("#LoggedOutUserMenu").removeClass('hidden');
			};

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



