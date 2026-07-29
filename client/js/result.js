// =====================================================
// BUGWAR RESULT PAGE
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const team = JSON.parse(localStorage.getItem("bugwarTeam") || "null");

    document.getElementById("teamName").textContent =
        team ? `${team.teamName} (${team.teamId})` : "Team not found";

    const bugwarResult  = JSON.parse(localStorage.getItem("bugwarResult")  || "null"); // Round 1
    const round2Result  = JSON.parse(localStorage.getItem("round2Result") || "null"); // Round 2
    const round3Result  = JSON.parse(localStorage.getItem("round3Result") || "null"); // Round 3

    const scoreEl      = document.getElementById("score");
    const statusEl     = document.getElementById("status");
    const nextBtn      = document.getElementById("nextRoundBtn");
    const homeBtn      = document.getElementById("homeBtn");
    const breakdownEl  = document.getElementById("roundBreakdown");

    function renderRow(label, result) {

        if (!result) return "";

        const pct = Math.round((result.score / result.totalQuestions) * 100);

        return `
            <div class="round-breakdown-row">
                <span class="rb-label">${label}</span>
                <span>
                    <span class="rb-score">${result.score} / ${result.totalQuestions}</span>
                    <span class="rb-status ${result.qualified ? "status-pass" : "status-fail"}">
                        ${result.qualified ? "✅ Passed" : "❌ Not Qualified"}
                    </span>
                </span>
            </div>
        `;

    }

    // ============================================
    // CASE 1: Round 3 is done — show the FULL overall summary
    // ============================================
    if (round3Result) {

        scoreEl.textContent = `Round 3: ${round3Result.score} / ${round3Result.totalQuestions}`;

        if (round3Result.qualified) {
            statusEl.textContent = "🎉 Competition Complete!";
            statusEl.className = "status-pass";
        } else {
            statusEl.textContent = "❌ Not Qualified";
            statusEl.className = "status-fail";
        }

        breakdownEl.style.display = "block";
        breakdownEl.innerHTML =
            renderRow("Round 1", bugwarResult) +
            renderRow("Round 2", round2Result) +
            renderRow("Round 3", round3Result) +
            `<div class="overall-verdict">🙏 Thank you for participating in BugWar!</div>`;

        // No "next round" button — this is the final round
        nextBtn.style.display = "none";

        homeBtn.textContent = "Finish";

    }

    // ============================================
    // CASE 2: Round 2 is done, Round 3 not yet — show Round 2 alone
    // ============================================
    else if (round2Result) {

        scoreEl.textContent = `Round 2: ${round2Result.score} / ${round2Result.totalQuestions}`;

        if (round2Result.qualified) {

            statusEl.textContent = "✅ Qualified for next round";
            statusEl.className = "status-pass";

            nextBtn.style.display = "block";
            nextBtn.textContent = "Proceed to Round 3";
            nextBtn.addEventListener("click", () => {
                window.location.href = "round3.html";
            });

        } else {

            statusEl.textContent = "❌ Not Qualified";
            statusEl.className = "status-fail";

        }

    }

    // ============================================
    // CASE 3: Only Round 1 is done — show Round 1 alone
    // ============================================
    else if (bugwarResult) {

        scoreEl.textContent = `Round 1: ${bugwarResult.score} / ${bugwarResult.totalQuestions}`;

        if (bugwarResult.qualified) {

            statusEl.textContent = "✅ Qualified for next round";
            statusEl.className = "status-pass";

            nextBtn.style.display = "block";
            nextBtn.textContent = "Proceed to Round 2";
            nextBtn.addEventListener("click", () => {
                window.location.href = "round2.html";
            });

        } else {

            statusEl.textContent = "❌ Not Qualified";
            statusEl.className = "status-fail";

        }

    }

    // ============================================
    // CASE 4: No result found at all
    // ============================================
    else {

        scoreEl.textContent = "No result found";
        statusEl.textContent = "";

    }

    homeBtn.addEventListener("click", () => {

        // Fully clear this browser's session so the next team
        // (even on the same device) starts with a clean slate.
        localStorage.removeItem("bugwarTeam");
        localStorage.removeItem("bugwarResult");
        localStorage.removeItem("round2Result");
        localStorage.removeItem("round3Result");

        window.location.href = "index.html";
    });

});
