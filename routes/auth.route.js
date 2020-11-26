const express = require('express')
const router = express.Router();

const auth = require('../controllers/users')


router.post('/auth/registration', auth.registration)
router.get('/auth/login', auth.login)
router.get('/auth/token-authorization', auth.tokenAuthorization)
router.post('/auth/refresh-tokens', auth.refreshTokens)


module.exports = router

