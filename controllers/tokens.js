const jwt = require("jsonwebtoken")
const env = require("env2")("./.env")

const {Tokens} = require("../models/token")
const {Users} = require("../models/user")
const uuid = require("uuid")
const secret = process.env.SECRET || "access"

exports.createAccessToken = (userId) => {
    const token = {
        userId,
        type: "access"
    }
    // {expiresIn: "1m"}
    return jwt.sign(token, secret,)
}


exports.createRefreshToken = () => {
    const payload = {
        id: uuid.v4(),
        type: "refresh"
    }
    // {expiresIn: "3m"}
    return {
        id: payload.id,
        token: jwt.sign(payload, "refresh")
    }
}


exports.createNewAccessAndRefresh = (tokenId, userId) => {
    return Tokens.findOneAndDelete({userId: userId})
        .exec()
        .then(() => Tokens.create({tokenId, userId}))
}

exports.processingRequest = async (user) => {
    let a = await user.replace('Bearer ', '')
    let candidate = await jwt.decode(a)
    if (!candidate) return {status: "not user"}
    let us = await Users.findById({_id: candidate.userId})
    if (!us) return {status: "not user"}
    return {user: us, status: "such user exists"}
}

