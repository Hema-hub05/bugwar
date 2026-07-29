const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({

    teamId: {
        type: String,
        required: true,
        unique: true
    },

    teamName: {
        type: String,
        required: true,
        trim: true
    },

    member1Name: {
        type: String,
        required: true,
        trim: true
    },

    member1Roll: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    member2Name: {
        type: String,
        required: true,
        trim: true
    },

    member2Roll: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    department: {
        type: String,
        required: true,
        trim: true
    },

    year: {
        type: String,
        required: true,
        trim: true
    },

    isPlayed: {
        type: Boolean,
        default: false
    },

    startTime: {
        type: Date,
        default: null
    },

    endTime: {
        type: Date,
        default: null
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Team", teamSchema);