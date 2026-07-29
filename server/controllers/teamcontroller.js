const Team = require("../models/Team");
console.log(__filename);

exports.registerTeam = async (req, res) => {
    try {

        const {
            teamName,
            member1Name,
            member1Roll,
            member2Name,
            member2Roll,
            department,
            year
        } = req.body;

        // Check duplicate roll numbers OR duplicate team name
        const existing = await Team.findOne({
            $or: [
                { member1Roll },
                { member2Roll },
                { teamName: { $regex: `^${teamName}$`, $options: "i" } }
            ]
        });

        if (existing) {
            return res.json({
                success: false,
                message: "This team is already registered."
            });
        }

        let savedTeam;

        while (true) {

            const lastTeam = await Team.findOne().sort({ teamId: -1 });

            let teamId = "TEAM001";

            if (lastTeam) {
                const lastNumber = parseInt(lastTeam.teamId.replace("TEAM", ""), 10);
                teamId = "TEAM" + String(lastNumber + 1).padStart(3, "0");
            }

            try {

                savedTeam = await new Team({
                    teamId,
                    teamName,
                    member1Name,
                    member1Roll,
                    member2Name,
                    member2Roll,
                    department,
                    year,
                    isPlayed: false,
                    startTime: null,
                    endTime: null
                }).save();

                break;

            } catch (err) {

                if (err.code === 11000 && err.keyPattern?.teamId) {
                    continue;
                }

                throw err;
            }
        }

        res.json({
            success: true,
            message: "Registration Successful",
            teamId: savedTeam.teamId
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

exports.startQuiz = async (req, res) => {

    try {

        const { teamId } = req.params;

        const team = await Team.findOne({ teamId });

        if (!team) {

            return res.status(404).json({
                success: false,
                message: "Team not found"
            });

        }

        // Save start time only once
        if (!team.startTime) {
            team.startTime = new Date();
            await team.save();
        }

        res.json({

            success: true,

            message: "Quiz started.",

            startTime: team.startTime

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.finishQuiz = async (req, res) => {

    try {

        const { teamId } = req.params;

        const team = await Team.findOne({ teamId });

        if (!team) {

            return res.status(404).json({
                success: false,
                message: "Team not found"
            });

        }

        // Save end time only once
        if (!team.endTime) {
            team.endTime = new Date();
        }

        team.isPlayed = true;

        await team.save();

        // Calculate total time
        let timeTaken = 0;

        if (team.startTime && team.endTime) {
            timeTaken = team.endTime - team.startTime;
        }

        res.json({

            success: true,
            message: "Quiz completed.",

            endTime: team.endTime,

            timeTaken

        });

    } catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};
// Get All Teams
exports.getAllTeams = async (req, res) => {

    try {

        const teams = await Team.find().sort({ teamId: 1 });

        res.json(teams);

    }

    catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Get Team By ID
exports.getTeamById = async (req, res) => {

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

        res.json(team);

    }

    catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Update Team
exports.updateTeam = async (req, res) => {

    try {

        const team = await Team.findOneAndUpdate(

            { teamId: req.params.teamId },

            req.body,

            { new: true }

        );

        res.json({

            success: true,

            team

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// Delete Team
exports.deleteTeam = async (req, res) => {

    try {

        await Team.findOneAndDelete({

            teamId: req.params.teamId

        });

        res.json({

            success: true,

            message: "Team deleted successfully"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
console.log("Exports:", Object.keys(exports));