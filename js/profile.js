// Profile & Password Page Logic

document.addEventListener("DOMContentLoaded", () => {
    seed();
    loadProfileData();
});

function loadProfileData() {
    const user = getUser();
    const tasks = data("sp_tasks", T);
    const completedTasksCount = tasks.filter(t => t.status === "Completed").length;

    // Display elements
    const avatarPic = document.getElementById("profileAvatarPic");
    const nameDisplay = document.getElementById("profileNameDisplay");
    const courseDisplay = document.getElementById("profileCourseDisplay");
    const completedTasksEl = document.getElementById("profileCompletedTasks");

    const detailName = document.getElementById("detailFullName");
    const detailEmail = document.getElementById("detailEmail");
    const detailStudentId = document.getElementById("detailStudentId");
    const detailCourse = document.getElementById("detailCourse");
    const detailSemester = document.getElementById("detailSemester");
    const detailPhone = document.getElementById("detailPhone");

    const initials = user.avatar || user.name.slice(0, 2).toUpperCase();

    if (avatarPic) avatarPic.textContent = initials;
    if (nameDisplay) nameDisplay.textContent = user.name;
    if (courseDisplay) courseDisplay.textContent = `${user.course} • ${user.semester}`;
    if (completedTasksEl) completedTasksEl.textContent = `${completedTasksCount} Tasks`;

    if (detailName) detailName.textContent = user.name;
    if (detailEmail) detailEmail.textContent = user.email;
    if (detailStudentId) detailStudentId.textContent = user.studentId;
    if (detailCourse) detailCourse.textContent = user.course;
    if (detailSemester) detailSemester.textContent = user.semester;
    if (detailPhone) detailPhone.textContent = user.phone;

    // Pre-populate modal inputs
    const editName = document.getElementById("editName");
    const editStudentId = document.getElementById("editStudentId");
    const editEmail = document.getElementById("editEmail");
    const editCourse = document.getElementById("editCourse");
    const editSemester = document.getElementById("editSemester");
    const editPhone = document.getElementById("editPhone");

    if (editName) editName.value = user.name;
    if (editStudentId) editStudentId.value = user.studentId;
    if (editEmail) editEmail.value = user.email;
    if (editCourse) editCourse.value = user.course;
    if (editSemester) editSemester.value = user.semester;
    if (editPhone) editPhone.value = user.phone;
}

function handleSaveProfile(e) {
    e.preventDefault();
    const form = e.target;
    
    const name = form.name.value.trim();
    const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "YG";

    const updatedUser = {
        name: name,
        studentId: form.studentId.value.trim(),
        email: form.email.value.trim(),
        course: form.course.value,
        semester: form.semester.value,
        phone: form.phone.value.trim() || "+91 98765 43210",
        avatar: initials
    };

    saveUser(updatedUser);
    closeModal("editProfileModal");
    loadProfileData();
    syncTopBar();
    enhanceSidebar();
    toast("Student profile updated successfully!", "success");
}

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

function handleUpdatePassword(e) {
    e.preventDefault();
    const form = e.target;
    const currentPass = form.currentPass.value;
    const newPass = form.newPass.value;
    const confirmPass = form.confirmPass.value;

    if (newPass.length < 6) {
        toast("New password must be at least 6 characters long!", "error");
        return;
    }

    if (newPass !== confirmPass) {
        toast("New passwords do not match!", "error");
        return;
    }

    toast("Password updated successfully!", "success");
    setTimeout(() => {
        location.href = "profile.html";
    }, 1000);
}
