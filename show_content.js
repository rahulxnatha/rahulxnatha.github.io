

var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("site_header").style.top = "0";
       
      
  } else { if(currentScrollPos > 204){
    document.getElementById("site_header").style.top = "-204px";
         }
  }
  prevScrollpos = currentScrollPos;
}




function show_home_menu(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    document.getElementById("sub-menu1").style.display = "none"; 
    document.getElementById("card1").style.display = "block"; 
    document.getElementById("card2").style.display = "block";
    document.getElementById("card3").style.display = "none";
    document.getElementById("card4").style.display = "none";
    document.getElementById("card5").style.display = "none"; 
    document.getElementById("card6").style.display = "none";
    document.getElementById("card7").style.display = "none";
    document.getElementById("card8").style.display = "none";
    document.getElementById("card9").style.display = "none";
    document.getElementById("card10").style.display = "none";
}

function show_career_menu(){
    
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.getElementById("sub-menu1").style.display = "block"; 
    document.getElementById("card1").style.display = "none"; 
    document.getElementById("card2").style.display = "none";
    document.getElementById("card3").style.display = "block";
    document.getElementById("card4").style.display = "block";
    document.getElementById("card5").style.display = "none"; 
    document.getElementById("card6").style.display = "none";
    document.getElementById("card7").style.display = "none";
    document.getElementById("card8").style.display = "none";
    document.getElementById("card9").style.display = "none";
    document.getElementById("card10").style.display = "none";
}



function show_exams_menu(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.getElementById("sub-menu1").style.display = "block"; 
    document.getElementById("card1").style.display = "none"; 
    document.getElementById("card2").style.display = "none";
    document.getElementById("card3").style.display = "none";
    document.getElementById("card4").style.display = "none";
    document.getElementById("card5").style.display = "block"; 
    document.getElementById("card6").style.display = "none";
    document.getElementById("card7").style.display = "none";
    document.getElementById("card8").style.display = "none";
    document.getElementById("card9").style.display = "none";
    document.getElementById("card10").style.display = "none";
}

function show_private_jobs_menu(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.getElementById("sub-menu1").style.display = "block"; 
    document.getElementById("card1").style.display = "none"; 
    document.getElementById("card2").style.display = "none";
    document.getElementById("card3").style.display = "none";
    document.getElementById("card4").style.display = "none";
    document.getElementById("card5").style.display = "none"; 
    document.getElementById("card6").style.display = "block";
    document.getElementById("card7").style.display = "none";
    document.getElementById("card8").style.display = "none";
    document.getElementById("card9").style.display = "none";
    document.getElementById("card10").style.display = "none";
}

function show_study_abroad_menu(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.getElementById("sub-menu1").style.display = "block"; 
    document.getElementById("card1").style.display = "none"; 
    document.getElementById("card2").style.display = "none";
    document.getElementById("card3").style.display = "none";
    document.getElementById("card4").style.display = "none";
    document.getElementById("card5").style.display = "none"; 
    document.getElementById("card6").style.display = "none";
    document.getElementById("card7").style.display = "block";
    document.getElementById("card8").style.display = "block";
    document.getElementById("card9").style.display = "block";
    document.getElementById("card10").style.display = "none";
}

function show_study_in_India(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.getElementById("sub-menu1").style.display = "block"; 
    document.getElementById("card1").style.display = "none"; 
    document.getElementById("card2").style.display = "none";
    document.getElementById("card3").style.display = "none";
    document.getElementById("card4").style.display = "none";
    document.getElementById("card5").style.display = "none"; 
    document.getElementById("card6").style.display = "none";
    document.getElementById("card7").style.display = "none";
    document.getElementById("card8").style.display = "none";
    document.getElementById("card9").style.display = "none";
    document.getElementById("card10").style.display = "block";
}