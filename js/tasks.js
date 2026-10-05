let currentStatusTab = "All";
let currentPriorityFilter = "All";
let currentSubjectFilter = "All";

function populateSubjectFilter() {
    const select = document.getElementById("taskSubjectFilter");
    if (!select) return;
    
    const subjects = data("sp_subjects", D);
    const existing = select.value || "All";
    
    select.innerHTML = `<option value="All">All Subjects</option>` + 
        subjects.map(s => `<option value="${s.name}">${s.name}</option>`).join("");
        
    // Check if query param exists
    const urlParams = new URLSearchParams(window.location.search);
    const subjectParam = urlParams.get('subject');
    if (subjectParam) {
        select.value = subjectParam;
        currentSubjectFilter = subjectParam;
    } else {
        select.value = existing;
    }
}

function updateTaskMetrics(allTasks) {
    const totalEl = document.getElementById("summaryTotal");
    const pendingEl = document.getElementById("summaryPending");
    const completedEl = document.getElementById("summaryCompleted");
    const highEl = document.getElementById("summaryHigh");
    
    if (totalEl) totalEl.textContent = allTasks.length;
    if (pendingEl) pendingEl.textContent = allTasks.filter(t => t.status === "Pending").length;
    if (completedEl) completedEl.textContent = allTasks.filter(t => t.status === "Completed").length;
    if (highEl) highEl.textContent = allTasks.filter(t => t.priority === "High" && t.status === "Pending").length;
}

