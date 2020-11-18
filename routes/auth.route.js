const express = require('express')
const router = express.Router();

const auth= require('../controllers/users.controller')

router.post('/auth/registration',  auth.registration)
router.get('/auth/login', auth.login)

module.exports = router

