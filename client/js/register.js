// =====================================
// BUGWAR REGISTER PAGE
// =====================================

const form = document.getElementById("registerForm");

const teamName = document.getElementById("teamName");

const member1 = document.getElementById("member1");

const member2 = document.getElementById("member2");

const roll1 = document.getElementById("roll1");

const roll2 = document.getElementById("roll2");

const department = document.getElementById("department");

const year = document.getElementById("year");

const agree = document.getElementById("agree");

const submitBtn = form.querySelector(".reg-submit");


// =====================================
// Register
// =====================================

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    // Empty validation

    if (teamName.value.trim() === "") {
        alert("Enter Team Name");
        return;
    }

    if (member1.value.trim() === "") {
        alert("Enter Member 1 Name");
        return;
    }

    if (member2.value.trim() === "") {
        alert("Enter Member 2 Name");
        return;
    }

    if (roll1.value.trim() === "") {
        alert("Enter Member 1 Roll Number");
        return;
    }

    if (roll2.value.trim() === "") {
        alert("Enter Member 2 Roll Number");
        return;
    }

    if (roll1.value === roll2.value) {
        alert("Roll Numbers cannot be same.");
        return;
    }

    if (department.value === "") {
        alert("Select Department");
        return;
    }

    if (year.value === "") {
        alert("Select Year");
        return;
    }

    if (!agree.checked) {
        alert("Accept BugWar Rules");
        return;
    }

    // Payload matching the server's expected field names
    const payload = {
        teamName: teamName.value.trim(),
        member1Name: member1.value.trim(),
        member1Roll: roll1.value.trim(),
        member2Name: member2.value.trim(),
        member2Roll: roll2.value.trim(),
        department: department.value,
        year: year.value
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Registering...";

    try {

        const response = await fetch("/api/teams/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(payload)

        });

        const result = await response.json();

        if (!result.success) {

            alert(result.message || "Registration failed. This team may already be registered.");

            submitBtn.disabled = false;
            submitBtn.textContent = "🚀 Register Team";

            return;

        }

        // Clear any leftover results from a PREVIOUS team's session on this
        // browser, so a new team never inherits stale Round 1/2/3 data.
        localStorage.removeItem("bugwarResult");
        localStorage.removeItem("round2Result");
        localStorage.removeItem("round3Result");

        // Save the REAL server-issued team info (not a client-side guess)
        const team = {
            teamId: result.teamId,
            teamName: payload.teamName
        };

        localStorage.setItem("bugwarTeam", JSON.stringify(team));

        alert(
            `Registration Successful!\n\nTeam Name: ${team.teamName}\nTeam ID: ${team.teamId}\n\nPlease note your Team ID for reference.`
        );

        window.location.href = "rules.html";

    }

    catch (err) {

        console.error(err);

        alert("Unable to reach the server. Please try again.");

        submitBtn.disabled = false;
        submitBtn.textContent = "🚀 Register Team";

    }

});
