async function loadLeaderboard() {

    try {

        const response = await fetch("/api/admin/leaderboard");
        const data = await response.json();

        const tbody = document.querySelector("#leaderboardTable tbody");
        tbody.innerHTML = "";

        data.leaderboard.forEach((team, index) => {

            const minutes = Math.floor(team.timeTaken / 60000);
            const seconds = Math.floor((team.timeTaken % 60000) / 1000);

            tbody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${team.teamName}</td>
                    <td>${team.round1}</td>
                    <td>${team.round2}</td>
                    <td>${team.round3}</td>
                    <td><b>${team.total}</b></td>
                    <td>${minutes}m ${seconds}s</td>
                </tr>
            `;

        });

    } catch (err) {

        console.error("Leaderboard Error:", err);

    }

}

loadLeaderboard();