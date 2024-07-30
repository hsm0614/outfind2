function openTab(evt, tabName) {
    var i,
        tabcontent,
        tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i]
            .classList
            .remove("active");
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i]
            .classList
            .remove("active");
    }

    // Show the current tab, and add an "active" class to the button that opened the
    // tab
    document
        .getElementById(tabName)
        .classList
        .add("active");
    evt
        .currentTarget
        .classList
        .add("active");
}

// By default, open the first tab
document.addEventListener("DOMContentLoaded", function () {
    document
        .querySelector(".tablinks")
        .click();
});