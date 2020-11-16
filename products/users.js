const {Users, Tokens} = require('../modules');
const jwt = require('jsonwebtoken');
const {secret} = require('../default.json')
const bcrypt = require('bcrypt');
const {createAccessToken, createRefreshToken, createNewAccessAndRefresh} = require('../routs/token')


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
    if (client) {
        return res.send({message: 'cannot create an existing user'})
    }

    let hash = await bcrypt.hash(req.body.password, 7);
    let user = new Users({
        name: req.body.name,
        password: hash
    })


    let tokenAccess = createAccessToken(user._id)
    user.save((err) => {
        if (err) return err;

        return res.send({user, token: `Bearer ${tokenAccess}`})
    })


}

exports.login = async (req, res) => {

    if (!req.query.user && req.query.name && req.query.password) {
        let user = await Users.findOne({name: req.query.name});

        // проверка хэшированного пароля с не хэшированным


        let check = await bcrypt.compare(req.query.password, user.password);
        createAccessToken(user._id)
        if (check) {
            return updateToken(user._id).then(token => res.send({token, user}))
        }
        return res.status(404).json({message: "not such user this password"})


    } if(req.query.user) {
        let a = await req.query.user.replace('Bearer ', '')

        let candidate = await jwt.decode(a)
        if (!candidate) return res.send("not user");


        let us = await Users.findById({_id: candidate.userId})
        if (!us) return res.send('not user')
        res.send({user: us, status: 'user such'})
    }

}

exports.refreshTokens = (req, res) => {

    const {refresh} = req.body
    let payload
    try {
        payload = jwt.decode(refresh, secret)
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
        .then(tokens => res.json(tokens))
        .catch(err => res.status(400).json({message: err.message}))
}