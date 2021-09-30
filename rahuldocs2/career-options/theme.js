'use strict'

const switcher = document.querySelector('.darktoggle');

switcher.addEventListener('click', function () {
    document.body.classList.toggle('dark');

    if (document.getElementById("darktoggle").checked == true) {
        document.getElementById("g_frame").style.filter = "invert(90%)";
       

    }
    if (document.getElementById("darktoggle").checked == false) {
        document.getElementById("g_frame").style.filter = "invert(0%)";
        
    }

    console.log('current class name: ' + className);

});

// document.getElementById("splash_screen").style.display = "none";
