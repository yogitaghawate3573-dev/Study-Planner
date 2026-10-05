const DEFAULT_SCHEDULE = [
    { id: 1, subject: "Database Management System", title: "DBMS SQL Queries", day: "Mon", timeSlot: "10:00 AM", color: "primary" },
    { id: 2, subject: "Operating Systems", title: "OS Process Lab", day: "Tue", timeSlot: "04:00 PM", color: "green" },
    { id: 3, subject: "Mathematics", title: "Maths Linear Algebra", day: "Wed", timeSlot: "06:00 PM", color: "primary" },
    { id: 4, subject: "Computer Networks", title: "CN Routing Protocols", day: "Thu", timeSlot: "12:00 PM", color: "orange" },
    { id: 5, subject: "Java Programming", title: "Java OOP Lab", day: "Fri", timeSlot: "10:00 AM", color: "primary" },
    { id: 6, subject: "Web Development", title: "Web Dev DOM Revision", day: "Fri", timeSlot: "02:00 PM", color: "blue" }
];

const TIME_SLOTS = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", 
    "05:00 PM", "06:00 PM", "07:00 PM"
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function renderCalendar() {
    const calBody = document.getElementById("calendarBody");
    if (!calBody) return;

    let sessions = data("sp_schedule", DEFAULT_SCHEDULE);
    let html = "";

    TIME_SLOTS.forEach(time => {
        // First column is the time slot label
        html += `<div class="cal-cell time-cell">${time}</div>`;

        // 7 columns for each day
        DAYS.forEach(day => {
            const isToday = day === "Tue";
            const session = sessions.find(s => s.day === day && s.timeSlot === time);

            if (session) {
                html += `
                    <div class="cal-cell ${isToday ? 'is-today' : ''}">
                        <div class="event ${session.color || 'primary'}">
                            <button class="del-event-btn" onclick="deleteSession(${session.id})" title="Remove session">
                                <i data-lucide="x" style="width: 12px; height: 12px;"></i>
                            </button>
                            <strong>${session.subject}</strong>
                            <span>${session.title}</span>
                        </div>
                    </div>
                `;
            } else {
                html += `<div class="cal-cell ${isToday ? 'is-today' : ''}"></div>`;
            }
        });
    });

    calBody.innerHTML = html;

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function handleSaveSession(e) {
    e.preventDefault();
    const form = e.target;
    let sessions = data("sp_schedule", DEFAULT_SCHEDULE);

    const newSession = {
        id: Date.now(),
        subject: form.subject.value,
        title: form.title.value.trim(),
        day: form.day.value,
        timeSlot: form.timeSlot.value,
        color: form.color.value
    };

    sessions.push(newSession);
    save("sp_schedule", sessions);
    closeModal("sessionModal");
    renderCalendar();
    toast(`Session added for ${newSession.day} at ${newSession.timeSlot}!`, "success");
    form.reset();
}

function deleteSession(id) {
    let sessions = data("sp_schedule", DEFAULT_SCHEDULE);
    sessions = sessions.filter(s => s.id !== id);
    save("sp_schedule", sessions);
    renderCalendar();
    toast("Study session removed", "info");
}

function switchCalView(buttonEl, viewMode) {
    document.querySelectorAll(".view-tab").forEach(tab => tab.classList.remove("active"));
    buttonEl.classList.add("active");
    toast(`Switched to ${viewMode} View`);
}

document.addEventListener("DOMContentLoaded", () => {
    seed();
    
    // Seed default schedule if not present
    if (!localStorage.getItem("sp_schedule")) {
        save("sp_schedule", DEFAULT_SCHEDULE);
    }

    // Populate subject select in session modal
    const sel = document.getElementById("sessionSubjectSelect");
    if (sel) {
        const subjects = data("sp_subjects", D);
        if (subjects.length > 0) {
            sel.innerHTML = subjects.map(s => `<option value="${s.name}">${s.name}</option>`).join("");
        }
    }

    renderCalendar();
});
