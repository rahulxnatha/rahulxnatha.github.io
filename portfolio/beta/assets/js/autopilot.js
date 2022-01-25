

// setTimeout(function () {
//     var hour = new Date().getHours();

//     if (hour > 16) {
//         document.getElementById("status").innerHTML = "Good evening. Press d to toggle the dark theme.";
//         document.body.classList.toggle("dark-mode");
//         document.getElementById("dark-toggle").checked = true;
//     } else {
//         if (hour > 11) {
//             document.getElementById("status").innerHTML = "Good afternoon. Press d to toggle the dark theme.";
//         }
//         else {
//             if (hour < 6) {
//                 document.getElementById("status").innerHTML = "Late night! Press d to toggle the dark theme.";
//                 document.body.classList.toggle("dark-mode");
//                 document.getElementById("dark-toggle").checked = true;
//             }
//             else {
//                 document.getElementById("status").innerHTML = "Good morning. Press d to toggle the dark theme.";
//             }
//         }
//     }


// }, 0);

// setTimeout(function () {
//     document.getElementById("assistant").style.display = "block";

// }, 0);


// setTimeout(function () { document.getElementById("assistant").style.display = "none"; }, 0);




// function manual_dark() {
//     document.body.classList.toggle("dark-mode");
//     if (document.getElementById("dark-toggle").checked == false) {
//         document.getElementById("status").innerHTML = "You have turned off dark theme.";
//         if (document.getElementById("showSettings").checked == true) {
//             document.getElementById("settings_on").style.border = "3px solid #000";
//         }
//     } else {
//         document.getElementById("status").innerHTML = "Oh wow. You have turned on dark theme.";
//         if (document.getElementById("showSettings").checked == true) {
//             document.getElementById("settings_on").style.border = "3px solid #fff";
//         }
//     }
// }





//  function yourFunction(){
//     // do whatever you like here
//     if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
//         // dark mode
//         document.body.classList.add('dark');
//         console.log("User prefers a dark interface");
//     } else {
//         document.body.classList.add('light');
//         console.log("User prefers a light interface");
//     }

//     // setTimeout(yourFunction, 5000);
// }

// yourFunction();


var prevScrollpos = window.pageYOffset;

window.onscroll = function () {
  var currentScrollPos = window.pageYOffset;

  if (prevScrollpos > currentScrollPos) {
    // while scrolling towards the top of the webpage
    document.getElementsByTagName("header")[0].style.top = "0";

    document.getElementById("nav").style.top = "60px";
    document.getElementById("viewPort").style.top = "60px";
    document.getElementById("viewPort").style.height = "calc(100vh - 100px)";
    document.getElementById("viewport").style.height = "calc(100vh - 100px - 40px)";

    // document.getElementsByClassName("branding")[0].style.display = "none";

    // if (showSettings == true) {
    // document.getElementById("assistant").style.display = "block";
    // }

    // if (document.getElementById("dark-toggle").checked == false) {
    //   document.getElementById("status").innerHTML = "Dark theme was turned off.";
    // } else {
    //   document.getElementById("status").innerHTML = "Dark theme was turned on.";
    // }

  } else {

    if (currentScrollPos > 60) {
      // while scrolling towards the bottom of the webpage
      document.getElementsByTagName("header")[0].style.top = "-60px";

      document.getElementById("nav").style.top = "0px";
      document.getElementById("viewPort").style.top = "0px";
      document.getElementById("viewPort").style.height = "calc(100vh - 40px)";
      document.getElementById("viewport").style.height = "calc(100vh - 80px)";

      //   document.getElementById("assistant").style.top = "0";
      // document.getElementById("assistant").style.display = "none";
      //   document.getElementsByClassName("branding")[0].style.top = "0";
      //   document.getElementsByClassName("branding")[0].style.display = "block";

      //   if (document.getElementById("dark-toggle").checked == false) {
      //     document.getElementById("status").innerHTML = "Dark theme was turned on off.";
      //   } else {
      //     document.getElementById("status").innerHTML = "Dark theme was turned on.";
      //   }
    }
  }
  prevScrollpos = currentScrollPos;
}


function hasNetwork(online) {
  const element = document.querySelector(".status");
  const element2 = document.querySelector(".status2");
  // Update the DOM to reflect the current status
  if (online) {
    element.classList.remove("offline");
    element.classList.add("online");
    // element.innerText = "Online";
  } else {
    element.classList.remove("online");
    element.classList.add("offline");
    // element.innerText = "Offline";
  }

  if (online) {
  
    element2.innerText = "nline";
  } else {
   
    element2.innerText = "ffline";
  }
}

window.addEventListener("load", () => {
  hasNetwork(navigator.onLine);

  window.addEventListener("online", () => {
    // Set hasNetwork to online when they change to online.
    hasNetwork(true);
  });

  window.addEventListener("offline", () => {
    // Set hasNetwork to offline when they change to offline.
    hasNetwork(false);
  });
});