const {Users} = require('../modules');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const {createAccessToken, createRefreshToken, createNewAccessAndRefresh, processingRequest} = require('../routs/token')

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
    let tokenAccess = createAccessToken(user._id)
    user.save((err) => {
        if (err) return err;
        return res.send({user, token: `Bearer ${tokenAccess}`})
    })


}

exports.login = async (req, res) => {
    if (req.query.name && req.query.password) {
        let user = await Users.findOne({name: req.query.name});
        // проверка хэшированного пароля с не хэшированным
        if (!user) return res.send('not user')
        let check = await bcrypt.compare(req.query.password, user.password);
        createAccessToken(user._id)
        if (check) {
            return updateToken(user._id).then(token => res.send({token, user}))
        }
        return res.status(404).json({message: "not such user this password"})
    }
    if (req.query.user) {
        let result = await processingRequest(req.query.user)
       return  res.send(result)
    }

}