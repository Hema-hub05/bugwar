const express = require("express");
const router = express.Router();
const resultController = require("../controllers/resultController");
const requireAdmin = require("../middleware/authmiddleware");

router.post("/save", resultController.saveResult);
router.get("/", requireAdmin, resultController.getResults);

module.exports = router;