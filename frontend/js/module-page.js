document.addEventListener("DOMContentLoaded", function () {
    const root = document.getElementById("moduleRoot");
    if (!root) return;

    const modules = {
        academics: {
            title: "Academics",
            eyebrow: "ACADEMIC MANAGEMENT",
            description: "Manage classes, subjects, examinations and academic progress.",
            stats: ["Classes", "Subjects", "Examinations", "Results Published"],
            columns: ["Class", "Subject", "Teacher", "Academic Year", "Status"],
            fields: [
                ["Class", "text"],
                ["Subject", "text"],
                ["Teacher", "text"],
                ["Academic Year", "text"],
                ["Status", "select", ["Planned", "Ongoing", "Completed"]]
            ]
        },
        attendance: {
            title: "Attendance",
            eyebrow: "STUDENT ATTENDANCE",
            description: "Record and review daily student attendance.",
            stats: ["Students", "Present", "Absent", "Attendance Rate"],
            columns: ["Date", "Class", "Total Students", "Present", "Absent"],
            fields: [
                ["Date", "date"],
                ["Class", "text"],
                ["Total Students", "number"],
                ["Present", "number"],
                ["Absent", "number"]
            ]
        },
        hostel: {
            title: "Hostel Management",
            eyebrow: "HOSTEL AND ACCOMMODATION",
            description: "Monitor hostel rooms, occupancy and student accommodation.",
            stats: ["Hostels", "Total Rooms", "Occupied Rooms", "Available Rooms"],
            columns: ["Hostel", "Room Number", "Capacity", "Occupied", "Status"],
            fields: [
                ["Hostel", "text"],
                ["Room Number", "text"],
                ["Capacity", "number"],
                ["Occupied", "number"],
                ["Status", "select", ["Available", "Full", "Maintenance"]]
            ]
        },
        health: {
            title: "Health & Welfare",
            eyebrow: "STUDENT HEALTH AND WELFARE",
            description: "Manage authorized student health and welfare records.",
            stats: ["Health Records", "Follow-ups", "Welfare Cases", "Resolved Cases"],
            columns: ["Student ID", "Record Type", "Date", "Follow-up Date", "Status"],
            fields: [
                ["Student ID", "text"],
                ["Record Type", "select", ["Health Check-up", "Welfare Support", "Referral"]],
                ["Date", "date"],
                ["Follow-up Date", "date"],
                ["Status", "select", ["Open", "Follow-up", "Resolved"]]
            ]
        },
        inventory: {
            title: "Food & Inventory",
            eyebrow: "FOOD AND INVENTORY MANAGEMENT",
            description: "Track food stock, allocations, suppliers and quality checks.",
            stats: ["Stock Items", "Low Stock Items", "Suppliers", "Pending Deliveries"],
            columns: ["Item", "Category", "Available Quantity", "Unit", "Stock Status"],
            fields: [
                ["Item", "text"],
                ["Category", "select", ["Grains", "Vegetables", "Dairy", "Other"]],
                ["Available Quantity", "number"],
                ["Unit", "text"],
                ["Stock Status", "select", ["Available", "Low Stock", "Out of Stock"]]
            ]
        },
        staff: {
            title: "Staff Management",
            eyebrow: "SCHOOL STAFF INFORMATION",
            description: "Maintain staff profiles, roles and employment information.",
            stats: ["Total Staff", "Teaching Staff", "Non-Teaching Staff", "On Leave"],
            columns: ["Employee ID", "Name", "Designation", "Department", "Status"],
            fields: [
                ["Employee ID", "text"],
                ["Name", "text"],
                ["Designation", "text"],
                ["Department", "text"],
                ["Status", "select", ["Active", "On Leave", "Inactive"]]
            ]
        },
        complaints: {
            title: "Complaints",
            eyebrow: "GRIEVANCE MANAGEMENT",
            description: "Register, assign and monitor school complaints.",
            stats: ["Total Complaints", "Open", "Under Review", "Resolved"],
            columns: ["Complaint ID", "Subject", "Category", "Date", "Status"],
            fields: [
                ["Complaint ID", "text"],
                ["Subject", "text"],
                ["Category", "select", ["Hostel", "Food", "Academic", "Facilities", "Other"]],
                ["Date", "date"],
                ["Status", "select", ["Open", "Under Review", "Resolved"]]
            ]
        },
        reports: {
            title: "Reports & Analytics",
            eyebrow: "MONITORING AND ANALYTICS",
            description: "Review school performance and welfare monitoring reports.",
            stats: ["Available Reports", "School Reports", "Pending Reviews", "Generated Reports"],
            columns: ["Report Name", "Category", "Reporting Period", "Generated By", "Status"],
            fields: [
                ["Report Name", "text"],
                ["Category", "select", ["Students", "Attendance", "Hostel", "Food", "Welfare"]],
                ["Reporting Period", "text"],
                ["Generated By", "text"],
                ["Status", "select", ["Draft", "Ready for Review", "Reviewed"]]
            ]
        },
        notifications: {
            title: "Notifications",
            eyebrow: "SYSTEM COMMUNICATION",
            description: "Review system notices and administrative notifications.",
            stats: ["Total Notices", "Unread", "Important", "Archived"],
            columns: ["Title", "Category", "Date", "Recipient", "Status"],
            fields: [
                ["Title", "text"],
                ["Category", "select", ["System", "Academic", "Welfare", "Administrative"]],
                ["Date", "date"],
                ["Recipient", "text"],
                ["Status", "select", ["Unread", "Read", "Archived"]]
            ]
        },
        "audit-logs": {
            title: "Audit Logs",
            eyebrow: "SYSTEM ACCOUNTABILITY",
            description: "Review recorded user actions and system activity.",
            stats: ["Total Events", "User Actions", "Updates", "Access Events"],
            columns: ["Date & Time", "User", "Action", "Module", "Result"],
            fields: [
                ["Date & Time", "datetime-local"],
                ["User", "text"],
                ["Action", "text"],
                ["Module", "text"],
                ["Result", "select", ["Success", "Failed", "Pending"]]
            ]
        }
    };

    const key = document.body.dataset.module;
    const config = modules[key];

    if (!config) {
        root.textContent = "Module configuration not found.";
        return;
    }

    const links = [
        ["dashboard.html", "Overview", "▦"],
        ["student.html", "Students", "♙"],
        ["academics.html", "Academics", "▤"],
        ["attendance.html", "Attendance", "✓"],
        ["hostel.html", "Hostel Management", "⌂"],
        ["health.html", "Health & Welfare", "✚"],
        ["inventory.html", "Food & Inventory", "▣"],
        ["staff.html", "Staff Management", "♧"],
        ["complaints.html", "Complaints", "☏"],
        ["reports.html", "Reports & Analytics", "▥"],
        ["notifications.html", "Notifications", "✉"],
        ["audit-logs.html", "Audit Logs", "▤"]
    ];

    const sidebarLinks = links.map(item => {
        const active = item[0] === key + ".html" ? "active" : "";
        return `<a href="${item[0]}" class="nav-link ${active}">
            <span>${item[2]}</span>${item[1]}</a>`;
    }).join("");

    const statCards = config.stats.map((label, index) => `
        <article class="stat-card">
            <div class="stat-caption">SUMMARY</div>
            <div class="stat-value" id="stat${index}">—</div>
            <div class="stat-title">${label}</div>
            <div class="stat-foot">Awaiting verified database data</div>
        </article>
    `).join("");

    const headers = config.columns.map(label => `<th>${label}</th>`).join("");

    const fields = config.fields.map((field, index) => {
        const id = "moduleField" + index;
        let control = "";

        if (field[1] === "select") {
            control = `<select class="form-select" id="${id}" required>
                <option value="">Select ${field[0]}</option>
                ${field[2].map(option => `<option>${option}</option>`).join("")}
            </select>`;
        } else {
            control = `<input class="form-control" id="${id}" type="${field[1]}" required>`;
        }

        return `<div class="col-md-6">
            <label class="form-label" for="${id}">${field[0]}</label>
            ${control}
        </div>`;
    }).join("");

    root.innerHTML = `
        <div class="app-layout">
            <aside class="sidebar" id="sidebar">
                <div class="brand">
                    <div class="brand-mark">I</div>
                    <div><h1>IASM-WMS</h1><p>School Welfare System</p></div>
                </div>
                <div class="nav-label">MAIN MENU</div>
                <nav class="sidebar-nav">${sidebarLinks}</nav>
                <div class="sidebar-footer">
                    <div class="status-dot"></div>
                    <div><strong>Frontend Preview</strong><small>Backend not connected</small></div>
                </div>
            </aside>

            <main class="main-content">
                <header class="topbar">
                    <button class="menu-toggle" id="menuToggle" type="button">☰</button>
                    <div class="breadcrumb-text">Dashboard <span>/</span> ${config.title}</div>
                    <div class="topbar-actions">
                        <div class="system-status"><span></span> Frontend Preview</div>
                        <div class="profile">
                            <div class="profile-avatar">SA</div>
                            <div class="profile-info">
                                <strong>School Staff</strong>
                                <small>IASM-WMS Portal</small>
                            </div>
                        </div>
                    </div>
                </header>

                <section class="page-content">
                    <div class="welcome-section">
                        <div>
                            <div class="eyebrow">${config.eyebrow}</div>
                            <h2>${config.title}</h2>
                            <p>${config.description}</p>
                        </div>
                        <button class="btn btn-primary px-4 py-2" id="showModuleForm">
                            + Add Record
                        </button>
                    </div>

                    <div class="notice-banner">
                        <div class="notice-icon">i</div>
                        <div>
                            <strong>Frontend Preview</strong>
                            <p>Module layout is available for review. No records are being saved to the database yet.</p>
                        </div>
                    </div>

                    <div class="stats-grid">${statCards}</div>

                    <section class="panel d-none" id="moduleFormPanel">
                        <div class="panel-header">
                            <div>
                                <h3>Add ${config.title} Record</h3>
                                <p>Enter the information below.</p>
                            </div>
                            <button class="btn btn-outline-secondary btn-sm" id="cancelModuleForm" type="button">Cancel</button>
                        </div>

                        <form id="moduleForm">
                            <div class="row g-3">${fields}</div>
                            <button class="btn btn-primary mt-4" type="submit">Add Preview Record</button>
                            <p id="moduleMessage" class="form-message mt-3"></p>
                        </form>
                    </section>

                    <section class="panel">
                        <div class="panel-header">
                            <div>
                                <h3>${config.title} Directory</h3>
                                <p>Search and review ${config.title.toLowerCase()} information.</p>
                            </div>
                        </div>

                        <div class="row mb-3">
                            <div class="col-md-7">
                                <label class="form-label" for="moduleSearch">Search Records</label>
                                <input class="form-control" id="moduleSearch" type="search" placeholder="Search records">
                            </div>
                        </div>

                        <div class="table-responsive">
                            <table class="table table-hover align-middle">
                                <thead class="table-light"><tr>${headers}<th>Action</th></tr></thead>
                                <tbody id="moduleTable"></tbody>
                            </table>
                        </div>
                        <div id="moduleEmpty" class="table-empty">No preview records have been added.</div>
                    </section>

                    <footer class="page-footer">
                        <span>IASM-WMS · Integrated Ashram School Management and Welfare Monitoring System</span>
                        <span>${config.title} · Frontend Preview</span>
                    </footer>
                </section>
            </main>
        </div>
    `;

    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");

    menuToggle.addEventListener("click", () => sidebar.classList.toggle("open"));

    const panel = document.getElementById("moduleFormPanel");
    const form = document.getElementById("moduleForm");
    const table = document.getElementById("moduleTable");
    const empty = document.getElementById("moduleEmpty");
    const search = document.getElementById("moduleSearch");

    document.getElementById("showModuleForm").addEventListener("click", () => {
        panel.classList.remove("d-none");
        panel.scrollIntoView({ behavior: "smooth" });
    });

    document.getElementById("cancelModuleForm").addEventListener("click", () => {
        panel.classList.add("d-none");
        form.reset();
    });

    form.addEventListener("submit", event => {
        event.preventDefault();

        const values = config.fields.map((field, index) =>
            document.getElementById("moduleField" + index).value.trim()
        );

        if (values.some(value => !value)) {
            document.getElementById("moduleMessage").textContent = "Complete all fields.";
            return;
        }

        const row = document.createElement("tr");

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");
        actionCell.textContent = "Preview";
        row.appendChild(actionCell);
        table.appendChild(row);

        form.reset();
        panel.classList.add("d-none");
        filterRows();

        alert("Preview only: this record has not been saved to Django or PostgreSQL.");
    });

    function filterRows() {
        const query = search.value.trim().toLowerCase();
        let count = 0;

        Array.from(table.rows).forEach(row => {
            const visible = row.textContent.toLowerCase().includes(query);
            row.classList.toggle("d-none", !visible);
            if (visible) count++;
        });

        empty.classList.toggle("d-none", count > 0);
        if (table.rows.length && count === 0) {
            empty.textContent = "No matching records found.";
        }
    }

    search.addEventListener("input", filterRows);
});