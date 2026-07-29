const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamcontroller");
const requireAdmin = require("../middleware/authmiddleware");

router.post("/register", teamController.registerTeam);
router.put("/start/:teamId", teamController.startQuiz);
router.put("/finish/:teamId", teamController.finishQuiz);

router.get("/", requireAdmin, teamController.getAllTeams);
router.get("/:teamId", requireAdmin, teamController.getTeamById);
router.put("/:teamId", requireAdmin, teamController.updateTeam);
router.delete("/:teamId", requireAdmin, teamController.deleteTeam);

module.exports = router;