




var prevScrollpos = window.pageYOffset;
window.onscroll = function () {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("site_header").style.top = "0";


  } else {
    if (currentScrollPos > 80) {
      document.getElementById("site_header").style.top = "-80px";
    }
  }
  prevScrollpos = currentScrollPos;
}

