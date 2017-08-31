/** vim: et:ts=4:sw=4:sts=4
 * Headlight App Login
 * @license Pavia Systems Closed Source License
 */
/* global $ */
'use strict';

// Show the background image and login modal
$('.login-bg').show();
$('#loginModal').modal('show');

// toggle views
$('#forgotPasswordToggle').on('click', function() {
    $('.login-content').addClass('hidden');
    $('.forgot-password-confirm-content').addClass('hidden');
    $('.forgot-password-content').removeClass('hidden');
});

$('.backToLogin').on('click', function() {
    $('.forgot-password-content').addClass('hidden');
    $('.forgot-password-confirm-content').addClass('hidden');
    $('.login-content').removeClass('hidden');
});

// Get the user name if we chose to remember me
if (window.localStorage && window.localStorage.getItem('_pict_user') !== null) {
    $('input[name="rememberUser"]').prop('checked', true);
    $('#loginUserName').val(window.localStorage.getItem('_pict_user'));
    $('#loginPassword').focus();
} else {
    $('#loginUserName').focus();
}

// submit the login credentials
$('#loginForm').submit(function (pEvent) {
    pEvent.preventDefault();

    var tmpLoginData = {};

    tmpLoginData.UserName = $('#loginUserName').val();
    tmpLoginData.Password = $('#loginPassword').val();

    $.ajax({
        type: 'POST',
        url: '1.0/Authenticate',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(tmpLoginData)
    })
    .done(function (pData) {
        if ((typeof(pData) === 'object') &&
            (typeof(pData.UserID) !== 'undefined') && (pData.UserID !== 'undefined') &&
            (typeof(pData.LoggedIn) !== 'undefined') && (pData.LoggedIn))
        {
            // Logged in successfully
            if ($('input[name="rememberUser"]').prop('checked')) {
                // If you logged in successfully and the remember user checkbox is checked, save the cookie
                var tmpUserName = $('input#loginUserName').val();
                // Store username in local storage
                if (window.localStorage) {
                    window.localStorage.setItem('_pict_user', tmpUserName);
                } else {
                    $.cookie('_pict_user', tmpUserName);
                }
            } else {
                // If not clear anything stored
                if (window.localStorage && window.localStorage.getItem('_pict_user') !== null) {
                    window.localStorage.removeItem('_pict_user');
                }
                if ($.cookie('_pict_user') !== null) {
                    $.removeCookie('_pict_user');
                }
            }

            // Now reload the page, unless it was login.html, then load index.html
            if (window.location.pathname === '/login.html') {
                var tmpRootURI = window.location.protocol + '//' + window.location.hostname;
                if (window.location.port !== 80)
                    tmpRootURI += ':' + window.location.port;
                tmpRootURI += '/';
                window.location.replace(tmpRootURI);
            } else {
                window.location.reload();
            }
        } else {
            // Set the UI state to "Bad Password", assuming the user has entered the proper username.
            $('#loginPassword').parent('div').addClass('has-error');
            $('#loginValidateError').removeClass('hidden');
            $('#loginValidateError span.message').text('Invalid username or password.');
            $('#loginPassword').val('');
            $('#loginPassword').focus();
        }
    })
    .fail(function (reason) {
        $('#loginValidateError').removeClass('hidden');
        $('#loginValidateError span.message').innerText = 'Unable to reach the login server. Please try again later.';
        console.error('Forgot password email failed. Reason:', reason);
    });

    return false;
});

// submit an email for 'forgot password'
$('#forgotPasswordForm').submit(function (pEvent) {
    pEvent.preventDefault();

    var emailAddress = $('#inputEmail').val();

    $.ajax({
        type: 'GET',
        url: '1.0/User/ForgotPassword/' + emailAddress,
        dataType: 'json',
        contentType: 'application/json'
    })
    .done(function (result) {
        if (result.Success) {
            console.log('Forgot password email successfully sent!');
            // go to next view
            $('.login-content').addClass('hidden');
            $('.forgot-password-content').addClass('hidden');
            $('.forgot-password-confirm-content').removeClass('hidden');
        } else {
            var errorMessage;
            if (result.Error.statusCode && result.Error.statusCode === 400) {
                errorMessage = 'This address has already been sent a reset email.';
            } else {
                console.error('Forgot password email failed. Reason:', result.Error);
                errorMessage = result.Error;
            }
            // Set the UI state to "Bad Password", assuming the user has entered the proper username.
            $('#inputEmail').parent('div').addClass('has-error');
            $('#resetValidateError').removeClass('hidden');
            $('#resetValidateError span.message').text(errorMessage);
            $('#inputEmail').focus();
        }
    })
    .fail(function (reason) {
        $('#resetValidateError').removeClass('hidden');
        $('#loginValidateError span.message').innerText = 'Unable to reach the login server. Please try again later.';
        console.error('Forgot password email failed. Reason:', reason);
    });

    return false;
});
