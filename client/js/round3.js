// ===============================
// BugWar - Round 3
// Final Programming Challenge
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

        const response = await fetch("/api/questions/round/3");
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
// Question Palette
// ----------------------------

function createPalette() {

    const palette = document.getElementById("palette");
    palette.innerHTML = "";

    questions.forEach((q, index) => {

        const btn = document.createElement("button");

        btn.innerText = index + 1;

        btn.id = "palette-" + index;

        btn.onclick = () => {

            saveCurrentAnswer();
            currentQuestion = index;
            showQuestion();

        };

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

    document.getElementById("answerInput").value =
        answers[currentQuestion] || "";

    updateProgress();
    updatePalette();
    updateAnsweredCount();

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
// Save Answer
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
// Answer Counter
// ----------------------------

function updateAnsweredCount() {

    let count = 0;

    Object.values(answers).forEach(answer => {

        if (answer && answer.trim() !== "") {
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

        round: 3,

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

        }

        else if (!response.ok) {

            throw new Error(result.message || "Server Error");

        }

        localStorage.setItem(
            "round3Result",
            JSON.stringify(result)
        );

        // Final Result Page
        window.location.href = "result.html";

    }
    catch (err) {

        console.error(err);
        alert("Unable to submit Round 3.");

    }

}

// ----------------------------
// Submit Button
// ----------------------------

document.getElementById("submitBtn")
.addEventListener("click", submitQuiz);

// ----------------------------
// Auto Save
// ----------------------------

document.getElementById("answerInput")
.addEventListener("input", () => {

    saveCurrentAnswer();
    updateAnsweredCount();
    updatePalette();

});

// ----------------------------
// Prevent Refresh
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
// Start Quiz
// ----------------------------

loadQuestions(2);