const {Users, Tokens} = require('../models');
const bcrypt = require('bcrypt');
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
    let client = await Users.findOne({name: req.body.name})
    //хэширование паролей

    if (client) return res.send({message: 'cannot create an existing user'})
    let hash = await bcrypt.hash(req.body.password, 7);
    let user = new Users({
        name: req.body.name,
        password: hash
    })
    let tokenAccess = await updateToken(user._id)
    user.save((err) => {
        if (err) return err;
        return res.send({user, token: tokenAccess})
    })
}

exports.login = async (req, res) => {
    if (req.query.user) {
        let result = await processingRequest(req.query.user)
        return res.send({...result})
    }

    if (req.query.name && req.query.password) {
        let user = await Users.findOne({name: req.query.name});

        // проверка хэшированного пароля с не хэшированным
        if (!user) return res.send({status: 'not user'})
        let check = await bcrypt.compare(req.query.password, user.password);
        if (check) {
            return updateToken(user._id).then(tokens => {
                res.send({tokens, user})
            })
        }
        return res.send({status: "not such user this password"})
    }
}


exports.refreshTokens = async (req, res, next) => {
    const refresh = req.body.refresh
    let payload
    try {
        payload = await jwt.decode(refresh, 'refresh')
        await jwt.verify(req.header('Authorization'), 'access')
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            return res.status(400).json({message: 'Token expired'})
        } else if (e instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({message: 'Invalid token!'})
        }
    }

    Tokens.findOne({tokenId: payload.id}).exec().then((token) => {

        if (token === null) {
            throw new Error('Invalid token')
        }
        return updateToken(token.userId)
    })
        .then(tokens => res.send({tokens}))
        .catch(err => res.status(400).json({message: err.message}))
}

