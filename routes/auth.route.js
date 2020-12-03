const express = require("express");

const router = express.Router();
const auth = require("../controllers/users");
const checkToken = require("../middleware/auth");

router.post("/registration", require("../middleware/schemaUser"), auth.registration);

router.get("/login", auth.login);
router.get("/token-authorization",checkToken, auth.tokenAuthorization);
router.post("/refresh-tokens", auth.refreshTokens);

router.get("/vk", auth.vk);

module.exports = router;
