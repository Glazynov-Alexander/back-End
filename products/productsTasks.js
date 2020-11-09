const { Tasks} = require('../module/modules');


// exports.test = function (req, res) {
//     res.send('Greetings from the Test controller!');
// };


exports.deleteTask =  function (req, res) {
    Tasks.findOneAndDelete({_id: req.body.id}, function (err, docs) {
            if (err) return  next(err)
             return    res.send("delete task")

        });
};

exports.createTask = (req, res) => {

    let product = new Tasks({
        idTask: req.body.idTask,
        taskChecked: req.body.taskChecked,
        textTask: req.body.textTask
    })
    product.save((err) => {
        if(err) {
            return next(err)
        }
        res.send('you update collection tasks')
    })

}

exports.getTasks = async (req, res) => {
    await Tasks.find({}, (err, tasks) => {
        if(err) return  next(err)

        res.send(tasks)
    }).select("-__v").exec()
}

exports.update = (req,res) => {
    Tasks.findById(req.body.id, (err, task) => {
        if (err) {
            res.status(500).send(err);
        } else {

            task.taskChecked = req.body.checked

            task.save((err, updated_item) => {
                if (err) {
                    res.status(500).send(err)
                }
                res.status(200).send(updated_item);
            });
        }
    });


}