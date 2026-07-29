
const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({

    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true
    },

    answer: {
        type: String,
        default: ""
    },

    isCorrect: {
        type: Boolean,
        default: false
    }

});

const resultSchema = new mongoose.Schema({

    teamName: {
        type: String,
        required: true
    },

    round: {
        type: Number,
        required: true
    },

    score: {
        type: Number,
        default: 0
    },

    totalQuestions: {
        type: Number,
        default: 10
    },

    answers: [answerSchema],

    submittedAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Result", resultSchema);