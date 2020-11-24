const express = require('express')
const router = express.Router();

const auth = require('../controllers/users')


router.post('/auth/registration', auth.registration)
router.get('/auth/login', auth.login)
router.post('/auth/refresh-tokens', auth.refreshTokens)


module.exports = router

