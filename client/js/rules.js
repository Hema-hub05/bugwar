// =====================================
// BUGWAR RULES PAGE
// =====================================

const agreeCheckbox = document.getElementById("agreeRules");
const startButton = document.getElementById("startBtn");

// Disable button initially
startButton.disabled = true;

// Enable/Disable Start button
agreeCheckbox.addEventListener("change", () => {

    startButton.disabled = !agreeCheckbox.checked;

});

// Start Quiz
startButton.addEventListener("click", () => {

    if (!agreeCheckbox.checked) {

        alert("Please accept the BugWar rules before continuing.");
        return;

    }

    // Save acceptance status
    localStorage.setItem("bugwarRulesAccepted", "true");

    // Optional loading effect
    startButton.innerHTML = "Starting Round 1...";
    startButton.disabled = true;

    setTimeout(() => {

        window.location.href = "quiz.html";

    }, 1000);

});