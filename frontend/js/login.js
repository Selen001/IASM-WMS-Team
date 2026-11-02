
document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "http://127.0.0.1:8000/api/accounts/";

    const menuToggle = document.getElementById("menuToggle");
    const navigation = document.getElementById("navigation");
    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    const formMessage = document.getElementById("formMessage");
    const loginButton = loginForm.querySelector(".login-button");
    const forgotPassword = document.getElementById("forgotPassword");

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

    function showMessage(message, success = false) {
        formMessage.textContent = message;
        formMessage.style.color = success ? "#198754" : "#dc3545";
    }

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", function () {
            const showPassword = passwordInput.type === "password";

            passwordInput.type = showPassword ? "text" : "password";

            togglePassword.innerHTML = showPassword
                ? '<i class="bi bi-eye"></i>'
                : '<i class="bi bi-eye-slash"></i>';

            togglePassword.setAttribute(
                "aria-label",
                showPassword ? "Hide password" : "Show password"
            );
        });
    }

    const dashboardRoutes = {
        SYSTEM_ADMIN: "dashboards/admin-dashboard.html",
        DEPARTMENT_OFFICER: "dashboards/department-dashboard.html",
        PRINCIPAL: "dashboards/principal-dashboard.html",
        SCHOOL_STAFF: "dashboards/staff-dashboard.html",
        HEALTH_WELFARE_STAFF: "dashboards/health-dashboard.html"
    };

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            showMessage("Please enter your email and password.");
            return;
        }

        loginButton.disabled = true;
        loginButton.textContent = "Signing in...";

        try {
            const response = await fetch(API_URL + "login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                showMessage(data.error || "Login failed. Please try again.");
                return;
            }

            const dashboard = dashboardRoutes[data.user.role];

            if (!dashboard) {
                showMessage("Your account does not have an assigned dashboard.");
                return;
            }

            sessionStorage.setItem("iasm_token", data.token);
            sessionStorage.setItem("iasm_user", JSON.stringify(data.user));

            showMessage("Login successful. Redirecting...", true);

            window.location.href = dashboard;

        } catch (error) {
            showMessage(
                "Unable to connect to the server. Please check your internet and backend server."
            );
        } finally {
            loginButton.disabled = false;
            loginButton.textContent = "Login";
        }
    });

    if (forgotPassword) {
        forgotPassword.addEventListener("click", function (event) {
            event.preventDefault();
            showMessage(
                "Password recovery is not available yet. Please contact your system administrator."
            );
        });
    }
});
