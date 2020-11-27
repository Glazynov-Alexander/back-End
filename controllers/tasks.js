const {Tasks} = require('../models/task');
const jwt = require('jsonwebtoken')
const joi = require('joi')

let getTasksUser = async (authorization) => {
    let token = await authorization.replace('Bearer ', '')
    let candidate = await jwt.decode(token)
    if (!candidate) return "not tasks"
    let tasks = await Tasks.find({symbol: candidate.userId})
    return tasks
}

exports.tasksDelete = async function (req, res) {
    await Tasks.deleteMany({taskChecked: true, symbol: req.query.symbol})
    return res.send({taskChecked:true, status: 'you deleted completed tasks'})
};

exports.deleteTask = async function (req, res) {
     await Tasks.deleteOne({_id: req.query.id})
    return res.send({id: req.query.id, status: 'you delete one task'})
};

exports.createTask = async (req, res, next) => {
    let schema = await joi.object({
        textTask: joi.string().min(3).max(20).required()
        , taskChecked: joi.boolean()
        , symbol: joi.string()
    })
    let result = await schema.validate(req.body)
    if (result.error) {
        return res.json({status: result.error.details[0].message})
    }

    let product = new Tasks({
        taskChecked: req.body.taskChecked,
        textTask: req.body.textTask,
        symbol: req.body.symbol,
    })
    product.save((err) => {
        if (err) {
            return next(err)
        }
        return res.json(product)
    })
}

exports.getTasks = async (req, res) => {
    let tasks = await getTasksUser(req.headers.authorization)
    if (tasks.length !== 0) return res.send({tasks, status: 'tasks'})
    return res.send({status: 'not tasks'})
}

exports.update = async (req, res) => {
    await Tasks.findOneAndUpdate({_id: req.body.id}, {taskChecked: req.body.checked}, (err, doc) => {
        if (err) return res.status(400)
        return res.send({task: {taskChecked: req.body.checked, id: req.body.id}, status: 'update task'})

    })
}

exports.updatesTasks = async (req, res) => {
    await Tasks.updateMany({taskChecked: false}, {taskChecked: req.body.checked})
    return res.send({taskChecked:req.body.checked, status: 'update tasks'})
}


