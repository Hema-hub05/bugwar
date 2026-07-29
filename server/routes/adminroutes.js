const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admincontroller");
const requireAdmin = require("../middleware/authmiddleware");

router.use(requireAdmin);

router.get("/dashboard", adminController.getDashboard);
router.get("/teams", adminController.getAllTeams);
router.get("/team/:teamId", adminController.getTeam);
router.delete("/team/:teamId", adminController.deleteTeam);
router.get("/leaderboard", adminController.getLeaderboard);

module.exports = router;