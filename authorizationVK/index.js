require("env2")("./.env");
// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const morgan = require("morgan");
// const product = require("./routes/task.route");
// const auth = require("./routes/auth.route");

let passport = require("passport");

let VKontakteStrategy = require("passport-vkontakte").Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (id, done) {

            done(null, id);

});

passport.use(new VKontakteStrategy(
    {
        clientID: 7683874,
        clientSecret: "qViYDfGnBspoLKF4Qp3n",
        callbackURL: "http://localhost:5001/auth/vkontakte/callback",
    },
    function myVerifyCallbackFn(accessToken, refreshToken, params, profile, done) {
        done(null, {name: profile._json.first_name, password: profile.id + ""});
    }
));