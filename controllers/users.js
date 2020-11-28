const {Users} = require('../models/user');
const {Tokens} = require('../models/token');

const bcrypt = require('bcrypt');
const joi = require('joi');
const jwt = require('jsonwebtoken');
const {createAccessToken, createRefreshToken, createNewAccessAndRefresh, processingRequest} = require('./tokens')


const updateToken = (userId) => {
    let token = createAccessToken(userId)
    let refreshToken = createRefreshToken()
    return createNewAccessAndRefresh(refreshToken.id, userId).then(() => {
        return {token: `Bearer ${token}`, refreshToken: refreshToken.token}
    })
}


exports.registration = async (req, res) => {
    let schema = await joi.object({
        name: joi.string().min(3).max(15).required(),
        password: joi.string().max(16).required()
    })
    let result = await schema.validate(req.body)
    if (result.error) {
        return res.json({status: result.error.details[0].message})
    }

    let client = await Users.findOne({name: req.body.name})

    //хэширование паролей
    if (client) return res.json({status: 'cannot create an existing user'})
    let hash = await bcrypt.hash(req.body.password, 7);
    let user = new Users({
        name: req.body.name,
        password: hash
    })
    let tokenAccess = await updateToken(user._id)
    user.save((err) => {
        if (err) return err;
        return res.json({user: {name: user.name, _id: user._id}, token: tokenAccess})
    })
}

exports.login = async (req, res) => {

    if (req.query.name && req.query.password) {
        let user = await Users.findOne({name: req.query.name});

        // проверка хэшированного пароля с не хэшированным
        if (!user) return res.json({status: "user with this name does not exist"})
        let check = await bcrypt.compare(req.query.password, user.password);
        if (check) {

            return updateToken(user._id).then(tokens => res.json({tokens, user: {name: user.name, _id: user._id}}))
        }
        return res.json({status: "the password was entered incorrectly"})
    }
    return res.json({status: "not parameters"})
}

exports.tokenAuthorization = async (req, res) => {
    let result = await processingRequest(req.query.user)
    return res.json({...result, user: {name: result.user.name, _id: result.user._id}})
}


exports.refreshTokens = async (req, res, next) => {

    const refresh = req.body.refresh
    let payload
    try {
        payload = await jwt.decode(refresh, 'refresh')
        console.log(payload)
        //  jwt.verify(req.header('Authorization'), 'access')
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            return res.status(400).json({status: 'Token expired'})
        } else if (e instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({status: 'Invalid token!'})
        }
    }

    Tokens.findOne({tokenId: payload.id}).exec().then((token) => {
        if (token === null) {
            throw new Error('Invalid token')
        }
        return updateToken(token.userId)
    })
        .then(tokens => res.json({tokens}))
        .catch(err => res.status(400).json({status: err.message}))
}

