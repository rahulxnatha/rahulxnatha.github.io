var element = document.body;
var dark_switch_position = document.getElementById("dark-toggle");

element.classList.toggle("dark-mode");


window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
        return; // Should do nothing if the default action has been cancelled
    }

    var handled = false;
    if (
        event.key.toLowerCase() === "d"
        && event.altKey
        
    ) {
        // Handle the event with KeyboardEvent.key and set handled true.
        document.getElementById("dark-toggle").click();
        handled = true;

    } else if (
        event.keyCode.toLowerCase() === "d"
        && event.altKey
        
    ) {
        // Handle the event with KeyboardEvent.keyCode and set handled true.
        document.getElementById("dark-toggle").click();
        handled = true;
    }

    if (handled) {
        // Suppress "double action" if event handled
        event.preventDefault();
    }
}, true);

