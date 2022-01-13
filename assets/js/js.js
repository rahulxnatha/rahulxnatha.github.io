

const menuOptions = ["Home", "Blog", "Projects", "Settings"];

const menuOption = document.getElementsByClassName("menuOption");

for (let i = 0, j = -1 + menuOptions.length; i < menuOption.length; i++,j--) {
    menuOption[i].innerHTML = menuOptions[j];
}




for (let i = menuOptions.length; i < menuOption.length; i++) {
    menuOption[i].style.display = "none";
}



