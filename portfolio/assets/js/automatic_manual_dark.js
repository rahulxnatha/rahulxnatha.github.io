function automatic_dark_switch() {

    document.getElementById("menu_option1").innerHTML = "Contact";
    document.getElementById("menu_option2").innerHTML = "Non technical works";
    document.getElementById("menu_option3").innerHTML = "Projects";
    document.getElementById("menu_option4").innerHTML = "Certifications";
    document.getElementById("menu_option5").innerHTML = "Home";

    // setTimeout(function () {
    //     var hour = new Date().getHours();

    //     if (hour > 16) {
    //         document.getElementById("tell-user-about-theme").innerHTML = "Good evening. Press d to toggle the dark theme.";
    //         document.body.classList.toggle("dark-mode");
    //         document.getElementById("dark-toggle").checked = true;
    //     } else {
    //         if (hour > 11) { document.getElementById("tell-user-about-theme").innerHTML = "Good afternoon. Press d to toggle the dark theme."; }
    //         else {
    //             if (hour < 6) {
    //                 document.getElementById("tell-user-about-theme").innerHTML = "Late night! Press d to toggle the dark theme.";
    //                 document.body.classList.toggle("dark-mode");
    //                 document.getElementById("dark-toggle").checked = true;
    //             }
    //             else {
    //                 document.getElementById("tell-user-about-theme").innerHTML = "Good morning. Press d to toggle the dark theme.";
    //             }
    //         }
    //     }
    // }, 0);



    // setTimeout(function () {
    //     document.getElementById("low_opacity_branding").style.display = "block";

    // }, 0);


    // setTimeout(function () { document.getElementById("low_opacity_branding").style.display = "none"; }, 3000);
    // setTimeout(function () { document.getElementById("settings_on").style.display = "block"; }, 3000);

    setTimeout(function () {
        document.getElementById("splash_screen2323").style.display = "none";
    }, 0);

    document.getElementById("status_message").innerHTML = "Hello. I am an engineer with B.Tech. degree." ;


}

function manual_dark() {
    document.body.classList.toggle("dark-mode");
    if (document.getElementById("dark-toggle").checked == false) {
        document.getElementById("tell-user-about-theme").innerHTML = "You have turned off dark theme.";
        if (document.getElementById("setting_button_mode").checked == true) {
            document.getElementById("settings_on").style.border = "3px solid #000";
        }
    } else {
        document.getElementById("tell-user-about-theme").innerHTML = "Oh wow. You have turned on dark theme.";
        if (document.getElementById("setting_button_mode").checked == true) {
            document.getElementById("settings_on").style.border = "3px solid #fff";
        }
    }
}

