document.addEventListener("DOMContentLoaded", () => {
    seed();
    
    const user = getUser();
    const subjects = data("sp_subjects", D);
    const tasks = data("sp_tasks", T);
    
    // 1. Calculate task completion ratios
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "Completed").length;
    const pendingTasks = tasks.filter(t => t.status === "Pending").length;
    
    const ratioPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    const ratioRing = document.getElementById("ratioRing");
    const ratioText = document.getElementById("ratioText");
    const legendCompleted = document.getElementById("legendCompleted");
    const legendPending = document.getElementById("legendPending");
    
    if (ratioText) ratioText.textContent = `${ratioPercent}%`;
    if (ratioRing) {
        ratioRing.style.background = `conic-gradient(var(--green) 0% ${ratioPercent}%, var(--orange) ${ratioPercent}% 100%)`;
    }
    if (legendCompleted) legendCompleted.textContent = `Completed (${completedTasks})`;
    if (legendPending) legendPending.textContent = `Pending (${pendingTasks})`;
    
    // 2. Render Subject Progress
    const reportSubjectList = document.getElementById("reportSubjectList");
    if (reportSubjectList) {
        reportSubjectList.innerHTML = subjects.map(s => {
            const pct = s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0;
            const colorClass = s.color || "blue";
            return `
                <div class="progress-row">
                    <div class="label">
                        <span style="font-weight: 600;">${s.name}</span>
                        <span><b>${s.completed}/${s.total}</b> <small style="color: var(--muted);">(${pct}%)</small></span>
                    </div>
                    <div class="progress ${colorClass}">
                        <i style="width: ${pct}%"></i>
                    </div>
                </div>
            `;
        }).join("");
    }

    // 3. Print Date Formatter
    const printDateEl = document.getElementById("printDate");
    if (printDateEl) {
        const now = new Date();
        printDateEl.textContent = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    if (window.lucide) {
        window.lucide.createIcons();
    }
});
