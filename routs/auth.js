const express = require('express')
const router = express.Router();

const auth = require('../products/users')
const middleware = require('../middleware')


router.post('/auth/registration',  auth.registration)
router.get('/auth/login',middleware, auth.login)
router.get('/refresh-tokens',middleware, auth.refreshTokens)




module.exports = router

