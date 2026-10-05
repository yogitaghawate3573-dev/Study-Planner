function togglePassword(inputId, buttonEl) {
    const p = document.getElementById(inputId);
    if (!p) return;
    
    const isPass = p.type === 'password';
    p.type = isPass ? 'text' : 'password';
    
    const icon = buttonEl.querySelector('i');
    if (icon) {
        icon.setAttribute('data-lucide', isPass ? 'eye-off' : 'eye');
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
}

function handleRegister(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const studentId = form.studentId.value.trim();
    const email = form.email.value.trim();
    const course = form.course.value;
    const semester = form.semester.value;
    const pass = document.getElementById("reg_password")?.value;
    const confirmPass = document.getElementById("reg_confirm_password")?.value;

    if (pass !== confirmPass) {
        toast("Passwords do not match!", "error");
        return;
    }

    const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "YG";

    // Save to user profile
    const newUser = {
        name: name,
        studentId: studentId,
        email: email,
        course: course,
        semester: semester,
        phone: "+91 98765 43210",
        avatar: initials
    };

    saveUser(newUser);
    localStorage.setItem("sp_logged", "1");
    toast("Account created successfully! Welcome to Study Planner ✨", "success");
    
    setTimeout(() => {
        location.href = "dashboard.html";
    }, 800);
}
