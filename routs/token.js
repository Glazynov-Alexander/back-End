const jwt = require("jsonwebtoken")
const {secret} = require("../default.json")
const {Tokens} = require("../modules/index")
const uuid = require("uuid")

exports.createAccessToken = (userId) => {
    const token = {
        userId,
        type: "access"
    }
    return jwt.sign(token, secret, {expiresIn: "2m"})
}


exports.createRefreshToken = () => {
    const payload = {
        id: uuid.v4(),
        type: "refresh"
    }

    return {
        id: payload.id,
        token: jwt.sign(payload, "refresh", {expiresIn: "3m"})
    }
}


exports.createNewAccessAndRefresh = (tokenId, userId) => {
    return Tokens.findOneAndDelete({ userId:userId })
        .exec()
        .then(() => Tokens.create({tokenId, userId}))
}