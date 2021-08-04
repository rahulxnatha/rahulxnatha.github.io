var item = document.getElementsByClassName("item");

for (let i = 2; i < item.length; i++) {
    item[i].addEventListener("click", coming_soon);
  }

function coming_soon(){
    alert("This feature will start working in the future. Release date is not yet confirmed.");
}

function close_pop_up() {
    document.getElementById("suggestion_gform_closed").style.display = "block";
    document.getElementById("suggestion_gform").style.display = "none";
}

function pop_up_open() {
    document.getElementById("suggestion_gform_closed").style.display = "none";
    document.getElementById("suggestion_gform").style.display = "block";
}


function turnonaccess() {
    var keyentered = document.getElementById("accesskey").value;
    if (keyentered == "prep") {
        document.getElementById("accesspage").style.display = "none";
    }
    else {
        document.getElementById("accessreply").innerHTML = "Access denied!";
    }
    if (keyentered == "ea") {
        document.getElementById("accesspage").style.display = "none";
        document.getElementById("versiond").innerHTML = "Career Options Beta";
    }
    else {
        document.getElementById("accessreply").innerHTML = "Access denied!";
    }


}

document.getElementById("accesskey").addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("accessbutton").click();
    }
});

document.addEventListener("keyup", function (event) {
    if (event.keyCode === 68) {
        event.preventDefault();
        document.getElementById("darktoggle").click();
    }
});

document.addEventListener("keyup", function (event) {
    if (event.keyCode === 67) {
        event.preventDefault();
        document.getElementById("calendarswitch").click();
    }
});

document.addEventListener("keyup", function (event) {
    if (event.keyCode === 77) {
        event.preventDefault();
        document.getElementById("mediaswitch").click();
    }
});

document.addEventListener("keyup", function (event) {
    if (event.keyCode === 70) {
        event.preventDefault();
        document.getElementById("hideonclick").click();
    }
});
document.addEventListener("keyup", function (event) {
    if (event.keyCode === 84) {
        event.preventDefault();
        window.open("https://www.t.me/rahulnatha");
    }
});


document.addEventListener("keyup", function (event) {
    if (event.keyCode === 72) {
        event.preventDefault();
        document.getElementById("mediaswitch").checked = false;
        document.getElementById("calendarswitch").checked = false;
        document.getElementById("mediapage").style.display = "none";
        document.getElementById("sheet").style.display = "block";
        document.getElementById("sheet2").style.display = "none";
        document.getElementById("sheet3").style.display = "none";


    }
});



var hour = new Date().getHours();
var date_time = new Date();
document.getElementById("at").innerHTML = date_time;

document.getElementById("dark-toggle").style.display = "block";


function onload_tasks() {

    

    if (new Date().getHours() > 16 || new Date().getHours() < 6) {
        document.body.classList.toggle("dark");
        document.getElementById("darktoggle").checked = true;
        document.getElementById("g_frame").style.filter = "invert(90%)";
        
    }
    else {
        
        document.getElementById("darktoggle").checked = false;
        document.getElementById("g_frame").style.filter = "invert(0%)";
    }

    document.getElementById("splash_screen").style.display = "none";
}

function invert() {

    document.body.classList.toggle("dark");
    if (document.getElementById("darktoggle").checked == true) {
    document.getElementById("g_frame").style.filter = "invert(90%)";
    
    }
    if (document.getElementById("darktoggle").checked == false) {
    document.getElementById("g_frame").style.filter = "invert(0%)";
    }

}

function widen() {
    document.getElementById("widen").style.gridColumnStart = 1;
    document.getElementById("widen").style.gridColumnEnd = 4;
    document.getElementById("widen").style.minHeight = "calc(100vh - 154px)";

document.getElementById("more_content").style.visibility = "visible";
}




function navbar_style() {
    if (document.getElementById("calendarswitch").checked == true) {

        document.getElementById("mediaswitch").checked = false;
        document.getElementById("mediapage").style.display = "none";
        document.getElementById("sheet").style.display = "none";
        document.getElementById("sheet2").style.display = "block";
        document.getElementById("sheet3").style.display = "block";


    }
    else {
        document.getElementById("sheet").style.display = "block";
        document.getElementById("mediapage").style.display = "none";
        document.getElementById("sheet2").style.display = "none";
        document.getElementById("sheet3").style.display = "none";


    }
}

function showmedia() {
    if (document.getElementById("mediaswitch").checked == true) {


        document.getElementById("mediapage").style.display = "block";
        document.getElementById("calendarswitch").checked = false;
        document.getElementById("sheet2").style.display = "none";
        document.getElementById("sheet3").style.display = "none";


    }
    else {
        document.getElementById("sheet").style.display = "block";
        document.getElementById("mediapage").style.display = "none";
        document.getElementById("sheet2").style.display = "none";
        document.getElementById("sheet3").style.display = "none";
    }

}












function decidefullscreen() {
    var elem = document.getElementById("w_webpage");
    if (document.getElementById("hideonclick").checked == true) {

        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }

    }


    if (document.getElementById("hideonclick").checked == false) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }

    }
}

