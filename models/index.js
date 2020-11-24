const mongoose = require('mongoose')
const Schema = mongoose.Schema

const user = new Schema({
    name: {type:String, required: true},
    password: {type:String, required: true},
}, { versionKey: false })

const task = new Schema({
    taskChecked: {type:Boolean, required: true},
    textTask: {type:String, required: true},
    symbol: {type:String, required: true},
}, { versionKey: false })

const token = new Schema({
    tokenId: {type:String},
    userId: {type:String},
}, { versionKey: false })


const users =  mongoose.model('Users', user)
const tasks =  mongoose.model('Tasks', task)
const tokens =  mongoose.model('Tokens', token)


module.exports = {Users: users, Tasks: tasks, Tokens: tokens}

