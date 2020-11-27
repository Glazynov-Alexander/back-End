const express = require('express')
const router = express.Router();


const  tasks = require('../controllers/tasks')

const  middleware = require('../middleware/auth')






router.get('/get/tasks', middleware, tasks.getTasks)
router.put('/tasks/update',middleware, tasks.update)
router.put('/tasks/updates',middleware, tasks.updatesTasks)
router.post('/task/create',middleware, tasks.createTask)

router.delete('/delete?:id',middleware, tasks.deleteTask)
router.delete('/tasks/deletes?:symbol',middleware, tasks.tasksDelete)


module.exports = router

