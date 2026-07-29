const Question = require("../models/question");

// ======================================================
// Add Question
// ======================================================

exports.addQuestion = async (req, res) => {

    try {

        const question = new Question({

            round: req.body.round,

            language: req.body.language,

            type: req.body.type,

            question: req.body.question,

            code: req.body.code,

            answer: req.body.answer,

            explanation: req.body.explanation

        });

        await question.save();

        res.status(201).json({

            success: true,

            message: "Question added successfully",

            question

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// ======================================================
// Student - Get Random Questions By Round
// ======================================================
exports.getQuestions = async (req, res) => {

    try {

        const round = Number(req.params.round);

        const questions = await Question.aggregate([
            { $match: { round: round } },
            { $sample: { size: 10 } }
        ]);

        console.log(`getQuestions: round=${round} -> found ${questions.length} question(s)`);

        res.json(questions);

    }

    catch (err) {

        console.error("getQuestions error:", err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};


// ======================================================
// Admin - Get All Questions
// ======================================================

exports.getAllQuestions = async (req, res) => {

    try {

        const questions = await Question.find()

        .sort({

            round: 1,

            createdAt: 1

        });

        res.json({

            success: true,

            questions

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// ======================================================
// Get Question By ID
// ======================================================

exports.getQuestionById = async (req, res) => {

    try {

        const question = await Question.findById(req.params.id);

        if (!question) {

            return res.status(404).json({

                success: false,

                message: "Question not found"

            });

        }

        res.json(question);

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// ======================================================
// Update Question
// ======================================================

exports.updateQuestion = async (req, res) => {

    try {

        const question = await Question.findByIdAndUpdate(

            req.params.id,

            req.body,

            {

                new: true,

                runValidators: true

            }

        );

        if (!question) {

            return res.status(404).json({

                success: false,

                message: "Question not found"

            });

        }

        res.json({

            success: true,

            message: "Question updated successfully",

            question

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// ======================================================
// Delete Question
// ======================================================

exports.deleteQuestion = async (req, res) => {

    try {

        const question = await Question.findByIdAndDelete(req.params.id);

        if (!question) {

            return res.status(404).json({

                success: false,

                message: "Question not found"

            });

        }

        res.json({

            success: true,

            message: "Question deleted successfully"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};