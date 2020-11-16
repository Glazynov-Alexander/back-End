const {Users, Tokens} = require('../modules');
const jwt = require('jsonwebtoken');
const {secret} = require('../default.json')
// const bcrypt = require('bcryptjs');
const bcrypt = require('bcrypt');
const {createAccessToken, createRefreshToken, createNewAccessAndRefresh} = require('../routs/token')


const updateToken = (userId) => {
    let token = createAccessToken(userId)
    let refreshToken = createRefreshToken()

    return createNewAccessAndRefresh(refreshToken.id, userId).then(() => {
        return {token:`Bearer ${token}`, refreshToken: refreshToken.token}
    })
}

exports.registration = async (req, res, ) => {
    //хэширование паролей
    console.log(req.body)
    let client = await Users.findOne({name: req.body.name})
    let hash = await bcrypt.hash(req.body.password, 7);

        if (client) {
             res.send({message:'cannot create an existing user'})
        }
    // let token = await jwt.sign({id: user._id}, secret, {expiresIn: "1m"})

    else {
        let user = new Users({
            name: req.body.name,
            password: hash
        })
        // let token = await createAccessToken(user._id)
        // let refreshToken = await createRefreshToken()

        let token = await updateToken(user._id)
        user.save((err) => {
            if (err) return err

             res.send({access: token, status: "create user"})
            // return res.send({token: `Bearer${} `, status: 'create new user'})
        })
    }


}

exports.login = async (req, res, next) => {
    console.log(req.headers)
    let user = await Users.findOne({name: req.body.name})

    // let user = await Users.findOne({name: req.query.name})
    if (!user) return res.send("not user")
    //проверка хэшированного пароля с не хэшированным

    let check = await bcrypt.compare(req.body.password, user.password)
    if (check) {
        return updateToken(user._id).then(token => res.send({token, user}))
    }
     res.status(404).json({message: " such user"})

}

exports.refreshTokens = (req, res) => {
    const {refresh} = req.body.token
    let payload
    try {
        payload = jwt.decode(refresh, secret)
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            return res.status(400).json({message: 'Token expired'})
        }
        else if(e instanceof  jwt.JsonWebTokenError) {
            return  res.status(400).json({message: 'Invalid token!'})
        }
    }

    Tokens.findOne({tokenId: payload.id}).exec().then((token) => {
        if(token === null ) {
            throw new Error('Invalid token')
        }
        return updateToken(token.userId)
    })
        .then(tokens => res.json(tokens))
        .catch(err => res.status(400).json({message: err.message}))


}