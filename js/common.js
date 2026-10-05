// Core Data Defaults
const D = [
    { id: 1, name: "Database Management System", completed: 12, total: 15, color: "green" },
    { id: 2, name: "Java Programming", completed: 26, total: 40, color: "orange" },
    { id: 3, name: "Computer Networks", completed: 18, total: 25, color: "blue" },
    { id: 4, name: "Operating Systems", completed: 14, total: 20, color: "red" },
    { id: 5, name: "Web Development", completed: 10, total: 15, color: "green" },
    { id: 6, name: "Mathematics", completed: 18, total: 20, color: "blue" }
];

const T = [
    { id: 1, title: "SQL Queries Assignment", subject: "Database Management System", due: "2026-08-28", priority: "High", status: "Pending", time: "2 hours" },
    { id: 2, title: "Java Classes & Objects Lab", subject: "Java Programming", due: "2026-08-29", priority: "Medium", status: "Completed", time: "1 hour" },
    { id: 3, title: "Computer Networks Notes Reading", subject: "Computer Networks", due: "2026-08-30", priority: "Low", status: "Pending", time: "30 minutes" },
    { id: 4, title: "Operating Systems Scheduling Algorithms", subject: "Operating Systems", due: "2026-09-02", priority: "High", status: "Pending", time: "3 hours" }
];

const DEFAULT_USER = {
    name: "Yogita Ghawate",
    studentId: "STU20240041",
    email: "yogita@gmail.com",
    course: "Bachelor of Computer Applications (BCA)",
    semester: "4th Semester",
    phone: "+91 98765 43210",
    avatar: "YG"
};

// Storage Helpers
function data(k, d) {
    return JSON.parse(localStorage.getItem(k) || JSON.stringify(d));
}

function save(k, v) {
    localStorage.setItem(k, JSON.stringify(v));
}

function getUser() {
    return data("sp_user", DEFAULT_USER);
}

function saveUser(u) {
    save("sp_user", u);
}

function seed() {
    if (!localStorage.getItem("sp_subjects")) save("sp_subjects", D);
    if (!localStorage.getItem("sp_tasks")) save("sp_tasks", T);
    if (!localStorage.getItem("sp_user")) save("sp_user", DEFAULT_USER);
}

function logout() {
    localStorage.removeItem("sp_logged");
    location.href = "login.html";
}

function login() {
    localStorage.setItem("sp_logged", "1");
    location.href = "dashboard.html";
}

// Toast Feedback Notification (Top Right)
function toast(m, type = "info", title = "") {
    let e = document.getElementById("toast");
    if (!e) {
        e = document.createElement("div");
        e.id = "toast";
        document.body.appendChild(e);
    }
    
    let iconName = "info";
    let defaultTitle = "Notification";
    if (type === "success") {
        iconName = "check-circle-2";
        defaultTitle = "Success";
    } else if (type === "error") {
        iconName = "alert-circle";
        defaultTitle = "Authentication Failed";
    } else if (type === "warning") {
        iconName = "alert-triangle";
        defaultTitle = "Warning";
    }
    
    e.className = `toast ${type}`;
    e.innerHTML = `
        <div class="toast-icon-wrap">
            <i data-lucide="${iconName}" style="width: 18px; height: 18px;"></i>
        </div>
        <div class="toast-content">
            <span class="toast-title">${title || defaultTitle}</span>
            <span class="toast-desc">${m}</span>
        </div>
    `;
    
    if (window.lucide) {
        window.lucide.createIcons();
    }
    
    e.classList.add("show");
    clearTimeout(e._timer);
    e._timer = setTimeout(() => {
        e.classList.remove("show");
    }, 3200);
}

function openModal(id) {
    let e = document.getElementById(id);
    if (e) e.classList.add("show");
}

function closeModal(id) {
    let e = document.getElementById(id);
    if (e) e.classList.remove("show");
}

function toggleSidebar() {
    let sb = document.querySelector(".sidebar");
    if (sb) {
        sb.classList.toggle("show");
    }
}

// Friendly Date Formatter (e.g., Today, Tomorrow, Aug 28)
function formatFriendlyDate(dateStr) {
    if (!dateStr) return "";
    const target = new Date(dateStr);
    if (isNaN(target.getTime())) return dateStr;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetZero = new Date(target);
    targetZero.setHours(0, 0, 0, 0);
    
    const diffDays = Math.round((targetZero - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays < -1) return `${Math.abs(diffDays)}d overdue`;
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[target.getMonth()]} ${target.getDate()}`;
}

// Dynamic Top Bar Synchronization (Live Avatar, Date, Greeting)
function syncTopBar() {
    const user = getUser();
    
    // Top bar Avatar
    document.querySelectorAll(".avatar").forEach(av => {
        av.textContent = user.avatar || user.name.slice(0, 2).toUpperCase();
        av.title = user.name;
    });

    // Date box
    const dateBoxes = document.querySelectorAll(".date-box");
    dateBoxes.forEach(box => {
        const now = new Date();
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        const dateStr = now.toLocaleDateString('en-GB', options);
        const dayStr = now.toLocaleDateString('en-GB', { weekday: 'long' });
        
        box.innerHTML = `<b>${dateStr}</b><br><span style="color: var(--muted); font-size: 11px; font-weight: 500;">${dayStr}</span>`;
    });
}

// Dynamic Sidebar Enhancement (User Card & Badge counts)
function enhanceSidebar() {
    const sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;
    
    const user = getUser();
    const tasks = data("sp_tasks", T);
    const pendingCount = tasks.filter(t => t.status === "Pending").length;
    
    // Update badge on Tasks nav link
    const taskNavLink = sidebar.querySelector("a[href='tasks.html']");
    if (taskNavLink) {
        let badge = taskNavLink.querySelector(".nav-badge");
        if (!badge) {
            badge = document.createElement("span");
            badge.className = "nav-badge";
            taskNavLink.appendChild(badge);
        }
        badge.textContent = pendingCount;
        badge.style.display = pendingCount > 0 ? "inline-block" : "none";
    }

    // Add mini user card above logout if not present
    let logoutDiv = sidebar.querySelector(".logout");
    if (logoutDiv && !sidebar.querySelector(".sidebar-user")) {
        const userContainer = document.createElement("div");
        userContainer.className = "sidebar-user";
        userContainer.innerHTML = `
            <a href="profile.html" class="sidebar-user-card" title="View Profile">
                <div class="sidebar-user-avatar">${user.avatar || user.name.slice(0, 2).toUpperCase()}</div>
                <div class="sidebar-user-info">
                    <b>${user.name}</b>
                    <span>${user.semester || 'Student'}</span>
                </div>
            </a>
        `;
        sidebar.insertBefore(userContainer, logoutDiv);
    }
}

// Global initialization
document.addEventListener("DOMContentLoaded", () => {
    seed();
    syncTopBar();
    enhanceSidebar();
    
    // Backdrop close support
    document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
        backdrop.addEventListener("click", (e) => {
            if (e.target === backdrop) {
                closeModal(backdrop.id);
            }
        });
    });

    // Mobile sidebar toggle button
    const menuBtn = document.getElementById("mobileMenuBtn");
    if (menuBtn) {
        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleSidebar();
        });
    }

    // Close mobile sidebar on tapping main
    const mainEl = document.querySelector(".main");
    if (mainEl) {
        mainEl.addEventListener("click", () => {
            let sb = document.querySelector(".sidebar");
            if (sb && sb.classList.contains("show")) {
                sb.classList.remove("show");
            }
        });
    }

    // Create Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
});
