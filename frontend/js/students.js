document.addEventListener("DOMContentLoaded", function () {
    const table = document.getElementById("studentTable");
    if (!table) return;

    const form = document.getElementById("studentForm");
    const formPanel = document.getElementById("studentFormPanel");
    const addButton = document.getElementById("addStudentButton");
    const cancelButton = document.getElementById("cancelStudentButton");
    const searchInput = document.getElementById("studentSearch");
    const statusFilter = document.getElementById("statusFilter");
    const emptyMessage = document.getElementById("emptyMessage");
    const message = document.getElementById("studentFormMessage");

    const enrollmentInput = document.getElementById("enrollmentNumber");
    const nameInput = document.getElementById("studentName");
    const schoolInput = document.getElementById("schoolName");
    const dobInput = document.getElementById("dateOfBirth");
    const admissionInput = document.getElementById("admissionDate");
    const statusInput = document.getElementById("studentStatus");

    let editingRow = null;

    function rows() {
        return Array.from(table.querySelectorAll("tr"));
    }

    function showMessage(text, type = "secondary") {
        message.textContent = text;
        message.className = "form-message mt-3 text-" + type;
    }

    function updateCounts() {
        const all = rows();
        const active = all.filter(row => row.dataset.status === "ACTIVE").length;

        document.getElementById("studentCount").textContent = all.length;
        document.getElementById("activeCount").textContent = active;
        document.getElementById("otherCount").textContent = all.length - active;
    }

    function makeCell(value) {
        const cell = document.createElement("td");
        cell.textContent = value;
        return cell;
    }

    function makeRow(data) {
        const row = document.createElement("tr");
        row.dataset.status = data.status;
        row.dataset.dob = data.dob;

        row.appendChild(makeCell(data.enrollment));
        row.appendChild(makeCell(data.name));
        row.appendChild(makeCell(data.school));
        row.appendChild(makeCell(data.admission));

        const statusCell = makeCell("");
        const badge = document.createElement("span");
        badge.className = "badge text-bg-" +
            (data.status === "ACTIVE" ? "success" :
            data.status === "TRANSFERRED" ? "warning" :
            data.status === "GRADUATED" ? "primary" : "secondary");
        badge.textContent = data.status.charAt(0) + data.status.slice(1).toLowerCase();
        statusCell.appendChild(badge);
        row.appendChild(statusCell);

        const actionCell = makeCell("");
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "btn btn-sm btn-outline-primary edit-student";
        editButton.textContent = "Edit";
        actionCell.appendChild(editButton);
        row.appendChild(actionCell);

        return row;
    }

    function filterRows() {
        const query = searchInput.value.trim().toLowerCase();
        const status = statusFilter.value;
        let visible = 0;

        rows().forEach(row => {
            const matchesText = row.textContent.toLowerCase().includes(query);
            const matchesStatus = !status || row.dataset.status === status;
            const show = matchesText && matchesStatus;

            row.classList.toggle("d-none", !show);
            if (show) visible++;
        });

        emptyMessage.classList.toggle("d-none", visible > 0);
        if (rows().length === 0) {
            emptyMessage.textContent = "No preview records have been added.";
        } else if (visible === 0) {
            emptyMessage.textContent = "No matching students found.";
        }
    }

    function openForm(row = null) {
        editingRow = row;
        form.reset();
        showMessage("");

        if (row) {
            enrollmentInput.value = row.cells[0].textContent;
            nameInput.value = row.cells[1].textContent;
            schoolInput.value = row.cells[2].textContent;
            dobInput.value = row.dataset.dob;
            admissionInput.value = row.cells[3].textContent;
            statusInput.value = row.dataset.status;
            enrollmentInput.readOnly = true;
            document.getElementById("studentFormTitle").textContent = "Edit Student";
        } else {
            enrollmentInput.readOnly = false;
            document.getElementById("studentFormTitle").textContent = "Add New Student";
        }

        formPanel.classList.remove("d-none");
        formPanel.scrollIntoView({ behavior: "smooth" });
    }

    function closeForm() {
        formPanel.classList.add("d-none");
        form.reset();
        enrollmentInput.readOnly = false;
        editingRow = null;
    }

    addButton.addEventListener("click", () => openForm());
    cancelButton.addEventListener("click", closeForm);

    table.addEventListener("click", function (event) {
        const button = event.target.closest(".edit-student");
        if (button) openForm(button.closest("tr"));
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const data = {
            enrollment: enrollmentInput.value.trim(),
            name: nameInput.value.trim(),
            school: schoolInput.value.trim(),
            dob: dobInput.value,
            admission: admissionInput.value,
            status: statusInput.value
        };

        if (!data.enrollment || !data.name || !data.school ||
            !data.dob || !data.admission) {
            showMessage("Complete all required fields.", "danger");
            return;
        }

        const today = new Date().toISOString().slice(0, 10);

        if (data.dob > today || data.admission > today) {
            showMessage("Date of birth and admission date cannot be in the future.", "danger");
            return;
        }

        if (data.dob > data.admission) {
            showMessage("Date of birth must be earlier than admission date.", "danger");
            return;
        }

        const duplicate = rows().some(row =>
            row !== editingRow &&
            row.cells[0].textContent.trim().toLowerCase() === data.enrollment.toLowerCase()
        );

        if (duplicate) {
            showMessage("This enrollment number already exists.", "danger");
            return;
        }

        if (editingRow) {
            const replacement = makeRow(data);
            editingRow.replaceWith(replacement);
        } else {
            table.appendChild(makeRow(data));
        }

        updateCounts();
        searchInput.value = "";
        statusFilter.value = "";
        filterRows();
        closeForm();

        alert("Preview only: this record is not saved to Django or PostgreSQL.");
    });

    searchInput.addEventListener("input", filterRows);
    statusFilter.addEventListener("change", filterRows);

    updateCounts();
    filterRows();
});