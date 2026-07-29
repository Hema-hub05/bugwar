
// Question Data
let questions = [];
let currentQuestion = 0;
let answers = [];

// Safety net: clear any leftover Round 2/3 results from a previous
// session, since Round 1 is always the true start of a fresh attempt.
localStorage.removeItem("round2Result");
localStorage.removeItem("round3Result");

// Quiz Settings
let totalTime = 15 * 60; // 15 Minutes
let submitted = false;
let timerInterval = null;

// DOM Elements
const answerInput = document.getElementById("answerInput");
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");

// ==========================================
// Auto Save Answer
// ==========================================

answerInput.addEventListener("input", () => {

    if (!answers[currentQuestion]) return;

    answers[currentQuestion].answer = answerInput.value;

    updatePalette();

});

// ==========================================
// Load Questions
// ==========================================

async function loadQuestions() {

    try {

        const response = await fetch("/api/questions/round/1");

        if (!response.ok) {
            throw new Error("Unable to fetch questions.");
        }

        questions = await response.json();

        if (!questions.length) {
            alert("No questions found.");
            return;
        }

        answers = questions.map(q => ({
            questionId: q._id,
            answer: ""
        }));

        createPalette();

        showQuestion();

        startTimer();

    }
    catch (err) {

        console.error(err);

        alert("Failed to load questions.");

    }

}

// Start Quiz
loadQuestions();

// ==========================================
// Timer
// ==========================================

// ==========================================
// Timer
// ==========================================

function startTimer() {

    const timer = document.getElementById("timer");

    timerInterval = setInterval(() => {

        let minutes = Math.floor(totalTime / 60);
        let seconds = totalTime % 60;

        timer.textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        // Timer Color
        if (totalTime > 600) {

            timer.style.color = "#00ff99";   // Green

        }
        else if (totalTime > 300) {

            timer.style.color = "#ff9800";   // Orange

        }
        else {

            timer.style.color = "#ff3b30";   // Red

        }

        if (totalTime <= 0) {

            clearInterval(timerInterval);

            alert(
"Time is over.\n\nYour answers will now be submitted automatically."
);

            submitQuiz();

            return;

        }

        totalTime--;

    }, 1000);

}
// ==========================================
// Show Current Question
// ==========================================

function showQuestion() {

    const q = questions[currentQuestion];

    if (!q) return;

    // Question Number
    document.getElementById("questionNo").textContent =
        `Question ${currentQuestion + 1} / ${questions.length}`;

    // Question Title
    document.getElementById("questionTitle").textContent =
        q.question;
    document.title =
`BugWar | Question ${currentQuestion + 1}`;

    // Question Type
    document.getElementById("questionType").textContent =
        (q.type || "output").toUpperCase();

    // Code
    const codeBox = document.getElementById("codeBox");
    const lineNumbers = document.getElementById("lineNumbers");

    codeBox.textContent = q.code || "";

    // Line Numbers
    const totalLines = (q.code || "").split("\n").length;

    let nums = "";

    for (let i = 1; i <= totalLines; i++) {

        nums += i + "<br>";

    }

    lineNumbers.innerHTML = nums;

    // Restore Previous Answer
    answerInput.value =
        answers[currentQuestion].answer || "";

    // Placeholder
    switch (q.type) {

        case "bug":

            answerInput.placeholder =
                "Type the corrected code here...";

            break;

        case "output":

            answerInput.placeholder =
                "Type the expected output...";

            break;

        case "fill":

            answerInput.placeholder =
                "Fill the missing line...";

            break;

        case "syntax":

            answerInput.placeholder =
                "Correct the syntax error...";

            break;

        case "logic":

            answerInput.placeholder =
                "Correct the logic...";

            break;

        default:

            answerInput.placeholder =
                "Type your answer...";

    }

    previousBtn.disabled =
        currentQuestion === 0;

    nextBtn.disabled =
        currentQuestion === questions.length - 1;

    updatePalette();

}

// ==========================================
// Create Question Palette
// ==========================================

function createPalette() {

    const palette =
        document.getElementById("palette");

    palette.innerHTML = "";

    questions.forEach((q, index) => {

        const btn =
            document.createElement("button");

        btn.textContent = index + 1;

        btn.className =
            "palette-btn palette-unanswered";

        btn.onclick = () => {

            currentQuestion = index;

            showQuestion();

        };

        palette.appendChild(btn);

    });

}

