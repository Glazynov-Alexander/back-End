const { Tasks} = require('../modules');


exports.tasksDelete = async function (req, res, next) {
    await Tasks.deleteMany({taskChecked:true, symbol:req.query.symbol})

    Tasks.find({}, (error, tasks) => {
        return res.send({tasks, status:'you deleted completed tasks'})
    })
    next()
};

exports.deleteTask = async function (req, res,next) {
   await Tasks.deleteOne({_id:req.query.id})
    Tasks.find({}, (error, tasks) => {
        return res.send({tasks, status:'you delete one task'})
    })
    next()
};

exports.createTask = (req, res, next) => {
    let product = new Tasks({
        taskChecked: req.body.taskChecked,
        textTask: req.body.textTask,
        symbol: req.body.symbol,
    })

    product.save((err) => {
        if(err) {
            return next(err)
        }
        return res.send(product)
    })
    next()
}
exports.getTasks = async (req, res,next) => {
    await Tasks.find({symbol: req.query.symbol}, (err, tasks) => {
        if(err) return  next(err)
        else if(tasks.length !== 0) {
           return  res.send({tasks, status:'not tasks'})
        }
        return res.send({status:'not tasks'})
    })
    next()
}


exports.update = (req, res, next) => {
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
                    return  res.send({tasks, status: 'update task'})
                })
            });
        }
    });
    next()
}


