/*
* This JS file includes:
*   Pop up + Close Form
*   Show Password Checkbox
*   Login/Register Toggle Functionality
*/

/* login form pop up*/

/*function popup(){
    document.querySelector("#rectangle-background").style.display="flex";
}*/

/* showPassword checkbox */
function showPassword() {
    var input1 = document.getElementById("pwdShow1");
    var input2 = document.getElementById("pwdShow2");
    var input3 = document.getElementById("pwdShow3");

    if ((input1.type === "password")||(input2.type === "password")||(input3.type === "password")) {
        input1.type = "text";
        input2.type = "text";
        input3.type = "text";

    } else {
        input1.type = "password";
        input2.type = "password";
        input3.type = "password";
    }
}

/*
 * sliding animation
 */
$(document).ready(function(){

    // default display
    $("#login-form").addClass("reveal-showcase");

    //if register button is clicked
    $("#register-button").click(function(){
        $("#choose-register").fadeOut();
        $("#choose-login").fadeIn();
        //move the outer-layer box to the right
        $("#toggle-layer").addClass("right-outer-layer");
        //hide login showcase
        $("#login-form").removeClass("reveal-showcase");
        //reveal register showcase
        $("#register-form").addClass("reveal-showcase");

    });

    $("#login-button").click(function(){
        $("#choose-login").fadeOut();
        $("#choose-register").fadeIn();
        $("#toggle-layer").removeClass("right-outer-layer");
        $("#login-form").addClass("reveal-showcase");
        $("#register-form").removeClass("reveal-showcase");

    });
});
