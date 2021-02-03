function automatic_dark_switch() {

    var hour = new Date().getHours();

    if (hour > 16) {
        document.getElementById("tell-user-about-theme").innerHTML = "Good evening. I've turned on dark theme.";

    } else {
        if (hour > 11) { document.getElementById("tell-user-about-theme").innerHTML = "Good afternoon."; } else { document.getElementById("tell-user-about-theme").innerHTML = "Good morning."; }

    }

    if (hour > 0) {
        document.body.classList.toggle("dark-mode");
        document.getElementById("dark-toggle").checked = true;

    } else {
    }

}

function manual_dark() {
    document.body.classList.toggle("dark-mode");

}

//var logo_src = document.getElementById("logo-on-navbar").src;//

//if (logo_src == "https://docs.google.com/drawings/d/e/2PACX-1vQPdPVytZYNWzSO3PBcLMITfizdMxriBmgDjdtoMztim45F5iTTiJUOJW0cymT7aK8BY6eUcBgbAdFK/pub?w=5369&amp;h=811") { logo_src = "https://docs.google.com/drawings/d/e/2PACX-1vQA4iiyPJ8Py6UjOW524b3qVO8LRSsglJVuLPbldYkJ9td08uvFLAWs1sGukrMnTgmdvkiBCbTap_jD/pub?w=538&amp;h=81" }//

