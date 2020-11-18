function manual_dark() {
    var element = document.body;
    var dark_switch_position = document.getElementById("dark-toggle");
      
        element.classList.toggle("dark-mode"); 
}

    function automatic_dark_switch(){
        
        
        var hour = new Date().getHours(); 

  if (hour > 16) {   var toggle_now = document.getElementById("dark-toggle");
                 document.getElementById("tell-user-about-theme").innerHTML = "Good evening. I've turned on dark theme."  ;
                 toggle_now.checked = true; 
    
  } else { if (hour > 11){document.getElementById("tell-user-about-theme").innerHTML = "Good afternoon." ;}else {document.getElementById("tell-user-about-theme").innerHTML = "Good morning.";}
      
  }

var hour = new Date().getHours(); 
var light_tw = document.getElementById("light_t");
    var dark_tw = document.getElementById("dark_t");
  if (hour > 16) { var element = document.body;
   element.classList.toggle("dark-mode"); 
                 
                  light_tw.style.display = "none"
                  dark_tw.style.display = "block"
    
  } else { 
      light_tw.style.display = "block"
                  dark_tw.style.display = "none"
  }
}