function renderTasks() {
    let tbody = document.getElementById("taskBody");
    if (!tbody) return;
    
    let allTasks = data("sp_tasks", T);
    updateTaskMetrics(allTasks);
    
    let q = (document.getElementById("taskSearch")?.value || "").toLowerCase().trim();
    let priorityVal = document.getElementById("taskPriorityFilter")?.value || currentPriorityFilter;
    let subjectVal = document.getElementById("taskSubjectFilter")?.value || currentSubjectFilter;
    
    currentPriorityFilter = priorityVal;
    currentSubjectFilter = subjectVal;
    
    // Filter tasks
    let filtered = allTasks.filter(t => {
        const matchesStatus = currentStatusTab === "All" || t.status === currentStatusTab;
        const matchesPriority = currentPriorityFilter === "All" || t.priority === currentPriorityFilter;
        const matchesSubject = currentSubjectFilter === "All" || t.subject === currentSubjectFilter;
        const matchesSearch = !q || t.title.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q);
        
        return matchesStatus && matchesPriority && matchesSubject && matchesSearch;
    });
    
    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="padding: 0;">
                    <div class="empty-state">
                        <div class="empty-state-icon">
                            <i data-lucide="check-square" style="width: 24px; height: 24px;"></i>
                        </div>
                        <h3>No Tasks Found</h3>
                        <p>No study tasks matched your active filter criteria.</p>
                        <button class="btn white" onclick="resetTaskFilters()">Reset Filters</button>
                    </div>
                </td>
            </tr>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
    }
    
    tbody.innerHTML = filtered.map(t => {
        let pClass = "blue";
        if (t.priority === "High") pClass = "red";
        else if (t.priority === "Medium") pClass = "orange";
        
        const isDone = t.status === "Completed";
        const friendlyDate = formatFriendlyDate(t.due);
        let dueClass = "pill";
        if (friendlyDate.includes("overdue") && !isDone) dueClass = "pill red";
        else if (friendlyDate === "Today" && !isDone) dueClass = "pill orange";
        else if (isDone) dueClass = "pill green";
        
        return `
            <tr style="${isDone ? 'background-color: #fafbfc;' : ''}">
                <td>
                    <button class="task-check-btn ${isDone ? 'checked' : ''}" onclick="toggleTask(${t.id})" title="${isDone ? 'Mark as Pending' : 'Mark as Completed'}">
                        <i data-lucide="check" style="width: 14px; height: 14px; display: ${isDone ? 'block' : 'none'};"></i>
                    </button>
                </td>
                <td>
                    <div style="font-weight: 700; color: var(--text); font-size: 14px; ${isDone ? 'text-decoration: line-through; opacity: 0.6;' : ''}">
                        ${t.title}
                    </div>
                    ${t.time ? `<div class="task-time-pill"><i data-lucide="clock" style="width: 12px; height: 12px;"></i> Est. ${t.time}</div>` : ''}
                </td>
                <td>
                    <span style="color: var(--text-secondary); font-weight: 600; font-size: 13px;">${t.subject}</span>
                </td>
                <td>
                    <span class="${dueClass}">${friendlyDate}</span>
                </td>
                <td>
                    <span class="pill ${pClass}">${t.priority}</span>
                </td>
                <td>
                    <span class="pill ${isDone ? 'green' : 'orange'}">${t.status}</span>
                </td>
                <td style="text-align: right;">
                    <button class="btn danger" onclick="deleteTask(${t.id})" style="padding: 6px 10px; font-size: 12px;" title="Delete Task">
                        <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join("");
    
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function setStatusTab(status) {
    currentStatusTab = status;
    document.querySelectorAll(".status-tab").forEach(tab => {
        tab.classList.toggle("active", tab.dataset.status === status);
    });
    renderTasks();
}

function setPriorityFilter(priority) {
    const sel = document.getElementById("taskPriorityFilter");
    if (sel) {
        sel.value = priority;
        currentPriorityFilter = priority;
    }
    renderTasks();
}

function resetTaskFilters() {
    currentStatusTab = "All";
    currentPriorityFilter = "All";
    currentSubjectFilter = "All";
    
    document.querySelectorAll(".status-tab").forEach(tab => {
        tab.classList.toggle("active", tab.dataset.status === "All");
    });
    
    const prioEl = document.getElementById("taskPriorityFilter");
    if (prioEl) prioEl.value = "All";
    
    const subEl = document.getElementById("taskSubjectFilter");
    if (subEl) subEl.value = "All";
    
    const searchEl = document.getElementById("taskSearch");
    if (searchEl) searchEl.value = "";
    
    renderTasks();
}

function toggleTask(id) {
    let a = data("sp_tasks", T);
    let t = a.find(x => x.id == id);
    if (t) {
        t.status = t.status === "Completed" ? "Pending" : "Completed";
        
        // Update subjects completion stats
        let subjects = data("sp_subjects", D);
        let s = subjects.find(x => x.name === t.subject);
        if (s) {
            if (t.status === "Completed") {
                s.completed = Math.min(s.total, s.completed + 1);
            } else {
                s.completed = Math.max(0, s.completed - 1);
            }
            save("sp_subjects", subjects);
        }
        
        save("sp_tasks", a);
        renderTasks();
        enhanceSidebar();
        toast(`Task marked as ${t.status}`, t.status === "Completed" ? "success" : "info");
    }
}

function deleteTask(id) {
    let a = data("sp_tasks", T);
    let t = a.find(x => x.id == id);
    if (!t) return;
    
    if (confirm(`Are you sure you want to delete task "${t.title}"?`)) {
        if (t.status === "Completed") {
            let subjects = data("sp_subjects", D);
            let s = subjects.find(x => x.name === t.subject);
            if (s) {
                s.completed = Math.max(0, s.completed - 1);
                save("sp_subjects", subjects);
            }
        }
        
        save("sp_tasks", a.filter(x => x.id != id));
        renderTasks();
        enhanceSidebar();
        toast("Task deleted successfully", "info");
    }
}

function saveTask(e) {
    e.preventDefault();
    let f = new FormData(e.target);
    let a = data("sp_tasks", T);
    
    const newTask = {
        id: Date.now(),
        title: f.get("title"),
        subject: f.get("subject"),
        description: f.get("description") || "",
        due: f.get("due"),
        time: f.get("time") || "1 hour",
        priority: f.get("priority") || "Medium",
        status: f.get("status") || "Pending"
    };
    
    a.push(newTask);
    save("sp_tasks", a);
    
    // Increment total tasks count of subject
    let subjects = data("sp_subjects", D);
    let s = subjects.find(x => x.name === f.get("subject"));
    if (s) {
        s.total += 1;
        if (f.get("status") === "Completed") {
            s.completed += 1;
        }
        save("sp_subjects", subjects);
    }
    
    toast("Task created successfully!", "success");
    setTimeout(() => {
        location.href = "tasks.html";
    }, 400);
}

document.addEventListener("DOMContentLoaded", () => {
    seed();
    populateSubjectFilter();
    renderTasks();
    
    // Check if we are on add-task.html to pre-populate subject options dynamically
    let selectSubject = document.querySelector("select[name='subject']");
    if (selectSubject) {
        let subjects = data("sp_subjects", D);
        if (subjects.length > 0) {
            selectSubject.innerHTML = subjects.map(s => `<option value="${s.name}">${s.name}</option>`).join("");
        }
    }
});
