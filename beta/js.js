var item = document.getElementsByClassName("item");

for (let i = 3; i < item.length; i++) {
    item[i].addEventListener("click", coming_soon);
}

function coming_soon() {
    alert("This feature will start working in the future. Release date is not yet confirmed.");
}

function beta_access() {
    if (document.getElementById("betatoggle").checked == true) {
        window.open("https://natharahul.github.io/beta/career-options", "_self");
    }
    else{
        window.open("https://natharahul.github.io/rahuldocs/career-options", "_self");
    }
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


function auto() {

    let hour = new Date().getHours();
    let date_time = new Date();
    if (hour > 16 || hour < 6) {
        document.body.classList.toggle("dark");
        document.getElementById("darktoggle").checked = true;
        document.getElementById("g_frame").style.filter = "invert(90%)";

        var welcome_message = document.getElementById("welcome_message");
        if (hour > 16) {

            if (hour > 22) { welcome_message.innerHTML = "Good night. See you tomorrow"; }
            else {
                welcome_message.innerHTML = "Hi. Good evening.";
            }
        }
    }
    else {
        welcome_message.innerHTML = "Hi. Have a nice day.";
        document.getElementById("darktoggle").checked = false;
        document.getElementById("g_frame").style.filter = "invert(0%)";

    }

    document.getElementById("at").innerHTML = date_time;
    document.getElementById("dark-toggle").style.display = "block";

}
document.getElementById("splash_screen").style.display = "none";



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

