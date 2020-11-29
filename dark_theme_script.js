function manual_dark() {
    var element = document.body;
    var dark_switch_position = document.getElementById("dark-toggle");
      
        element.classList.toggle("dark-mode"); 
    var logo_src = document.getElementById("logo-on-navbar").src;
    
    if (logo_src == "https://docs.google.com/drawings/d/e/2PACX-1vQPdPVytZYNWzSO3PBcLMITfizdMxriBmgDjdtoMztim45F5iTTiJUOJW0cymT7aK8BY6eUcBgbAdFK/pub?w=5369&amp;h=811")
        {logo_src = "https://docs.google.com/drawings/d/e/2PACX-1vQA4iiyPJ8Py6UjOW524b3qVO8LRSsglJVuLPbldYkJ9td08uvFLAWs1sGukrMnTgmdvkiBCbTap_jD/pub?w=538&amp;h=81"}
    
    
}














    function automatic_dark_switch(){
        
        
        var hour = new Date().getHours(); 

  if (hour > 16) {   var toggle_now = document.getElementById("dark-toggle");
                 document.getElementById("tell-user-about-theme").innerHTML = "Good evening. I've turned on dark theme."  ;
                 toggle_now.checked = true; 
                document.getElementById("logo-on-navbar").src = "https://docs.google.com/drawings/d/e/2PACX-1vQPdPVytZYNWzSO3PBcLMITfizdMxriBmgDjdtoMztim45F5iTTiJUOJW0cymT7aK8BY6eUcBgbAdFK/pub?w=5369&amp;h=811";
    
  } else { if (hour > 11){document.getElementById("tell-user-about-theme").innerHTML = "Good afternoon." ;}else {document.getElementById("tell-user-about-theme").innerHTML = "Good morning.";}
      
  }

  if (hour > 16) { var element = document.body;
   element.classList.toggle("dark-mode"); 
    
  } else { 
  }
        
           
        
        
        
}

