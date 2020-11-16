const {secret} = require('../default.json')
const jwt = require('jsonwebtoken')
module.exports = async (req, res, next) => {

    const authRations = req.get('Authorization')
    if (!authRations) {
        res.status(404).json('not authorization')
    } else {
        const token = authRations.replace('Bearer ', '')


        try {

           await  jwt.verify(token, secret, function(err, decoded) {
                console.log(decoded) // bar
            })

        } catch (e) {
            if (e instanceof jwt.JsonWebTokenError) {
                res.status(401).json('invalid token')
            }
        }
    }

    next()
}