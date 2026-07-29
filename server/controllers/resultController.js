const Result = require("../models/result");
const Question = require("../models/question");

// ===============================================
// Normalize a typed/expected answer before comparing.
// Fixes false "incorrect" results caused by:
//  - extra/leading/trailing spaces
//  - multiple spaces or line breaks
//  - inconsistent capitalization
//  - "smart quotes" from copy-paste (’ ‘ “ ”)
//  - spacing around code operators/punctuation
//    (e.g. "if(num==10)" vs "if(num == 10)",
//     "scanf("%s",name)" vs "scanf("%s", name)")
// Note: spacing BETWEEN plain words/numbers is preserved,
// so an output like "2 2" still requires that space.
// ===============================================
function normalizeAnswer(str) {

    return (str || "")
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[\u2018\u2019]/g, "'")     // smart single quotes -> straight
        .replace(/[\u201C\u201D]/g, '"')     // smart double quotes -> straight
        .replace(/\s+/g, " ")                // collapse all whitespace/newlines to a single space
        .replace(/\s*([=<>!+\-*/%&|^~(){}\[\],;:.])\s*/g, "$1")  // ignore spacing around code operators/punctuation
        .trim();

}

exports.saveResult = async (req, res) => {

    try {

        const { teamName, round, answers } = req.body;

        // Block resubmission: a team can only submit a given round once
        const alreadySubmitted = await Result.findOne({ teamName, round });

        if (alreadySubmitted) {

            return res.status(409).json({

                success: false,

                message: "This round has already been submitted for your team. Resubmission is not allowed.",

                score: alreadySubmitted.score,

                totalQuestions: alreadySubmitted.totalQuestions,

                qualified: (alreadySubmitted.score / alreadySubmitted.totalQuestions) >= 0.7

            });

        }

        if (!Array.isArray(answers) || answers.length === 0) {

            return res.status(400).json({
                success: false,
                message: "No answers were submitted."
            });

        }

        // Fetch only the exact questions the student was actually given,
        // matched by their real _id — not by array position.
        const questionIds = answers.map(a => a.questionId);

        const questions = await Question.find({
            _id: { $in: questionIds }
        });

        const questionMap = {};

        questions.forEach(q => {
            questionMap[q._id.toString()] = q;
        });

        let score = 0;

        const detailedAnswers = answers.map(a => {

            const question = questionMap[a.questionId];

            const given = normalizeAnswer(a.answer);
            const correct = normalizeAnswer(question ? question.answer : "");

            const isCorrect = Boolean(given) && given === correct;

            if (isCorrect) {
                score++;
            }

            return {
                questionId: a.questionId,
                answer: a.answer || "",
                isCorrect
            };

        });

        const totalQuestions = answers.length;

        const qualified = (score / totalQuestions) >= 0.7;

        const result = new Result({

            teamName,

            round,

            score,

            totalQuestions,

            answers: detailedAnswers

        });

        await result.save();

        res.json({

            success: true,

            score,

            totalQuestions,

            qualified

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getResults = async (req, res) => {

    const results = await Result.find().sort({

        score: -1

    });

    res.json(results);

};

