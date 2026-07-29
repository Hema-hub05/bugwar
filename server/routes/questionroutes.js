const express = require("express");
const router = express.Router();
const requireAdmin = require("../middleware/authmiddleware");

const {
    addQuestion, getQuestions, getAllQuestions,
    getQuestionById, updateQuestion, deleteQuestion
} = require("../controllers/questionController");

// Student route (public)
router.get("/round/:round", getQuestions);

// Admin routes (protected)
router.get("/", requireAdmin, getAllQuestions);
router.get("/:id", requireAdmin, getQuestionById);
router.post("/add", requireAdmin, addQuestion);
router.put("/:id", requireAdmin, updateQuestion);
router.delete("/:id", requireAdmin, deleteQuestion);

module.exports = router;