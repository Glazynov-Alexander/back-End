const express = require('express')
const router = express.Router();

const  users = require('../products/productUser')
const  tasks = require('../products/productsTasks')

router.get('/bit', users.test)


router.get('/bit/drozd', users.brigada)

router.post('/create/user', users.obj)
router.get('/test_get/:id', users.eget)


router.post('/create/tasks', tasks.createTask)
router.get('/get/tasks', tasks.getTasks)

router.put('/update/tasks', tasks.update)

router.delete('/delete?:id', tasks.deleteTask)


 module.exports = router

