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

  if (hour > 16) { var element = document.body;
   element.classList.toggle("dark-mode"); 
    
  } else { 
  }
        
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.getElementById("sub-menu1").style.display = "none"; 
    document.getElementById("splash_screen").style.display = "none";
    document.getElementById("card1").style.display = "block"; 
    document.getElementById("card2").style.display = "block";
    document.getElementById("card3").style.display = "none";
    document.getElementById("card4").style.display = "none";
    document.getElementById("card5").style.display = "none"; 
    document.getElementById("card6").style.display = "none";
    document.getElementById("card7").style.display = "none";
    document.getElementById("card8").style.display = "none";  
        
        
        
}

