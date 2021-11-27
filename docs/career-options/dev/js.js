document.getElementById("version").innerHTML = "2.9.99.03 Dev";


document.getElementById("button__close_announcement_bar").addEventListener("click", close_announcement_bar);
function close_announcement_bar() {
    document.getElementById("announcement_bar").style.display = "none";
}

close_announcement_bar();
close_developer_options();

document.getElementById("button__close_developer_options").addEventListener("click", close_developer_options);
function close_developer_options() {
    document.getElementById("developer_options").style.display = "none";
}


function item_1_content() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        document.getElementById("item_1").innerHTML =
            this.responseText;
    }
    xhttp.open("GET", "item_1.txt");
    xhttp.send();
}


var item = document.getElementsByClassName("item");
var hide = document.getElementsByClassName("hide");
var settings_button_pressed = 0;
for (let i = 6; i < item.length; i++) {
    item[i].addEventListener("click", coming_soon);
}

for (let i = 0; i < hide.length; i++) {
    hide[i].style.display = "none";
}


function coming_soon() {


    for (let i = 6; i < item.length; i++) {
        item[i].style.backgroundColor = "#777";
    }

    alert("This feature will start working in the future. Release date is not yet confirmed.");
}



function beta_access() {
    if (document.getElementById("betatoggle").checked == true) {
        window.open("https://natharahul.github.io/beta/career-options", "_self");
        document.getElementById("betatoggle").checked = false;
    }
    else {
        window.open("https://natharahul.github.io/rahuldocs/career-options", "_self");
        document.getElementById("betatoggle").checked = true;
    }


}


var access = 0;
// document.getElementById("body").style.display = "none";

// for (let i = 1; i < item.length; i++) {
//     item[i].style.display = "none";
// }

function turn_on_access() {

    var keyentered = document.getElementById("accesskey").value;
    if (keyentered == "prep") {
        access = 1;
    }
    else {
        document.getElementById("accessreply").innerHTML = "Access denied! Enter the correct accesskey. In case you don't have an accesskey, <u>contact me</u>.";
    }



    if (access == 1) {
        // window.open("index.html", "_self");
        // document.getElementById("accesspage2").style.display = "none";

        for (let i = 1; i < item.length; i++) {
            item[i].style.display = "inline";
        }

    }

}

document.getElementById("accesspage").style.display = "none";




// document.body.classList.toggle("dark");
// document.getElementById("g_frame").style.filter = "invert(90%)";



mdc.ripple.MDCRipple.attachTo(document.querySelector('.foo-button'));
mdc.textField.MDCTextField.attachTo(document.querySelector('.mdc-text-field'));

function auto() {

    // document.getElementById("topc").style.width= "370px";

    var welcome_message = document.getElementById("status");

    let hour = new Date().getHours();
    let minute = new Date().getMinutes();
    am_pm = "am";
    update_date = " today";

    if (hour > 12) { var hour_12 = hour - 12; am_pm = "pm"; }
    else { hour_12 = hour; }

    document.getElementById("at").innerHTML =
        "The contents in this website are updated" + update_date + " at " + hour_12 + ":" + minute +
        " " + am_pm;

    if (hour > 16 || hour < 6) {

        // document.getElementById("darktoggle").checked = true;

        // document.getElementById("g_frame").style.filter = "invert(90%)";


        if (hour > 16) {
            if (hour > 22) {
                welcome_message.innerHTML = "Good night. See you tomorrow";
            }
            else {
                welcome_message.innerHTML = "Hi. Good evening.";
            }

        }
    }
    else {
        welcome_message.innerHTML = "Hi. Have a nice day.";
        // document.body.classList.toggle("dark");
        // document.getElementById("darktoggle").checked = false;
        // document.getElementById("g_frame").style.filter = "invert(0%)";

    }

    document.getElementById("dark-toggle-label").style.display = "inline";


}

if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
    console.log('🎉 Dark mode is supported');
    welcome_message.innerHTML = "Hi. What time is it?";

}



function widen() {
    document.getElementById("widen").style.gridColumnStart = 1;
    document.getElementById("widen").style.gridColumnEnd = 4;
    document.getElementById("widen").style.minHeight = "calc(100vh - 154px)";

    document.getElementById("more_content").style.visibility = "visible";
}

// Show YouTube contents only //
function show_YouTube_videos() {

    var youtube_item = document.getElementsByClassName("youtube_embed");

    for (let i = 0; i < item.length; i++) {
        // item[i].addEventListener("click", youtube); //

        item[i].style.display = "none";

        for (let j = 0; j < youtube_item.length; j++) {
            youtube_item[j].style.display = "inline";
        }
    }
}

// Show Jobs contents only //
function show_jobs() {

    var jobs = document.getElementsByClassName("jobs");

    for (let i = 0; i < item.length; i++) {
        // item[i].addEventListener("click", youtube); //

        item[i].style.display = "none";

        for (let j = 0; j < jobs.length; j++) {
            jobs[j].style.display = "inline";
        }
    }
}

