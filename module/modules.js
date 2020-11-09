const  exprees = require('express')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const base = new Schema({
    // email: {type:String, required: true},
    name: {type:String, required: true}
})
// {"idTask":2,"taskChecked":false,"textTask":"fsdafad"}


const task = new Schema({
    idTask: {type:Number, required: true},
    taskChecked: {type:Boolean, required: true},
    textTask: {type:String, required: true}
})
const user =  mongoose.model('Users', base)
const tasks =  mongoose.model('Tasks', task)

module.exports = {Users: user, Tasks: tasks}

