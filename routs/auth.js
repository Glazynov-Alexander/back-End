const express = require('express')
const router = express.Router();

const auth = require('../products/users')
const middleware = require('../middleware')


router.post('/auth/registration',  auth.registration)
router.get('/auth/login', auth.login)
router.get('/auth/refresh-tokens', auth.refreshTokens)




module.exports = router

