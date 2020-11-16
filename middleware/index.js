const {secret} = require('../default.json')
const jwt = require('jsonwebtoken')
module.exports = async (req, res, next) => {

    let authRations = req.header('Authorization')
    if (!authRations) {
        res.status(404).json('not authorization')
    } else {
        const token = authRations.replace('Bearer ', '')
        try {
            jwt.verify(token, secret)
        } catch (e) {
            if (e instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({e, sms: 'invalid token'})
            }
        }
    }
    next()
}