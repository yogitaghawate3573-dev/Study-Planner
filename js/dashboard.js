document.addEventListener("DOMContentLoaded", () => {
    seed();
    renderDashboard();
});

function renderDashboard() {
    const user = getUser();
    const subjects = data("sp_subjects", D);
    const tasks = data("sp_tasks", T);
    
    // 1. Time-aware dynamic greeting
    const greetingEl = document.getElementById("userGreeting");
    const subEl = document.getElementById("userSub");
    if (greetingEl) {
        const hour = new Date().getHours();
        let timeGreeting = "Good morning";
        if (hour >= 12 && hour < 17) timeGreeting = "Good afternoon";
        else if (hour >= 17) timeGreeting = "Good evening";
        
        const firstName = user.name ? user.name.split(" ")[0] : "Student";
        greetingEl.innerHTML = `${timeGreeting}, ${firstName} 👋`;
    }

    const pendingTasksCount = tasks.filter(t => t.status === "Pending").length;
    if (subEl) {
        subEl.innerHTML = pendingTasksCount > 0 
            ? `You have <b style="color: var(--primary);">${pendingTasksCount} pending tasks</b> scheduled. Let's make steady progress today!` 
            : `All tasks are completed! Awesome job keeping ahead of schedule 🎉`;
    }

    // 2. Metrics & Stats
    const totalSubjectsEl = document.getElementById("totalSubjects");
    const completedTasksEl = document.getElementById("completedTasks");
    const pendingTasksEl = document.getElementById("pendingTasks");
    const overallProgressEl = document.getElementById("overallProgress");
    const statProgressBar = document.getElementById("statProgressBar");
    
    if (totalSubjectsEl) totalSubjectsEl.textContent = subjects.length;
    
    const completedTasksCount = tasks.filter(t => t.status === "Completed").length;
    if (completedTasksEl) completedTasksEl.textContent = completedTasksCount;
    if (pendingTasksEl) pendingTasksEl.textContent = pendingTasksCount;
    
    // Overall progress calculation
    let totalCompleted = 0;
    let totalTarget = 0;
    subjects.forEach(s => {
        totalCompleted += s.completed;
        totalTarget += s.total;
    });
    const progressPercent = totalTarget > 0 ? Math.round((totalCompleted / totalTarget) * 100) : 0;
    if (overallProgressEl) overallProgressEl.textContent = `${progressPercent}%`;
    if (statProgressBar) statProgressBar.style.width = `${progressPercent}%`;
    
    // 3. Render Today's Tasks
    const todayTaskBody = document.getElementById("todayTaskBody");
    if (todayTaskBody) {
        if (tasks.length === 0) {
            todayTaskBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--muted); padding: 24px;">No tasks available. Click "Add Task" to create one.</td></tr>`;
        } else {
            todayTaskBody.innerHTML = tasks.slice(0, 4).map(t => {
                let priorityClass = "";
                if (t.priority === "High") priorityClass = "red";
                else if (t.priority === "Medium") priorityClass = "orange";
                else if (t.priority === "Low") priorityClass = "blue";
                
                const isDone = t.status === "Completed";
                
                return `
                    <tr>
                        <td>
                            <span class="task-row-title" style="${isDone ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${t.title}</span>
                            <span class="task-row-sub">${t.subject}</span>
                        </td>
                        <td>
                            <span class="pill ${priorityClass}">${t.priority}</span>
                        </td>
                        <td>
                            <span class="pill ${isDone ? 'green' : 'orange'}">${t.status}</span>
                        </td>
                        <td style="text-align: right;">
                            <button class="btn ${isDone ? 'secondary' : 'light'}" onclick="toggleDashboardTask(${t.id})" style="padding: 6px 12px; font-size: 12px;" title="${isDone ? 'Mark as Pending' : 'Mark as Done'}">
                                <i data-lucide="${isDone ? 'rotate-ccw' : 'check'}" style="width: 14px; height: 14px;"></i>
                                <span>${isDone ? 'Undo' : 'Done'}</span>
                            </button>
                        </td>
                    </tr>
                `;
            }).join("");
        }
    }
    
    // 4. Render Upcoming Deadlines
    const upcomingList = document.getElementById("upcomingList");
    if (upcomingList) {
        const pendingTasks = tasks.filter(t => t.status === "Pending");
        if (pendingTasks.length === 0) {
            upcomingList.innerHTML = `
                <div class="empty-state" style="padding: 24px 10px;">
                    <div class="empty-state-icon" style="background: var(--green-light); color: var(--green);">
                        <i data-lucide="check-check" style="width: 24px; height: 24px;"></i>
                    </div>
                    <h3>No Pending Deadlines</h3>
                    <p>You have caught up with all upcoming assignments!</p>
                </div>
            `;
        } else {
            pendingTasks.sort((a, b) => new Date(a.due) - new Date(b.due));
            upcomingList.innerHTML = pendingTasks.slice(0, 4).map(t => {
                const friendlyDate = formatFriendlyDate(t.due);
                let badgeClass = "orange";
                if (friendlyDate === "Today" || friendlyDate.includes("overdue")) badgeClass = "";
                else if (friendlyDate === "Tomorrow") badgeClass = "orange";
                else badgeClass = "green";

                return `
                    <div class="deadline-item">
                        <div class="info">
                            <b>${t.title}</b>
                            <span>${t.subject}</span>
                        </div>
                        <span class="deadline-badge ${badgeClass}">${friendlyDate}</span>
                    </div>
                `;
            }).join("");
        }
    }
    
    // 5. Render Subject Progress
    const subjectProgressList = document.getElementById("subjectProgressList");
    if (subjectProgressList) {
        subjectProgressList.innerHTML = subjects.slice(0, 4).map(s => {
            const pct = s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0;
            const colorClass = s.color || "blue";
            return `
                <div class="progress-row">
                    <div class="label">
                        <span>${s.name}</span>
                        <span><b>${s.completed}/${s.total}</b> <small style="color: var(--muted); font-weight: 500;">(${pct}%)</small></span>
                    </div>
                    <div class="progress ${colorClass}">
                        <i style="width: ${pct}%"></i>
                    </div>
                </div>
            `;
        }).join("");
    }
    
    // Trigger Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function toggleDashboardTask(id) {
    let a = data("sp_tasks", T);
    let t = a.find(x => x.id == id);
    if (t) {
        t.status = t.status === "Completed" ? "Pending" : "Completed";
        
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
        toast(`Task updated: ${t.status}`, t.status === "Completed" ? "success" : "info");
        renderDashboard();
        enhanceSidebar();
    }
}
