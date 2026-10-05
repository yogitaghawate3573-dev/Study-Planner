function togglePassword(inputId, buttonEl) {
    const p = document.getElementById(inputId);
    if (!p) return;
    
    const isPass = p.type === 'password';
    p.type = isPass ? 'text' : 'password';
    
    // Toggle the Lucide icon inside the button
    const icon = buttonEl.querySelector('i');
    if (icon) {
        icon.setAttribute('data-lucide', isPass ? 'eye-off' : 'eye');
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    seed();
    
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const userInput = (document.getElementById("loginUser")?.value || "").trim().toLowerCase();
            const passInput = (document.getElementById("password")?.value || "").trim();
            
            const storedUser = getUser();
            
            // Accepted Static Credentials:
            // 1. Static defaults: yogita@gmail.com / stu20240041 / admin
            // 2. Any dynamically registered user in storedUser
            const validUsernames = [
                "yogita@gmail.com",
                "stu20240041",
                "admin",
                "yogita",
                (storedUser.email || "").toLowerCase(),
                (storedUser.studentId || "").toLowerCase(),
                (storedUser.name || "").toLowerCase()
            ].filter(Boolean);

            const validPasswords = [
                "student123",
                "admin123",
                "admin",
                storedUser.password || "student123"
            ];
            
            const isValid = validUsernames.includes(userInput) && validPasswords.includes(passInput);
            const card = document.querySelector(".auth-card");
            
            if (isValid) {
                const displayName = storedUser.name ? storedUser.name.split(" ")[0] : "Student";
                
                // Show attractive Top-Right Success Toast
                toast(
                    `Welcome back, ${displayName}! Loading your workspace...`,
                    "success",
                    "Login Successful"
                );
                
                localStorage.setItem("sp_logged", "1");
                
                setTimeout(() => {
                    location.href = "dashboard.html";
                }, 900);
            } else {
                // Show attractive Top-Right Error Toast
                toast(
                    "Invalid email/student ID or password. Use demo: yogita@gmail.com / student123",
                    "error",
                    "Login Failed"
                );
                
                if (card) {
                    card.classList.remove("shake");
                    void card.offsetWidth; // trigger reflow for animation
                    card.classList.add("shake");
                }
                
                const passField = document.getElementById("password");
                if (passField) {
                    passField.focus();
                    passField.select();
                }
            }
        });
    }
});
