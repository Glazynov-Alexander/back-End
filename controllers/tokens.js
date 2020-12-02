const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const { Tokens } = require("../models/token");
// eslint-disable-next-line no-undef
const secret = process.env.SECRET || "access";

exports.createAccessToken = (userId) => {
  const token = {
    userId,
    type: "access"
  };
    // {expiresIn: "1m"}
  return jwt.sign(token, secret, { expiresIn: "1m" });
};

exports.createRefreshToken = () => {
  const payload = {
    id: uuid.v4(),
    type: "refresh"
  };
    // {expiresIn: "3m"}
  return {
    id: payload.id,
    token: jwt.sign(payload, "refresh", { expiresIn: "1h" })
  };
};

exports.createNewAccessAndRefresh = (tokenId, userId) => Tokens.findOneAndDelete({ userId })
  .exec()
  .then(() => Tokens.create({ tokenId, userId }));
