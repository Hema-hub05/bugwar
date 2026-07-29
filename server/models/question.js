const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({

    round:{
        type:Number,
        required:true
    },

    language:{
        type:String,
        required:true
    },

    type:{
        type:String,
        enum:["bug","output"],
        default:"output"
    },

    question:{
        type:String,
        required:true
    },

    code:{
        type:String,
        default:""
    },

    answer:{
        type:String,
        required:true
    },

    explanation:{
        type:String,
        default:""
    }

},{
    timestamps:true
});

module.exports = mongoose.model("Question",questionSchema);