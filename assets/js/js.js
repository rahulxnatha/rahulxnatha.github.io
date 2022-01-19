

const menuOptions = ["Home", "Blog", "Projects", "Settings"];

const menuOption = document.getElementsByClassName("menuOption");

for (let i = 0, j = -1 + menuOptions.length; i < menuOption.length; i++, j--) {
    menuOption[i].innerHTML = menuOptions[j];
}

for (let i = menuOptions.length; i < menuOption.length; i++) {
    menuOption[i].style.display = "none";
}

for (let i = 0; i < menuOption.length; i++) {
    if (menuOption[i].innerHTML == "Settings") {

        menuOption[i].style.display = "none";

        menuOption[i].addEventListener("click", display_settings_now);
        var showSettings = false;
        function display_settings_now() {

            
            if (showSettings == false) {
                showSettings = true;
            } else {
                showSettings = false;
            }

            if (showSettings == true) {

                if (document.getElementById("dark-toggle").checked == true) {
                    menuOption[i].style.border = "3px solid #fff";
                }
                else {
                    menuOption[i].style.border = "3px solid #000";
                }

                document.getElementById("low_opacity_branding").style.display = "block";

            } else {

                if (document.getElementById("dark-toggle").checked == true) {
                    menuOption[i].style.border = "3px solid #333";
                }
                else {
                    menuOption[i].style.border = "3px solid #eee";
                }

                document.getElementById("low_opacity_branding").style.display = "none";
            }


        }



    }
}

// document.addEventListener("keyup", function (event) {
//     if (event.keyCode === 68) {
//       event.preventDefault();
//       document.getElementById("dark-toggle").click();
//     }
// });
 

window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
      return; // Should do nothing if the default action has been cancelled
    }
  
    var handled = false;
    if (event.key === 68) {
      // Handle the event with KeyboardEvent.key and set handled true.
        document.getElementById("dark-toggle").click();
        handled = true;
    } else if (event.keyCode === 68) {
      // Handle the event with KeyboardEvent.keyCode and set handled true.
        document.getElementById("dark-toggle").click();
        handled = true;
    }
  
    if (handled) {
      // Suppress "double action" if event handled
      event.preventDefault();
    }
  }, true);
  
