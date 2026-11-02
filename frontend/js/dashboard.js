
document.addEventListener("DOMContentLoaded", function () {
    const dateElement = document.getElementById("currentDate");

    if (dateElement) {
        dateElement.textContent = new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).format(new Date());
    }

    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");

    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", function () {
            sidebar.classList.toggle("open");
        });

        document.querySelectorAll(".sidebar-nav .nav-link").forEach(function (link) {
            link.addEventListener("click", function () {
                if (window.innerWidth <= 900) {
                    sidebar.classList.remove("open");
                }
            });
        });
    }

    const attendanceCanvas = document.getElementById("attendanceChart");

    if (attendanceCanvas && typeof Chart !== "undefined") {
        new Chart(attendanceCanvas, {
            type: "line",
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
                datasets: [{
                    label: "Attendance",
                    data: [88, 91, 89, 93, 92, 95, 94, 96, 94, 95],
                    borderColor: "#3868b2",
                    backgroundColor: "rgba(56, 104, 178, 0.10)",
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 3,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        min: 70,
                        max: 100,
                        ticks: {
                            callback: function (value) {
                                return value + "%";
                            }
                        },
                        grid: {
                            color: "#edf1f6"
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    const welfareCanvas = document.getElementById("welfareChart");

    if (welfareCanvas && typeof Chart !== "undefined") {
        new Chart(welfareCanvas, {
            type: "doughnut",
            data: {
                labels: ["Hostel Residents", "Day Scholars"],
                datasets: [{
                    data: [68, 32],
                    backgroundColor: ["#3868b2", "#35b6a4"],
                    borderWidth: 0,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "72%",
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
});
