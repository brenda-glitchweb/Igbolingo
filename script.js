const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", function () {

    navLinks.classList.toggle("show");

    const isOpen = navLinks.classList.contains("show");

    menuToggle.setAttribute("aria-expanded", isOpen);

});