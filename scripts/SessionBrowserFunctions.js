/**
* Retold Session Management UX Wire-up
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/
if (typeof define !== 'function') { var define = require('amdefine')(module); }

define
(
	function()
	{
		if (typeof(oBundle) !== 'undefined') return oBundle;

		////////// Initialize the bundle with the application //////////
		function oNew(pPict)
		{
			var _InitializedUXBehaviors = false;

			if (!_InitializedUXBehaviors)
			{
				$('#loginModal').on
				(
					'shown.bs.modal',
					function()
					{
						$('#loginUserName').focus();
					}
				);

				$('#loginForm').submit
				(
					function ()
					{
						pPict.session.Login($('#loginUserName').val(), $('#loginPassword').val());
						return false;
					}
				);

				$('#loginFormRequestReset').submit
				(
					function ()
					{
						//doLoginRequestReset($('#loginResetUserName').val());
						return false;
					}
				);

				$('#loginFormReset').submit
				(
					function ()
					{
						doLoginPasswordReset();
						return false;
					}
				);

				$('#LoginFormPasswordReset').click
				(
					function ()
					{
						$('#LoginFormMain').toggleClass('hidden');
						$('#LoginFormPasswordRequest').toggleClass('hidden');
					}
				);

				$('#LoginFormBackToLogin').click
				(
					function ()
					{
						$('#LoginFormMain').toggleClass('hidden');
						$('#LoginFormPasswordRequest').toggleClass('hidden');
					}
				);

				$('#headerLogout').click
				(
					function ()
					{
						_Pict.session.behaviors.Deauthenticate(
							function()
							{
								_Pict.router.navigate('', {trigger: true});
								_Pict.session.CheckStatus(true);
							});
						return false;
					}
				);

				_InitializedUXBehaviors = true;
			}

			var oBundleController = ({});

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