// ==========================================
// BugWar Quiz Security
// - Forces full screen for the duration of the quiz
// - Auto-submits the quiz the moment a participant
//   switches tabs / minimizes / leaves the window
// ==========================================

let quizLocked = false; // becomes true once auto-submit has fired

// ------------------------------------------
// Full Screen Enforcement
// ------------------------------------------

function enterFullscreen() {

    if (!document.fullscreenElement) {

        document.documentElement.requestFullscreen().catch(() => {

            const grabOnInteraction = () => {

                enterFullscreen();

                document.removeEventListener("click", grabOnInteraction);
                document.removeEventListener("keydown", grabOnInteraction);

            };

            document.addEventListener("click", grabOnInteraction, { once: true });
            document.addEventListener("keydown", grabOnInteraction, { once: true });

        });

    }

}

window.addEventListener("load", () => {

    enterFullscreen();

});

document.addEventListener("fullscreenchange", () => {

    if (!document.fullscreenElement && !quizLocked) {

        alert("Please stay in Full Screen mode during the quiz.");

        enterFullscreen();

    }

});

// ------------------------------------------
// Block Dev Tools / View Source Shortcuts
// ------------------------------------------

document.addEventListener("keydown", (e) => {

    if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && (e.key === "U" || e.key === "u"))
    ) {

        e.preventDefault();

    }

});

// ------------------------------------------
// Auto-Submit On Tab Switch / Window Leave
// ------------------------------------------

function triggerAutoSubmit(reason) {

    const alreadySubmitted =
        (typeof submitted !== "undefined" && submitted) ||
        (typeof hasSubmitted !== "undefined" && hasSubmitted);

    if (quizLocked || alreadySubmitted) return;

    quizLocked = true;

    alert(
        "Security Violation: " + reason +
        "\n\nYour quiz is being submitted automatically."
    );

    if (typeof submitQuiz === "function") {

        submitQuiz();

    }

}

document.addEventListener("visibilitychange", () => {

    if (document.hidden) {

        triggerAutoSubmit("You switched tabs or minimized the window.");

    }

});