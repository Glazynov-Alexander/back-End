const jwt = require("jsonwebtoken");
const {Tokens} = require("../models/token");
const uuid = require("uuid");
// eslint-disable-next-line no-undef
const secret = process.env.SECRET || "access";

exports.createAccessToken = (userId) => {
    const token = {
        userId,
        type: "access"
    };
    // {expiresIn: "1m"}
    return jwt.sign(token, secret,{expiresIn: "1m"});
};


exports.createRefreshToken = () => {
    const payload = {
        id: uuid.v4(),
        type: "refresh"
    };
    // {expiresIn: "3m"}
    return {
        id: payload.id,
        token: jwt.sign(payload, "refresh",{expiresIn: "1h"})
    };
};


exports.createNewAccessAndRefresh = (tokenId, userId) => {
    return Tokens.findOneAndDelete({userId: userId})
        .exec()
        .then(() => Tokens.create({tokenId, userId}));
};



