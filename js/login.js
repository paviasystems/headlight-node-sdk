/** vim: et:ts=4:sw=4:sts=4
 * Headlight App Login
 * @license Pavia Systems Closed Source License
 */

// Show the background image and login modal
$('.login-bg').show();
$('#loginModal').modal('show');

// Get the user name if we chose to remember me
if (window.localStorage && window.localStorage.getItem('_pict_user') !== null)
{
	$('input[name="rememberUser"]').prop("checked", true);
	$('#loginUserName').val(window.localStorage.getItem('_pict_user'));
	$('#loginPassword').focus();
}
else
{
	$('#loginUserName').focus();
}

$('#loginForm').submit
(
	function (pEvent)
	{
		pEvent.preventDefault();

		var tmpLoginData = {};

		tmpLoginData.UserName = $('#loginUserName').val();
		tmpLoginData.Password = $('#loginPassword').val();

		$.ajax
		(
			{
				type: 'POST',
				url: '1.0/Authenticate',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(tmpLoginData)
			}
		)
		.done
		(
			function (pData)
			{
				if ((typeof(pData) === 'object') && 
					(typeof(pData.UserID) !== 'undefined') && (pData.UserID !== 'undefined') &&
					(typeof(pData.LoggedIn) !== 'undefined') && (pData.LoggedIn))
				{
					// Logged in successfully
					if ($('input[name="rememberUser"]').prop('checked'))
					{
						// If you logged in successfully and the remember user checkbox is checked, save the cookie
						var tmpUserName = $('input#loginUserName').val();
						// Store username in local storage
						if (window.localStorage)
						{
							window.localStorage.setItem('_pict_user', tmpUserName);
						}
						else
						{
							$.cookie('_pict_user', tmpUserName);
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

					// Now reload the page, unless it was login.html, then load index.html
					if (window.location.pathname === 'login.html')
					{
						var tmpRootURI = window.location.protocol+'//'+window.location.host;
						if (window.location.port !== 80)
							tmpRootURI += ':'+window.location.port;
						tmpRootURI += '/';
						window.location.replace(tmpRootURI);
					}
					else
					{
						location.reload();
					}
				}
				else
				{
					// Set the UI state to "Bad Password", assuming the user has entered the proper username.
					$('#loginPassword').parent('div').addClass('has-error');
					$('#loginValidateError').removeClass('hidden');
					$('#loginPassword').val('');
					$('#loginPassword').focus();
				}
			}
		)
		.fail
		(
			function ()
			{
				// TODO: This technically needs an "internet connectivity" error message...
				$('#loginValidateError').removeClass('hidden');
			}
		);

		return false;
	}
);