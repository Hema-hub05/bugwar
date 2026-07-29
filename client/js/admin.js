const adminToken = localStorage.getItem("adminToken");

if (!adminToken) {
    window.location.replace("admin-login.html");
}

async function adminFetch(url, options = {}) {
    const token = localStorage.getItem("adminToken");
    const headers = { ...(options.headers || {}), "Authorization": `Bearer ${token}` };
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.replace("admin-login.html");
        throw new Error("Session expired");
    }

    return response;
}

console.log("🚀 BugWar Admin Loaded");

// ==========================================
// DOM Ready
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    initializeNavigation();
    initializeButtons();
    showSection("dashboard");

});

// ==========================================
// Navigation
// ==========================================

function initializeNavigation() {

    document.querySelectorAll(".menu li[data-page]").forEach(item => {

        item.addEventListener("click", () => {

            showSection(item.dataset.page);

        });

    });

}

function showSection(section) {

    document.querySelectorAll(".page").forEach(page => {

        page.classList.remove("active");

    });

    const activePage = document.getElementById(section);

    if (activePage) {

        activePage.classList.add("active");

    }

    document.querySelectorAll(".menu li").forEach(item => {

        item.classList.remove("active");

    });

    document
        .querySelector(`.menu li[data-page="${section}"]`)
        ?.classList.add("active");

    const title = document.getElementById("pageTitle");

    if (title) {

        title.textContent =
            section.charAt(0).toUpperCase() + section.slice(1);

    }

    switch (section) {

        case "dashboard":
            loadDashboard();
            break;

        case "teams":
            loadTeams();
            break;

        case "questions":
            loadQuestions();
            break;

        case "results":
            loadResults();
            break;

        case "leaderboard":
            loadLeaderboard();
            break;

    }

}

// ==========================================
// Initialize Buttons
// ==========================================

function initializeButtons() {

    document
        .getElementById("addQuestionBtn")
        ?.addEventListener("click", openQuestionModal);

    document
        .getElementById("closeModal")
        ?.addEventListener("click", closeQuestionModal);

    document
        .getElementById("cancelBtn")
        ?.addEventListener("click", closeQuestionModal);

    document
        .getElementById("questionForm")
        ?.addEventListener("submit", function (e) {

            e.preventDefault();

            saveQuestion();

        });

    document
        .getElementById("logoutBtn")
        ?.addEventListener("click", logout);

}

// ==========================================
// Dashboard
// ==========================================

async function loadDashboard() {

    try {

        const response = await adminFetch("/api/admin/dashboard");

        const data = await response.json();

        document.getElementById("totalTeams").textContent =
            data.totalTeams ?? 0;

        document.getElementById("totalQuestions").textContent =
            data.totalQuestions ?? 0;

        document.getElementById("completedTeams").textContent =
            data.completedTeams ?? 0;

        document.getElementById("averageScore").textContent =
            (data.averageScore ?? 0) + "%";

    }

    catch (err) {

        console.error("Dashboard Error:", err);

        alert("Unable to load dashboard.");

    }

}

// ==========================================
// Teams
// ==========================================

async function loadTeams() {

    try {

        const response = await adminFetch("/api/admin/teams");

        const data = await response.json();

        const teams = data.teams || [];

        const table = document.getElementById("teamTableBody");

        table.innerHTML = "";

        teams.forEach(team => {

            let status = "Not Started";

            if (team.isPlayed) {

                status = "Completed";

            }

            else if (team.startTime) {

                status = "Playing";

            }

            table.innerHTML += `

    <tr>

        <td>${team.teamId}</td>

        <td>${team.teamName}</td>

        <td>${team.member1Name}</td>

        <td>${team.member2Name}</td>

        <td>${team.department}</td>

        <td>${team.year}</td>

        <td>${status}</td>

        <td></td>

    </tr>

`;

        });

    }

    catch (err) {

        console.error("Team Error:", err);

        alert("Unable to load teams.");

    }

}

// ==========================================
// Questions
// ==========================================

async function loadQuestions() {

    try {

        const response = await adminFetch("/api/questions");

        const data = await response.json();

        const questions = data.questions || [];

        const table = document.getElementById("questionTableBody");

        table.innerHTML = "";

        questions.forEach(question => {

            table.innerHTML += `

            <tr>

                <td>${question.round}</td>

                <td>${question.language}</td>

                <td>${question.question}</td>

                <td>${question.code}</td>

                <td>${question.answer}</td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="editQuestion('${question._id}')">

                        Edit

                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteQuestionById('${question._id}')">

                        Delete

                    </button>

                </td>

            </tr>

            `;

        });

    }

    catch (err) {

        console.error("Question Error:", err);

        alert("Unable to load questions.");

    }

}

// ==========================================
// Question Modal
// ==========================================

function openQuestionModal() {

    clearQuestionForm();

    document.getElementById("modalTitle").textContent =
        "Add Question";

    document.getElementById("questionModal").style.display =
        "flex";

}

function closeQuestionModal() {

    document.getElementById("questionModal").style.display =
        "none";

}

