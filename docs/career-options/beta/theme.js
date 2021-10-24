'use strict'

const switcher = document.querySelector('.darktoggle');

const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const userPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

if (userPrefersDark) {
    console.log("User prefers a dark interface");
    document.getElementById('logo_co').src = 'images/co_default_dark.png';
    document.getElementById("darktoggle").checked = true;
}

if (userPrefersLight) {
    console.log("User prefers a dark interface");
    document.getElementById('logo_co').src = 'images/co_default_light.png';
    document.getElementById("darktoggle").checked = false;
    document.body.classList.toggle('light_color_theme');
}



switcher.addEventListener('click', function manual_theme() {


    if (document.getElementById("darktoggle").checked == true) {
        document.getElementById("g_frame").style.filter = "invert(90%)";
        document.body.classList.toggle('light_color_theme');
        document.getElementById('logo_co').src = 'images/co_manual_dark.png';
    }
    if (document.getElementById("darktoggle").checked == false) {
        document.getElementById("g_frame").style.filter = "invert(0%)";
        document.body.classList.toggle('light_color_theme');
        document.getElementById('logo_co').src = 'images/co_manual_light.png';

    }

    console.log('current class name: ' + className);

});

document.getElementById("splash_screen").style.display = "none";
