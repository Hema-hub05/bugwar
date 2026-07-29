if (localStorage.getItem("adminToken")) {
    window.location.replace("admin.html");
}

const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();
    loginError.textContent = "";
    loginBtn.disabled = true;
    loginBtn.textContent = "Signing in...";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    try {

        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            loginError.textContent = data.message || "Invalid username or password.";
            loginBtn.disabled = false;
            loginBtn.textContent = "Login";
            return;
        }

        localStorage.setItem("adminToken", data.token);
        window.location.replace("admin.html");

    }

    catch (err) {
        console.error("Login error:", err);
        loginError.textContent = "Unable to reach the server. Please try again.";
        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
    }

});