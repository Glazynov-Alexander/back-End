const mongoose = require('mongoose')
const Schema = mongoose.Schema

const base = new Schema({
    name: {type:String, required: true},
    password: {type:String, required: true}
})

const task = new Schema({
    taskChecked: {type:Boolean, required: true},
    textTask: {type:String, required: true},
    symbol: {type:String, required: true},
})


const user =  mongoose.model('Users', base)
const tasks =  mongoose.model('Tasks', task)

module.exports = {Users: user, Tasks: tasks}

