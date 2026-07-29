// ===============================
// BugWar - Round 2 (Non-MCQ)
// Python Debugging Challenge
// ===============================

let questions = [];
let currentQuestion = 0;
let answers = {};
let hasSubmitted = false;

let totalTime = 15 * 60;
let timerInterval;

// ----------------------------
// Load Questions
// ----------------------------

async function loadQuestions() {

    try {

        const response = await fetch("/api/questions/round/2");
        const data = await response.json();

        questions = data.questions || data;

        if (!questions || questions.length === 0) {
            alert("No questions found.");
            return;
        }

        createPalette();
        showQuestion();
        startTimer();

    }

    catch (err) {

        console.error(err);
        alert("Unable to load questions.");

    }

}

// ----------------------------
// Timer
// ----------------------------

function startTimer() {

    timerInterval = setInterval(() => {

        let minutes = Math.floor(totalTime / 60);
        let seconds = totalTime % 60;

        document.getElementById("timer").innerText =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        totalTime--;

        if (totalTime < 0) {

            clearInterval(timerInterval);
            submitQuiz();

        }

    }, 1000);

}

// ----------------------------
// Palette
// ----------------------------

function createPalette() {

    const palette = document.getElementById("palette");
    palette.innerHTML = "";

    questions.forEach((q, index) => {

        const btn = document.createElement("button");

        btn.innerText = index + 1;

        btn.onclick = () => {

            saveCurrentAnswer();
            currentQuestion = index;
            showQuestion();

        };

        btn.id = "palette-" + index;

        palette.appendChild(btn);

    });

}

// ----------------------------
// Show Question
// ----------------------------

function showQuestion() {

    const q = questions[currentQuestion];

    document.getElementById("questionNo").innerText =
        `${currentQuestion + 1} / ${questions.length}`;

    document.getElementById("questionTitle").innerText =
        q.question;

    document.getElementById("codeBox").innerText =
        q.code || "";

    const box = document.getElementById("answerInput");

    box.value = answers[currentQuestion] || "";

    updatePalette();
    updateAnsweredCount();
    updateProgress();

}

// ----------------------------
// Progress
// ----------------------------

function updateProgress() {

    const percent =
        ((currentQuestion + 1) / questions.length) * 100;

    document.getElementById("progressFill").style.width =
        percent + "%";

}

// ----------------------------
// Save Current Answer
// ----------------------------

function saveCurrentAnswer() {

    answers[currentQuestion] =
        document.getElementById("answerInput").value.trim();

}
// ----------------------------
// Previous Button
// ----------------------------

document.getElementById("previousBtn").addEventListener("click", () => {

    saveCurrentAnswer();

    if (currentQuestion > 0) {

        currentQuestion--;
        showQuestion();

    }

});

// ----------------------------
// Next Button
// ----------------------------

document.getElementById("nextBtn").addEventListener("click", () => {

    saveCurrentAnswer();

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;
        showQuestion();

    }

});

// ----------------------------
// Update Palette
// ----------------------------

function updatePalette() {

    questions.forEach((q, index) => {

        const btn = document.getElementById("palette-" + index);

        btn.classList.remove("current");
        btn.classList.remove("answered");

        if (index === currentQuestion) {
            btn.classList.add("current");
        }

        if (answers[index] && answers[index].trim() !== "") {
            btn.classList.add("answered");
        }

    });

}

// ----------------------------
// Answer Count
// ----------------------------

function updateAnsweredCount() {

    let count = 0;

    Object.values(answers).forEach(ans => {

        if (ans && ans.trim() !== "") {
            count++;
        }

    });

    document.getElementById("answeredCount").innerText =
        `${count}/${questions.length}`;

}

// ----------------------------
// Submit Quiz
// ----------------------------

async function submitQuiz() {

    saveCurrentAnswer();

    clearInterval(timerInterval);

    const team =
        JSON.parse(localStorage.getItem("bugwarTeam")) || {};

    const payload = {

        teamName: team.teamName || "Unknown Team",

        round: 2,

        answers: questions.map((q, index) => ({

            questionId: q._id,
            answer: answers[index] || ""

        }))

    };

    try {

        const response = await fetch("/api/results/save", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(payload)

        });

        const result = await response.json();

        hasSubmitted = true;

        if (response.status === 409) {

            alert(result.message || "This round has already been submitted.");

            localStorage.setItem(
                "round2Result",
                JSON.stringify(result)
            );

            window.location.href = "round3.html";

            return;

        }

        if (!response.ok) {

            throw new Error(result.message || "Server Error");

        }

        localStorage.setItem(
            "round2Result",
            JSON.stringify(result)
        );

        // Go to Round 3
        window.location.href = "round3.html";

    }

    catch (err) {

        console.error(err);

        alert("Unable to submit quiz.");

    }

}

// ----------------------------
// Submit Button
// ----------------------------

document
.getElementById("submitBtn")
.addEventListener("click", submitQuiz);

// ----------------------------
// Auto Save
// ----------------------------

document
.getElementById("answerInput")
.addEventListener("input", () => {

    saveCurrentAnswer();
    updateAnsweredCount();
    updatePalette();

});

// ----------------------------
// Prevent Page Refresh
// ----------------------------

window.addEventListener("beforeunload", function (e) {

    if (hasSubmitted) return;

    e.preventDefault();
    e.returnValue = "";

});

// ----------------------------
// Disable Right Click
// ----------------------------

document.addEventListener("contextmenu", e => {

    e.preventDefault();

});


// ----------------------------
// Start Round
// ----------------------------

loadQuestions();