



var prevScrollpos = window.pageYOffset;
window.onscroll = function () {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("site_header").style.top = "0";

    if (document.getElementById("setting_button_mode").checked == true) {
      document.getElementById("low_opacity_branding").style.display = "block";
    }

    if (document.getElementById("dark-toggle").checked == false) {
      document.getElementById("tell-user-about-theme").innerHTML = "Dark theme is off.";
    } else { document.getElementById("tell-user-about-theme").innerHTML = "Dark theme is on."; }

  } else {
    if (currentScrollPos > 80) {
      document.getElementById("site_header").style.top = "-80px";
      document.getElementById("low_opacity_branding").style.top = "0";
      document.getElementById("low_opacity_branding").style.display = "none";


      if (document.getElementById("dark-toggle").checked == false) {
        document.getElementById("tell-user-about-theme").innerHTML = "Dark theme is off.";
      } else { document.getElementById("tell-user-about-theme").innerHTML = "Dark theme is on."; }

    }
  }
  prevScrollpos = currentScrollPos;
}

function display_settings_now() {



  if (document.getElementById("setting_button_mode").checked == false) {
    
    document.getElementById("setting_button_mode").checked = true;

  } else { document.getElementById("setting_button_mode").checked = false; }

  if (document.getElementById("setting_button_mode").checked == true) {
    
    if (document.getElementById("dark-toggle").checked == true){
      document.getElementById("settings_on").style.border = "3px solid #fff";}
      else{
      document.getElementById("settings_on").style.border = "3px solid #000";}

    document.getElementById("low_opacity_branding").style.display = "block";

  } else { 

    if (document.getElementById("dark-toggle").checked == true){
    document.getElementById("settings_on").style.border = "3px solid #333333";}
    else{
    document.getElementById("settings_on").style.border = "3px solid #eee";}

  document.getElementById("low_opacity_branding").style.display = "none"; }


}

