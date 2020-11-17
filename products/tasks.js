const {Tasks} = require('../modules');
const jwt = require('jsonwebtoken')

let getTasksUser = async (authorization) => {
    let a = await authorization.replace('Bearer ', '')
    let candidate = await jwt.decode(a)
    if (!candidate) return "not tasks"
    let tasks = await Tasks.find({symbol: candidate.userId})
    return tasks
}

exports.tasksDelete = async function (req, res) {
    await Tasks.deleteMany({taskChecked: true, symbol: req.query.symbol})
    let tasks = await getTasksUser(req.headers.authorization)
    return res.send({tasks, status: 'you deleted completed tasks'})
};

exports.deleteTask = async function (req, res) {
    await Tasks.deleteOne({_id: req.query.id})
    let tasks = await getTasksUser(req.headers.authorization)
    return res.send({tasks, status: 'you delete one task'})
};

exports.createTask = (req, res) => {
    let product = new Tasks({
        taskChecked: req.body.taskChecked,
        textTask: req.body.textTask,
        symbol: req.body.symbol,
    })
    product.save((err) => {
        if (err) {
            return next(err)
        }
        return res.send(product)
    })
}

exports.getTasks = async (req, res) => {
    let tasks = await getTasksUser(req.headers.authorization)
    if (tasks.length !== 0) return res.send({tasks, status: 'tasks'})
    return res.send({status: 'not tasks'})
}

exports.update = async (req, res) => {
    await Tasks.updateOne({_id: req.body.id}, {taskChecked: req.body.checked})
    let tasks = await getTasksUser(req.headers.authorization)
    return res.send({tasks, status: 'update task'})
}


