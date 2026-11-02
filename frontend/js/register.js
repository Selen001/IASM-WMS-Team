
document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "http://127.0.0.1:8000/api/accounts/";

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

    const registerForm = document.getElementById("registerForm");
    const schoolSelect = document.getElementById("school");
    const formMessage = document.getElementById("formMessage");
    const registerButton = document.getElementById("registerButton");

    function showMessage(message, success = false) {
        formMessage.textContent = message;
        formMessage.style.color = success ? "#198754" : "#dc3545";
    }

    function setupPasswordToggle(inputId, buttonId) {
        const input = document.getElementById(inputId);
        const button = document.getElementById(buttonId);

        if (!input || !button) return;

        button.addEventListener("click", function () {
            const showPassword = input.type === "password";
            input.type = showPassword ? "text" : "password";

            button.innerHTML = showPassword
                ? '<i class="bi bi-eye"></i>'
                : '<i class="bi bi-eye-slash"></i>';

            button.setAttribute(
                "aria-label",
                showPassword ? "Hide password" : "Show password"
            );
        });
    }

    setupPasswordToggle("password", "togglePassword");
    setupPasswordToggle("confirmPassword", "toggleConfirmPassword");

    async function loadSchools() {
        try {
            const response = await fetch(API_URL + "schools/");

            if (!response.ok) {
                throw new Error("Unable to load schools.");
            }

            const schools = await response.json();

            schoolSelect.innerHTML = '<option value="">Select Your School</option>';

            if (schools.length === 0) {
                schoolSelect.innerHTML = '<option value="">No active schools available</option>';
                schoolSelect.disabled = true;
                return;
            }

            schools.forEach(function (school) {
                const option = document.createElement("option");
                option.value = school.id;
                option.textContent =
                    school.name + " - " + school.district +
                    " (" + school.school_code + ")";
                schoolSelect.appendChild(option);
            });
        } catch (error) {
            schoolSelect.innerHTML = '<option value="">Unable to load schools</option>';
            schoolSelect.disabled = true;
            showMessage(
                "Could not load schools. Please check that the Django server is running."
            );
        }
    }

    loadSchools();

    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const fullName = document.getElementById("fullName").value.trim();
            const email = document.getElementById("email").value.trim();
            const schoolId = schoolSelect.value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const terms = document.getElementById("terms").checked;

            if (!fullName || !email || !schoolId || !password || !confirmPassword) {
                showMessage("Please complete all required fields.");
                return;
            }

            if (password !== confirmPassword) {
                showMessage("Passwords do not match.");
                return;
            }

            if (!terms) {
                showMessage("Please accept the terms and conditions.");
                return;
            }

            registerButton.disabled = true;
            registerButton.textContent = "Submitting...";

            try {
                const response = await fetch(API_URL + "register/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        full_name: fullName,
                        email: email,
                        password: password,
                        confirm_password: confirmPassword,
                        school_id: schoolId
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    const errorMessage = data.error;
                    showMessage(
                        Array.isArray(errorMessage)
                            ? errorMessage.join(" ")
                            : errorMessage || "Registration failed."
                    );
                    return;
                }

                showMessage(
                    data.message || "Registration submitted successfully.",
                    true
                );

                registerForm.reset();
                schoolSelect.value = "";

            } catch (error) {
                showMessage(
                    "Unable to connect to the server. Please check your backend connection."
                );
            } finally {
                registerButton.disabled = false;
                registerButton.textContent = "Create Account";
            }
        });
    }
});
