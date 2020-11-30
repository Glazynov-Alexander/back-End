const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const task = new Schema({
    taskChecked: {type:Boolean, required: true},
    textTask: {type:String, required: true},
    symbol: {type:String, required: true},
}, { versionKey: false });

let tasks = mongoose.model("Tasks", task);

module.exports = { Tasks: tasks};