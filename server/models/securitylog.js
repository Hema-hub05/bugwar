const mongoose = require("mongoose");

const securitySchema = new mongoose.Schema({
    team: String,
    event: String,
    time: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("SecurityLog", securitySchema);