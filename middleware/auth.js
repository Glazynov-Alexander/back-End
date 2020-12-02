const secret = process.env.SECRET || "access";
const jwt = require("jsonwebtoken");

// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
  const authRations = req.header("Authorization");
  if (!authRations) {
    res.status(401).json("not authorization");
  } else {
    const token = authRations.replace("Bearer ", "");
    try {
      jwt.verify(token, secret);
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        return res.status(403).json({ status: "token expired" });
      }
      if (e instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ status: "invalid token" });
      }
    }
  }
  next();
};
