document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const role = document.getElementById("role").value;
            const message = document.getElementById("authMessage");

            if (!email || !password || !role) {
                message.textContent = "Please complete all fields.";
                message.className = "form-message mt-3 text-danger";
                return;
            }

            message.textContent =
                "The login form is ready for Django authentication. Authentication is not connected yet.";
            message.className = "form-message mt-3 text-secondary";
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const password = document.getElementById("registerPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const message = document.getElementById("registerMessage");

            if (password.length < 8) {
                message.textContent = "Password must contain at least 8 characters.";
                message.className = "form-message mt-3 text-danger";
                return;
            }

            if (password !== confirmPassword) {
                message.textContent = "Passwords do not match.";
                message.className = "form-message mt-3 text-danger";
                return;
            }

            message.textContent =
                "Form validation completed. Account registration will be enabled after Django integration.";
            message.className = "form-message mt-3 text-secondary";
        });
    }
});