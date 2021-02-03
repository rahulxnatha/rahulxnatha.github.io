



var prevScrollpos = window.pageYOffset;
window.onscroll = function () {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("site_header").style.top = "0";
document.getElementById("low_opacity_branding").style.display = "none";

  } else {
    if (currentScrollPos > 80) {
      document.getElementById("site_header").style.top = "-80px";
        document.getElementById("low_opacity_branding").style.top = "0";
        document.getElementById("low_opacity_branding").style.display = "block";

    }
  }
  prevScrollpos = currentScrollPos;
}

