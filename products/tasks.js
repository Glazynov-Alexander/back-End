const { Tasks} = require('../modules');


exports.tasksDelete = async function (req, res) {
    await Tasks.deleteMany({taskChecked:true, symbol:req.query.symbol})

    Tasks.find({}, (error, tasks) => {
        return res.send({tasks, status:'you deleted completed tasks'})
    })

};

exports.deleteTask = async function (req, res) {
   await Tasks.deleteOne({_id:req.query.id})
    Tasks.find({}, (error, tasks) => {
        return res.send({tasks, status:'you delete one task'})
    })

};

exports.createTask = (req, res) => {
    console.log(req.body)
    console.log(req.query)
    console.log(req.params)
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

}
exports.getTasks = async (req, res) => {
    console.log(req.query.symbol)
    let a = await  Tasks.find({symbol: req.query.symbol})
    await Tasks.find({symbol: req.query.symbol}, (err, tasks) => {
        if(err) return  next(err)


        else if(tasks.length !== 0) {
            console.log(a)
            return  res.send({tasks, status:'not tasks'})
        }
        return res.send({status:'not tasks'})
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
                    return  res.send({tasks, status: 'update task'})
                })
            });
        }
    });
}