// ==========================================
// Update Palette
// ==========================================

function updatePalette() {

    const buttons =
        document.querySelectorAll("#palette button");

    buttons.forEach((btn, index) => {

        btn.className = "palette-btn";

        if (index === currentQuestion) {

            btn.classList.add("palette-current");

        }
        else if (
            answers[index] &&
            answers[index].answer.trim() !== ""
        ) {

            btn.classList.add("palette-answered");

        }
        else {

            btn.classList.add("palette-unanswered");

        }

    });
    // Update Progress

const answered = answers.filter(a => a.answer.trim() !== "").length;

const remaining = questions.length - answered;

document.getElementById("answeredCount").textContent = answered;

document.getElementById("remainingCount").textContent = remaining;

const progress =
    questions.length > 0
        ? (answered / questions.length) * 100
        : 0;

document.getElementById("progressFill").style.width =
    progress + "%";

}

// ==========================================
// Navigation Buttons
// ==========================================

previousBtn.addEventListener("click", () => {

    if (currentQuestion > 0) {

        currentQuestion--;

        showQuestion();

    }

});

nextBtn.addEventListener("click", () => {

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        showQuestion();

    }

});

// ==========================================
// Submit Button
// ==========================================

submitBtn.addEventListener("click", openReviewModal);



function openReviewModal(){

    const answered =
    answers.filter(a=>a.answer.trim()!=="").length;

    const remaining =
    questions.length-answered;

    document.getElementById("reviewAnswered").textContent =
    answered;

    document.getElementById("reviewRemaining").textContent =
    remaining;

    const list =
    document.getElementById("reviewList");

    list.innerHTML="";

    answers.forEach((a,index)=>{

        if(!a.answer.trim()){

            const btn=document.createElement("button");

            btn.className="review-question";

            btn.innerHTML = `<strong>${index + 1}</strong>`;

            btn.onclick=()=>{

                currentQuestion=index;

                showQuestion();

                closeReviewModal();

            };

            list.appendChild(btn);

        }

    });

    document.getElementById("reviewModal").style.display="flex";

}

function closeReviewModal(){

    document.getElementById("reviewModal").style.display="none";

}


// ==========================================
// Submit Quiz
// ==========================================

async function submitQuiz() {

    if (submitted) return;

    submitted = true;

    document.getElementById("reviewModal").style.display = "none";

    submitBtn.disabled = true;

    previousBtn.disabled = true;
nextBtn.disabled = true;
answerInput.disabled = true;

    submitBtn.textContent = "Submitting...";

    clearInterval(timerInterval);

    try {

        const team = JSON.parse(
            localStorage.getItem("bugwarTeam")
        );

        if (!team) {

            throw new Error("Team details not found.");

        }

        const payload = {

            teamName: team.teamName,

            round: 1,

            answers: answers

        };

        const response = await fetch("/api/results/save", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(payload)

        });

        const result = await response.json();

        // Exit fullscreen before navigating away, otherwise the browser
        // shows a "Leave site?" warning when leaving a fullscreen page.
        if (document.fullscreenElement) {
            try { await document.exitFullscreen(); } catch (e) {}
        }

        window.onbeforeunload = null;

        if (response.status === 409) {

            alert(result.message || "This round has already been submitted.");

            localStorage.setItem(
                "bugwarResult",
                JSON.stringify(result)
            );

            window.location.href = "result.html";

            return;

        }

        if (!response.ok) {

            throw new Error(result.message || "Server Error");

        }

        localStorage.setItem(
            "bugwarResult",
            JSON.stringify(result)
        );

        alert("Quiz Submitted Successfully!");

        window.location.href = "result.html";

    }

    catch (error) {

        console.error(error);

        submitted = false;

        submitBtn.disabled = false;

        submitBtn.textContent = "Submit";

        alert("Submission Failed. Please try again.");

    }

}

document
.getElementById("cancelSubmit")
.addEventListener("click",closeReviewModal);

document
.getElementById("confirmSubmit")
.addEventListener("click",()=>{

    closeReviewModal();

    submitQuiz();

});

