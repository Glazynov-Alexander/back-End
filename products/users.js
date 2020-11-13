const {Users} = require('../modules');

exports.newUser = (req, res) => {
    Users.find({name: req.body.name}, (err, client) => {
        if(err) return  next(err)

        else if(client.length !== 0) {
            return res.send('cannot create an existing user')
        }

        let user = new Users({
            name: req.body.name,
            password: req.body.password
        })
        user.save((err) => {
            if(err) return next(err)

            return res.send({user, status: 'create new user'})
        })
    } )

}
exports.user = (req, res)  => {
    return Users.find({name:req.query.name, password: req.query.password}
    ,(err, user) => {
        if(err) return  next(err)
        if(user.length !== 0) {
            return  res.send( {user, status: "there is such a user"})
        }
            return  res.send( { status: "not such user"})
    })
}