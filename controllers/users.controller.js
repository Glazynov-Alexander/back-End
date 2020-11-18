const {Users: UsersController} = require('../models');
const bcrypt = require('bcrypt');
const {createAccessToken, createRefreshToken, createNewAccessAndRefresh, processingRequest} = require('./tokens.controller')


const updateToken = (userId) => {
    let token = createAccessToken(userId)
    let refreshToken = createRefreshToken()
    return createNewAccessAndRefresh(refreshToken.id, userId).then(() => {
        return {token: `Bearer ${token}`, refreshToken: refreshToken.token}
    })
}


exports.registration = async (req, res) => {
    let client = await UsersController.findOne({name: req.body.name})
    //хэширование паролей

    if (client) return res.send({message: 'cannot create an existing user'})
    let hash = await bcrypt.hash(req.body.password, 7);
    let user = new UsersController({
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
    if (req.query.user) {
        let result = await processingRequest(req.query.user)
        return  res.send(result)
    }
    if (req.query.name && req.query.password) {
        let user = await UsersController.findOne({name: req.query.name});
        // проверка хэшированного пароля с не хэшированным
        if (!user) return res.send({status:'not user'})
        let check = await bcrypt.compare(req.query.password, user.password);

        if (check) {
            return updateToken(user._id).then(token => res.send({token, user}))
        }
        return res.send({status: "not such user this password"})
    }


}