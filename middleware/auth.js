
const secret = process.env.SECRET || "access"
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
            if (e instanceof jwt.TokenExpiredError) {
                return  res.status(403).json({sms:'token expired'})
            }
            if (e instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({sms:'invalid token'})
            }
        }
    }
    next()
}