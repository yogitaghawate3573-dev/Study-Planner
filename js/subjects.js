let currentSubjectSearch = "";

function renderSubjects() {
    const listEl = document.getElementById("subjectList");
    if (!listEl) return;
    
    let a = data("sp_subjects", D);
    
    // Calculate overview ribbon metrics
    let totalCompleted = 0;
    let totalTarget = 0;
    a.forEach(s => {
        totalCompleted += s.completed;
        totalTarget += s.total;
    });
    
    const countEl = document.getElementById("subjectCountText");
    const tasksDoneEl = document.getElementById("subjectTasksDoneText");
    const avgEl = document.getElementById("subjectAvgCompletionText");
    
    if (countEl) countEl.textContent = `${a.length} Subjects`;
    if (tasksDoneEl) tasksDoneEl.textContent = `${totalCompleted} / ${totalTarget} Tasks`;
    const avgPct = totalTarget > 0 ? Math.round((totalCompleted / totalTarget) * 100) : 0;
    if (avgEl) avgEl.textContent = `${avgPct}%`;
    
    // Filter by search
    if (currentSubjectSearch) {
        a = a.filter(s => s.name.toLowerCase().includes(currentSubjectSearch.toLowerCase()));
    }
    
    if (a.length === 0) {
        listEl.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-state-icon">
                    <i data-lucide="book-open" style="width: 26px; height: 26px;"></i>
                </div>
                <h3>No Subjects Found</h3>
                <p>${currentSubjectSearch ? 'No subjects match your search.' : 'You have not added any subjects yet. Click "+ Add Subject" to get started.'}</p>
                ${currentSubjectSearch ? '<button class="btn white" onclick="document.getElementById(\'subjectSearch\').value=\'\'; currentSubjectSearch=\'\'; renderSubjects();">Clear Search</button>' : ''}
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
    }
    
    listEl.innerHTML = a.map(s => {
        const pct = s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0;
        let colorClass = s.color || "blue";
        
        return `
            <div class="subject-card">
                <div class="subject-head">
                    <div class="subject-icon ${colorClass}">
                        <i data-lucide="book" style="width: 20px; height: 20px;"></i>
                    </div>
                    <button class="btn-delete-sub" onclick="delSub(${s.id})" title="Delete Subject">
                        <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
                    </button>
                </div>
                <h3 class="subject-title">${s.name}</h3>
                <div class="subject-meta">
                    <span>${s.completed}/${s.total} Tasks Completed</span>
                    <b>${pct}%</b>
                </div>
                <div class="progress ${colorClass}">
                    <i style="width: ${pct}%"></i>
                </div>
                <div class="subject-card-footer">
                    <a class="subject-tasks-link" href="tasks.html?subject=${encodeURIComponent(s.name)}">
                        <span>View Tasks</span>
                        <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
                    </a>
                    <span class="pill ${pct === 100 ? 'green' : 'blue'}" style="font-size: 11px;">
                        ${pct === 100 ? 'Completed' : 'In Progress'}
                    </span>
                </div>
            </div>
        `;
    }).join("");
    
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function filterSubjects() {
    const input = document.getElementById("subjectSearch");
    currentSubjectSearch = input ? input.value.trim() : "";
    renderSubjects();
}

function addSubject(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const total = +form.total.value || 10;
    const color = form.color.value || "blue";
    
    let a = data("sp_subjects", D);
    
    a.push({
        id: Date.now(),
        name: name,
        completed: 0,
        total: total,
        color: color
    });
    
    save("sp_subjects", a);
    closeModal("subjectModal");
    renderSubjects();
    toast(`Subject "${name}" added successfully!`, "success");
    form.reset();
}

function delSub(id) {
    let a = data("sp_subjects", D);
    const sub = a.find(x => x.id == id);
    if (!sub) return;
    
    if (confirm(`Are you sure you want to delete "${sub.name}"?`)) {
        save("sp_subjects", a.filter(x => x.id != id));
        renderSubjects();
        toast("Subject deleted", "info");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    seed();
    renderSubjects();
});
