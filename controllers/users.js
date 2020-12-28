const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {Users} = require("../models/user");
const {Tokens} = require("../models/token");
const {createAccessToken, createRefreshToken, createNewAccessAndRefresh} = require("./tokens");

const processingRequest = async (user) => {
    const token = await user.replace("Bearer ", "");
    const candidate = await jwt.decode(token);
    if (!candidate) return "not user";
    const us = await Users.findById({_id: candidate.userId});
    if (!us) return "not user";
    return {user: us, status: "such user exists"};
};

const updateToken = (userId) => {
    const token = createAccessToken(userId);
    const refreshToken = createRefreshToken();
    return createNewAccessAndRefresh(refreshToken.id, userId).then(() => ({token: `Bearer ${token}`, refreshToken: refreshToken.token}));
};

exports.registration = async (req, res) => {
    const client = await Users.findOne({name: req.body.name});
    if (client) return res.status(409).json({status: "cannot create an existing user"});

    // хэширование паролей
    const hash = await bcrypt.hash(req.body.password, 7);

    const user = new Users({
        name: req.body.name,
        password: hash
    });

    const tokenAccess = await updateToken(user._id);
    user.save((err) => {
        if (err) return err;
        return res.status(201).json({user: {name: user.name, _id: user._id}, token: tokenAccess});
    });
};

exports.login = async (req, res) => {
    if (req.query.name && req.query.password) {
        const user = await Users.findOne({name: req.query.name});
        if (!user) return res.status(404).send({status: "user with this name does not exist"});

        // проверка хэшированного пароля с не хэшированным
        const check = await bcrypt.compare(req.query.password, user.password);
        if (check) {
            return updateToken(user._id).then((tokens) => res.status(200).json({tokens, user: {name: user.name, _id: user._id}}));
        }
        return res.status(424).json({status: "the password was entered incorrectly"});
    }
    return res.status(400).json({status: "not parameters"});
};

exports.tokenAuthorization = async (req, res) => {
    console.log(req.query.user);
    const result = await processingRequest(req.query.user);

    if (typeof result === "object") {
        const tokenAccess = await updateToken(result.user._id);

        return res.status(200).json({...result, user: {name: result.user.name, _id: result.user._id}, tokens: tokenAccess});
    }
    return res.status(400).json({status: result});
};

exports.vk = async (req, res) => {
    await Users.findOne({name: req.user.name}, async (err, result) => {
        if (err) return res.status(409).json({status: "cannot create an existing user"});
        if (!result) {
            let user = await Users.create({name: req.user.name, password: req.user.password});
            const tokenAccess = await updateToken(user._id);
            return res.redirect(`https://gods123.herokuapp.com/login/:access=${tokenAccess.token}`);

        } else {
            const tokenAccess = await updateToken(result._id);
            return res.redirect(`https://gods123.herokuapp.com/login/:access=${tokenAccess.token}`);
        }
    });
};

exports.refreshTokens = async (req, res) => {
    const {refresh} = req.body;
    let payload;
    try {
        payload = await jwt.verify(refresh, "refresh");
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            return res.status(400).json({status: "Token expired"});
        }
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({status: "Invalid token!"});
        }
    }

    Tokens.findOne({tokenId: payload.id}).exec().then((token) => {
        if (token === null) {
            throw new Error("Invalid token");
        }
        return updateToken(token.userId);
    })
        .then((tokens) => res.status(201).json({tokens}))
        .catch((err) => res.status(400).json({status: err.message}));
};
