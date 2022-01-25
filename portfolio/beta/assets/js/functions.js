

// const menuOptions = ["Home", "Blog", "Projects", "Settings"];

// const menuOption = document.getElementsByClassName("menuOption");

// for (let i = 0, j = -1 + menuOptions.length; i < menuOption.length; i++, j--) {
//     menuOption[i].innerHTML = menuOptions[j];
// }

// for (let i = menuOptions.length; i < menuOption.length; i++) {
//     menuOption[i].style.display = "none";
// }

// for (let i = 0; i < menuOption.length; i++) {
//     if (menuOption[i].innerHTML == "Settings") {

//         menuOption[i].addEventListener("click", display_settings_now);
//         var showSettings = false;
//         function display_settings_now() {

//             if (showSettings == false) {
//                 showSettings = true;
//             } else {
//                 showSettings = false;
//             }

//             if (showSettings == true) {

//                 if (document.getElementById("dark-toggle").checked == true) {
//                     menuOption[i].style.border = "3px solid #fff";
//                 }
//                 else {
//                     menuOption[i].style.border = "3px solid #000";
//                 }

//                 document.getElementById("assistant").style.display = "block";

//             } else {

//                 if (document.getElementById("dark-toggle").checked == true) {
//                     menuOption[i].style.border = "3px solid #333";
//                 }
//                 else {
//                     menuOption[i].style.border = "3px solid #eee";
//                 }

//                 for (let i = assistant.length; i < assistant.length; i++) {
//                     assistant[i].style.display = "none";
//                 }

//                 document.getElementById("assistant").style.display = "none";
//             }


//         }



//     }
// }

// const menu = document.getElementsByTagName("nav")[0].childNodes;

// for (let i = 0; i < menu.length; i++) {
//     menu[i].innerHTML = menuOptions[i];
// }

// for (let i = 0, j = -1 + menuOptions.length; i < menu.length; i++, j--) {
//         menu[i].innerHTML = menuOptions[j];
//     }


// window.addEventListener("keydown", function (event) {
//     if (event.defaultPrevented) {
//         return; // Should do nothing if the default action has been cancelled
//     }

//     var handled = false;
//     if (
//         event.key.toLowerCase() === "d"
//         && event.altKey

//     ) {
//         // Handle the event with KeyboardEvent.key and set handled true.
//         document.getElementById("dark-toggle").click();
//         handled = true;

//     } else if (
//         event.keyCode.toLowerCase() === "d"
//         && event.altKey

//     ) {
//         // Handle the event with KeyboardEvent.keyCode and set handled true.
//         document.getElementById("dark-toggle").click();
//         handled = true;
//     }

//     if (handled) {
//         // Suppress "double action" if event handled
//         event.preventDefault();
//     }
// }, true);


const articles = document.getElementsByTagName("article");

