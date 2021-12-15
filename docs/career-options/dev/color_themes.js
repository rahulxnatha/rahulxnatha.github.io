'use strict'
var isDark = true;
const switcher = document.querySelector('#dark_toggle');

const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const userPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

// document.getElementById("dark_toggle_w").style.display = "none";
document.getElementById("beta_toggle_w").style.display = "none";

//  comment when not testing light theme 
// document.body.classList.toggle('light_color_theme');
// document.documentElement.setAttribute(
//     "data-color-scheme",
//     isDark ? "light" : "dark"
// );




if (userPrefersDark) {
    console.log("User prefers a dark interface");
    document.getElementById('logo').src = 'images/co_default_dark.png';
    document.getElementById('brand_logo').style.filter = "invert(100%)";
    document.getElementById("dark_toggle").checked = true;
}

if (userPrefersLight) {
    console.log("User prefers a light interface");
    document.getElementById('logo').src = 'images/co_default_light.png';
    document.getElementById('brand_logo').style.filter = "invert(0)";
    document.getElementById("dark_toggle").checked = false;
    document.body.classList.toggle('light_color_theme');

    
    
     
     // change scheme
     document.documentElement.setAttribute(
         "data-color-scheme",
         isDark ? "light" : "dark"
     );
    
    
     isDark = !isDark;

}


// var isDark = true;
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
        // document.getElementById("g_frame").style.filter = "invert(90%)";
        document.body.classList.toggle('light_color_theme');
        document.getElementById('brand_logo').style.filter = "invert(100%)";
        document.getElementById('logo').src = 'images/co_manual_dark.png';
    }
    if (document.getElementById("dark_toggle").checked == false) {
        // document.getElementById("g_frame").style.filter = "invert(0%)";
        document.body.classList.toggle('light_color_theme');
        document.getElementById('logo').src = 'images/co_manual_light.png';
        document.getElementById('brand_logo').style.filter = "invert(0%)";

    }

    console.log('current class name: ' + className);

});

document.getElementById("splash_screen").style.display = "none";









