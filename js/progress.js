document.addEventListener("DOMContentLoaded", () => {
    seed();
    renderProgressPage();
});

function renderProgressPage() {
    const subjects = data("sp_subjects", D);
    const tasks = data("sp_tasks", T);
    
    // 1. Calculate overall progress
    let totalCompleted = 0;
    let totalTarget = 0;
    subjects.forEach(s => {
        totalCompleted += s.completed;
        totalTarget += s.total;
    });
    const progressPercent = totalTarget > 0 ? Math.round((totalCompleted / totalTarget) * 100) : 0;
    
    // 2. Animate SVG circular progress gauge
    const ringTextEl = document.getElementById("progressRingText");
    const summaryTextEl = document.getElementById("progressSummaryText");
    const svgFill = document.getElementById("svgGaugeFill");
    
    if (ringTextEl) ringTextEl.textContent = `${progressPercent}%`;
    
    if (svgFill) {
        const circumference = 2 * Math.PI * 66; // r=66 -> ~414.69
        svgFill.style.strokeDasharray = `${circumference}`;
        const offset = circumference - (progressPercent / 100) * circumference;
        svgFill.style.strokeDashoffset = `${offset}`;
    }

    if (summaryTextEl) {
        if (progressPercent >= 80) {
            summaryTextEl.textContent = "Outstanding Pace! You are crushing your goals 🚀";
        } else if (progressPercent >= 60) {
            summaryTextEl.textContent = "Great Progress! Keep up the good work 🎉";
        } else {
            summaryTextEl.textContent = "Let's schedule more study blocks this week 📚";
        }
    }
    
    // 3. Render Subject Progress bars
    const subjectProgressContainer = document.getElementById("subjectProgressContainer");
    if (subjectProgressContainer) {
        subjectProgressContainer.innerHTML = subjects.map(s => {
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
    
    // 4. Render KPIs
    const completedTasksCount = tasks.filter(t => t.status === "Completed").length;
    const pendingTasksCount = tasks.filter(t => t.status === "Pending").length;
    
    const kpiCompletedEl = document.getElementById("kpiCompleted");
    const kpiPendingEl = document.getElementById("kpiPending");
    const kpiHoursEl = document.getElementById("kpiHours");
    
    if (kpiCompletedEl) kpiCompletedEl.textContent = completedTasksCount;
    if (kpiPendingEl) kpiPendingEl.textContent = pendingTasksCount;
    if (kpiHoursEl) {
        const estHours = Math.round(completedTasksCount * 1.5 + pendingTasksCount * 0.5);
        kpiHoursEl.textContent = `${estHours} hrs`;
    }
    
    if (window.lucide) {
        window.lucide.createIcons();
    }
}