// ==========================================
// Clear Form
// ==========================================

function clearQuestionForm() {

    document.getElementById("questionId").value = "";

    document.getElementById("qRound").value = "";

    document.getElementById("qLanguage").value = "";

    document.getElementById("qQuestion").value = "";

    document.getElementById("qCode").value = "";

    document.getElementById("qAnswer").value = "";

    document.getElementById("qExplanation").value = "";

}

// ==========================================
// Save Question
// ==========================================

async function saveQuestion() {

    const id = document.getElementById("questionId").value;

    const question = {

        round: Number(document.getElementById("qRound").value),

        language: document.getElementById("qLanguage").value,

        question: document.getElementById("qQuestion").value,

        code: document.getElementById("qCode").value,

        answer: document.getElementById("qAnswer").value,

        explanation: document.getElementById("qExplanation").value

    };

    const url = id
        ? `/api/questions/${id}`
        : "/api/questions/add";

    const method = id ? "PUT" : "POST";

    try {

        const response = await adminFetch(url, {

            method,

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(question)

        });

        const result = await response.json();

        if (result.success) {

            alert(result.message);

            closeQuestionModal();

            loadQuestions();

            loadDashboard();

        }

        else {

            alert(result.message);

        }

    }

    catch (err) {

        console.error(err);

        alert("Unable to save question.");

    }

}

// ==========================================
// Edit Question
// ==========================================

async function editQuestion(id) {

    try {

        const response =
            await adminFetch(`/api/questions/${id}`);

        const question =
            await response.json();

        document.getElementById("modalTitle").textContent =
            "Edit Question";

        document.getElementById("questionId").value =
            question._id;

        document.getElementById("qRound").value =
            question.round;

        document.getElementById("qLanguage").value =
            question.language;


        document.getElementById("qQuestion").value =
            question.question;

        document.getElementById("qCode").value =
            question.code;

        document.getElementById("qAnswer").value =
            question.answer;

        document.getElementById("qExplanation").value =
            question.explanation || "";

        document.getElementById("questionModal").style.display =
            "flex";

    }

    catch (err) {

        console.error(err);

        alert("Unable to load question.");

    }

}

// ==========================================
// Delete Question
// ==========================================

async function deleteQuestionById(id) {

    if (!confirm("Delete this question?")) return;

    try {

        const response = await adminFetch(`/api/questions/${id}`, {

            method: "DELETE"

        });

        const result = await response.json();

        if (result.success) {

            alert(result.message);

            loadQuestions();

            loadDashboard();

        }

        else {

            alert(result.message);

        }

    }

    catch (err) {

        console.error(err);

        alert("Unable to delete question.");

    }

}

// ==========================================
// Results
// ==========================================

async function loadResults() {

    try {

        const response = await adminFetch("/api/results");

        const data = await response.json();

        const results = data.results || data;

        const table = document.getElementById("resultTableBody");

        table.innerHTML = "";

        results.forEach(result => {

            table.innerHTML += `

            <tr>

                <td>${result.teamName}</td>

                <td>${result.round}</td>

                <td>${result.score}</td>

                <td>${result.totalQuestions}</td>

                <td>${new Date(result.submittedAt).toLocaleString()}</td>

            </tr>

            `;

        });

    }

    catch (err) {

        console.error(err);

        alert("Unable to load results.");

    }

}

// ==========================================
// Leaderboard
// ==========================================

async function loadLeaderboard() {

    try {

        const response = await adminFetch("/api/admin/leaderboard");

        const data = await response.json();

        const leaderboard = data.leaderboard || [];

        const table = document.getElementById("leaderboardTableBody");

        table.innerHTML = "";

        leaderboard.forEach((team, index) => {

            table.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${team.teamName}</td>
                <td>${team.total}</td>
                <td>R1: ${team.round1} | R2: ${team.round2} | R3: ${team.round3}</td>
            </tr>
            `;

        });

    }

    catch (err) {

        console.error(err);

        alert("Unable to load leaderboard.");

    }

}

// ==========================================
// Logout
// ==========================================

function logout() {
    if (!confirm("Logout from BugWar Admin?")) return;
    localStorage.removeItem("adminToken");
    window.location.href = "admin-login.html";
}

// ==========================================
// Close Modal on Outside Click
// ==========================================

window.addEventListener("click", (event) => {

    const modal = document.getElementById("questionModal");

    if (event.target === modal) {

        closeQuestionModal();

    }

});

// ==========================================
// Escape Key
// ==========================================

window.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        closeQuestionModal();

    }

});

// ==========================================
// Refresh Active Section
// ==========================================

async function refreshDashboard() {

    await loadDashboard();

    if (document.getElementById("questions")?.classList.contains("active")) {

        await loadQuestions();

    }

    if (document.getElementById("teams")?.classList.contains("active")) {

        await loadTeams();

    }

    if (document.getElementById("results")?.classList.contains("active")) {

        await loadResults();

    }

    if (document.getElementById("leaderboard")?.classList.contains("active")) {

        await loadLeaderboard();

    }

}

console.log("✅ BugWar Admin Ready");
