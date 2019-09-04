/*
* This JS file includes:
*   Pop up + Close Form
*   Show Password Checkbox
*   Login/Register Toggle Functionality
*/

/* login form pop up */

/* function popup(){
    document.querySelector('#rectangle-background').style.display='flex';
} */

/* showPassword checkbox */
function showPassword () {
	var input1 = document.getElementById('pwdShow1');
	var input2 = document.getElementById('pwdShow2');
	var input3 = document.getElementById('pwdShow3');

	if ((input1.type === 'password') || (input2.type === 'password') || (input3.type === 'password')) {
		input1.type = 'text';
		input2.type = 'text';
		input3.type = 'text';
	} else {
		input1.type = 'password';
		input2.type = 'password';
		input3.type = 'password';
	}
}

// Validate sign up form
function formValidation () {
    // JavaScript form validation
	var checkPassword = function (str) {
		var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
		return re.test(str);
	};

	var checkForm = function (e) {
		console.log('HELLO');
		if (this.pwd.value !== '' && this.pwd.value === this.pwdrepeat.value) {
			if (!checkPassword(this.pwd.value)) {
				alert('The password you have entered is not valid!');
				this.pwd.focus();
				e.preventDefault();
			}
		} else {
			alert('Error: Please check that youve entered and confirmed your password!');
			this.pwd.focus();
			e.preventDefault();
		}
	};

	var regform = document.getElementById('regform');
	regform.addEventListener('submit', checkForm, true);
}

/*
 * sliding animation
 */
$(document).ready(function () {
	// default display
	$('#login-form').addClass('reveal-showcase');

	// if register button is clicked
	$('#register-button').click(function(){
		$('#choose-register').fadeOut();
		$('#choose-login').fadeIn();
		// move the outer-layer box to the right
		$('#toggle-layer').addClass('right-outer-layer');
		// hide login showcase
		$('#login-form').removeClass('reveal-showcase');
		// reveal register showcase
		$('#register-form').addClass('reveal-showcase');

	});

	$('#login-button').click(function(){
		$('#choose-login').fadeOut();
		$('#choose-register').fadeIn();
		$('#toggle-layer').removeClass('right-outer-layer');
		$('#login-form').addClass('reveal-showcase');
		$('#register-form').removeClass('reveal-showcase');
	});
});
