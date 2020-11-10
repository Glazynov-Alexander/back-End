const express = require('express')
const router = express.Router();

const  users = require('../products/users')
const  tasks = require('../products/tasks')


router.post('/create/user', users.newUser)
router.get('/user?:name', users.user)


router.post('/create/tasks', tasks.createTask)
router.get('/get/tasks?:symbol', tasks.getTasks)

router.put('/update/tasks', tasks.update)

router.delete('/delete?:id', tasks.deleteTask)
router.delete('/tasks/delete', tasks.tasksDelete)


module.exports = router

