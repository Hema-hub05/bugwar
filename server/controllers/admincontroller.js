const Team = require("../models/Team");
const Result = require("../models/result");
const Question = require("../models/question");
console.log("Loaded adminController");

exports.getDashboard = async (req, res) => {

    try {

        const totalTeams = await Team.countDocuments();

        const completedTeams = await Team.countDocuments({
            isPlayed: true
        });

        const playingTeams = await Team.countDocuments({
            startTime: { $ne: null },
            isPlayed: false
        });

        const totalQuestions = await Question.countDocuments();

        const results = await Result.find().lean();

        console.log("Results from DB:");
        console.log(results);

        let highestScore = 0;
        let averageScore = 0;

        if (results.length > 0) {

            const percentages = results.map(result => {
                const total = result.totalQuestions || 1;
                return (result.score / total) * 100;
            });

            averageScore = Math.round(
                percentages.reduce((sum, pct) => sum + pct, 0) / percentages.length
            );

        }

        results.forEach(result => {

            if (result.score > highestScore) {
                highestScore = result.score;
            }

        });

        res.json({
            totalTeams,
            playingTeams,
            completedTeams,
            totalQuestions,
            averageScore,
            highestScore
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }


};
exports.getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find().sort({ registeredAt: -1 });

        res.json({
            success: true,
            teams
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
exports.getTeam = async (req, res) => {
    try {

        const team = await Team.findOne({
            teamId: req.params.teamId
        });

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        }

        res.json({
            success: true,
            team
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};
exports.deleteTeam = async (req, res) => {

    try {

        const team = await Team.findOneAndDelete({
            teamId: req.params.teamId
        });

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        }

        res.json({
            success: true,
            message: "Team deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};
exports.getLeaderboard = async (req, res) => {

    try {

        const results = await Result.find().lean();
        const teams = await Team.find().lean();

        const leaderboard = {};

        // Build score data
        for (const result of results) {
            
             if (!result.teamName) continue;
            const teamName = result.teamName;

            if (!leaderboard[teamName]) {

                leaderboard[teamName] = {
                    teamName,
                    round1: 0,
                    round2: 0,
                    round3: 0,
                    total: 0,
                    timeTaken: 0
                };

            }

            if (result.round === 1)
                leaderboard[teamName].round1 = Math.max(leaderboard[teamName].round1, result.score);

            if (result.round === 2)
                leaderboard[teamName].round2 = Math.max(leaderboard[teamName].round2, result.score);

            if (result.round === 3)
                leaderboard[teamName].round3 = Math.max(leaderboard[teamName].round3, result.score);

        }

        // Add total score
        Object.values(leaderboard).forEach(team => {
            team.total = team.round1 + team.round2 + team.round3;
        });

        // Add time taken from Team collection
        teams.forEach(t => {

            const board = leaderboard[t.teamName];

            if (board && t.startTime && t.endTime) {

                board.timeTaken = t.endTime - t.startTime;

            }

        });

        // Sort by score, then time
        const finalLeaderboard = Object.values(leaderboard).sort((a, b) => {

            if (b.total !== a.total)
                return b.total - a.total;

            return a.timeTaken - b.timeTaken;

        });

        res.json({
            success: true,
            leaderboard: finalLeaderboard
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