// Show Education contents only //
function show_education() {

    var education = document.getElementsByClassName("education");

    for (let i = 0; i < item.length; i++) {
        // item[i].addEventListener("click", youtube); //

        item[i].style.display = "none";

        for (let j = 0; j < education.length; j++) {
            education[j].style.display = "inline";
        }
    }
}

// Show Skills contents only //
function show_skills() {

    var skills = document.getElementsByClassName("skills");

    for (let i = 0; i < item.length; i++) {
        // item[i].addEventListener("click", youtube); //

        item[i].style.display = "none";

        for (let j = 0; j < skills.length; j++) {
            skills[j].style.display = "inline";
        }
    }
}

// Show all contents //
function show_all_contents() {

    for (let i = 0; i < item.length; i++) {

        item[i].style.display = "inline";
        document.getElementById("developer_options").style.display = "none";
    }
}

// Show Settings //
function show_settings() {
    document.getElementById("developer_options").style.display = "block";
    document.getElementById("settings_iconcus89").style.display = "none";

    settings_button_pressed++;

    const topbar_anim_control = window.matchMedia("(min-width: 1300px)");

    if (topbar_anim_control.matches) {
        // desktop
        document.getElementById("topc2").style.width = "300px";
        document.getElementById("topc2").style.right = "20px";

    } else {
        // tablets and phones
        document.getElementById("topc").style.width = "calc(100% - 40px)";
        document.getElementById("topc").style.right = "20px";

    }

}

function collapse_developer_options() {

    document.getElementById("settings_iconcus89").style.display = "inline";
    document.getElementById("developer_options").style.display = "none";
    const topbar_anim_control = window.matchMedia("(min-width: 1300px)");

    settings_button_pressed = 0;

    if (topbar_anim_control.matches) {
        // desktop
        document.getElementById("topc2").style.width = "250px";
        document.getElementById("topc2").style.right = "70px";

    } else {
        // tablets and phones
        document.getElementById("topc").style.width = "calc(100% - 40px - 50px)";
        document.getElementById("topc").style.right = "70px";


    }
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

function g_frame_fullscreen() {

    var eleme = document.getElementById("item");
    // if (document.getElementById("betatoggle").checked == true) {

    if (eleme.requestFullscreen) {
        eleme.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        eleme.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        eleme.msRequestFullscreen();
    }
    document.getElementById("gframe_fulls").style.display = "none";
    document.getElementById("gframe_fulls_off").style.display = "block";
    //  }
}

function g_frame_fullscreen_off() {

    var eleme = document.getElementById("item");
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
    document.getElementById("gframe_fulls").style.display = "block";
    document.getElementById("gframe_fulls_off").style.display = "none";
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



// var new_jobs_card = document.getElementById("new_jobs_card");

//    function get_data() {

//     url = "hello.txt";
//     fetch(url).then((response)=>{
//        return response.text();
//     }).then((data)=>{
//         new_jobs_card.innerHTML = data.text();
//     })

// }

// get_data()

// on scroll
// -------------------------------------

var x_width_check = window.matchMedia("max-width: 650px")
myFunction_forwidth(x_width_check) // Call listener function at run time
// x_width_check.addListener(myFunction_forwidth) // Attach listener function on state changes

var prevScrollpos = window.pageYOffset;
function myFunction_forwidth(x_width_check) {
    if (x_width_check.matches) { // If media query matches

    } else {


        window.onscroll = function () {
            var currentScrollPos = window.pageYOffset;
            // if (prevScrollpos > currentScrollPos) {
            if (prevScrollpos == currentScrollPos) {

                const topbar_anim_control = window.matchMedia("(min-width: 1300px)");

                if (topbar_anim_control.matches) {
                    // desktop
                    document.getElementById("topc").style.width = "calc(100% - 40px - 320px)";


                } else {
                    // tablets and phones

                    if (settings_button_pressed > 0) {
                        document.getElementById("topc").style.width = "calc(100% - 40px - 0px)";
                    }
                    else { document.getElementById("topc").style.width = "calc(100% - 40px - 0px - 50px)"; }
                }



                document.getElementById("topc").style.transitionDelay = "0ms";
                document.getElementById("dark-toggle-label").style.transitionDelay = "400ms";
                document.getElementById("beta-toggle-label").style.transitionDelay = "400ms";

                document.getElementById("dark-toggle-label").style.visibility = "visible";
                document.getElementById("beta-toggle-label").style.visibility = "visible";

            } else {

                if (currentScrollPos > 0) {

                    document.getElementById("topc").style.width = "360px";
                    document.getElementById("topc").style.transitionDelay = "0ms";
                    document.getElementById("dark-toggle-label").style.transitionDelay = "0ms";
                    document.getElementById("beta-toggle-label").style.transitionDelay = "0ms";

                    document.getElementById("dark-toggle-label").style.visibility = "hidden";
                    document.getElementById("beta-toggle-label").style.visibility = "hidden";


                }
            }
            // prevScrollpos = currentScrollPos;
        }
    }
}



