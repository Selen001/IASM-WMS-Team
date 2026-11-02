document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");

    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", function () {
            sidebar.classList.toggle("open");
        });

        sidebar.querySelectorAll(".nav-link").forEach(function (link) {
            link.addEventListener("click", function () {
                if (window.innerWidth <= 900) {
                    sidebar.classList.remove("open");
                }
            });
        });
    }
});