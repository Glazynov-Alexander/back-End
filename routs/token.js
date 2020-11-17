const jwt = require("jsonwebtoken")
const {secret} = require("../default.json")
const {Tokens, Users} = require("../modules/index")
const uuid = require("uuid")

exports.createAccessToken = (userId) => {
    const token = {
        userId,
        type: "access"
    }
    // {expiresIn: "2m"}
    return jwt.sign(token, secret)
}


exports.createRefreshToken = () => {
    const payload = {
        id: uuid.v4(),
        type: "refresh"
    }
    // {expiresIn: "3m"}
    return {
        id: payload.id,
        token: jwt.sign(payload, "refresh", )
    }
}


exports.createNewAccessAndRefresh = (tokenId, userId) => {
    return Tokens.findOneAndDelete({ userId:userId })
        .exec()
        .then(() => Tokens.create({tokenId, userId}))
}

exports.processingRequest = async (user) => {
    let a = await user.replace('Bearer ', '')
    let candidate = await jwt.decode(a)
    if (!candidate) return "not user"
    let us = await Users.findById({_id: candidate.userId})
    if (!us) return 'not user'
    return {user: us, status: 'user such'}
}