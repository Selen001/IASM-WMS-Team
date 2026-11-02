
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menuToggle");
    const navigation = document.getElementById("navigation");

    if (menuToggle && navigation) {
        menuToggle.addEventListener("click", function () {
            navigation.classList.toggle("open");
        });

        navigation.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navigation.classList.remove("open");
            });
        });
    }
});
