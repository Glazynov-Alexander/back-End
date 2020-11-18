const express = require('express')
const router = express.Router();


const  tasks = require('../products/tasks')
const  middleware = require('../middleware')




router.get('/get/tasks',middleware, tasks.getTasks)
router.put('/update/tasks',middleware, tasks.update)
router.put('/update/checkeds',middleware, tasks.updatesTasks)
router.post('/create/tasks',middleware, tasks.createTask)

router.delete('/delete?:id',middleware, tasks.deleteTask)
router.delete('/tasks/delete?:symbol',middleware, tasks.tasksDelete)


module.exports = router

