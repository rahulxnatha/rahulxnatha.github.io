'use strict'

const switcher = document.querySelector('#dark_toggle');

const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const userPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

if (userPrefersDark) {
    console.log("User prefers a dark interface");
    document.getElementById('logo_co').src = 'images/co_default_dark.png';
    document.getElementById("dark_toggle").checked = true;
}

if (userPrefersLight) {
    console.log("User prefers a dark interface");
    document.getElementById('logo_co').src = 'images/co_default_light.png';
    document.getElementById("dark_toggle").checked = false;
    document.body.classList.toggle('light_color_theme');
}


let isDark = true;
switcher.addEventListener('click', function manual_theme() {

    
    // remove scrollbars
    document.documentElement.style.overflow = "hidden";
    // trigger reflow so that overflow style is applied
    document.body.clientWidth;
    // change scheme
    document.documentElement.setAttribute(
        "data-color-scheme",
        isDark ? "light" : "dark"
    );
    // remove overflow style, which will bring back the scrollbar with the correct scheme 
    document.documentElement.style.overflow = "";

    isDark = !isDark;

    if (document.getElementById("dark_toggle").checked == true) {
        document.getElementById("g_frame").style.filter = "invert(90%)";
        document.body.classList.toggle('light_color_theme');

        document.getElementById('logo_co').src = 'images/co_manual_dark.png';
    }
    if (document.getElementById("dark_toggle").checked == false) {
        document.getElementById("g_frame").style.filter = "invert(0%)";
        document.body.classList.toggle('light_color_theme');
        document.getElementById('logo_co').src = 'images/co_manual_light.png';

    }

    console.log('current class name: ' + className);

});

document.getElementById("splash_screen").style.display = "none";









