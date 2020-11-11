const { Tasks} = require('../modules');


exports.tasksDelete = async function (req, res) {
    await Tasks.deleteMany({taskChecked:true, symbol:req.query.symbol})

    Tasks.find({}, (error, tasks) => {
        res.send({tasks, status:'you deleted completed tasks'})
    })
};
exports.deleteTask = async function (req, res) {
   await Tasks.deleteOne({_id:req.query.id})
    Tasks.find({}, (error, tasks) => {

        res.send({tasks, status:'you delete one task'})
    })
};
exports.createTask = (req, res) => {
    let product = new Tasks({
        taskChecked: req.body.taskChecked,
        textTask: req.body.textTask,
        symbol: req.body.symbol,
    })

    product.save((err) => {
        if(err) {
            return next(err)
        }
        res.send(product)
    })

}
exports.getTasks = async (req, res) => {
    await Tasks.find({symbol: req.query.symbol}, (err, tasks) => {
        if(err) return  next(err)
        res.send(tasks)
    })
}
exports.update = (req, res) => {
    Tasks.findById(req.body.id, (err, task) => {
        if (err) {
            return next(err)
        } else {
            task.taskChecked = req.body.checked
            task.save((err) => {
                if (err) {
                    return next(err)
                }
                Tasks.find({}, (error, tasks) => {
                    res.send({tasks, status: 'update task'})
                })
            });
        }
    });
}

