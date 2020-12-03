require("env2")("./.env");

let passport = require("passport");

let VKontakteStrategy = require("passport-vkontakte").Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (id, done) {
    console.log(id);
            done(null, id);
});

passport.use(new VKontakteStrategy(
    {
        clientID: 7686582 ,
        clientSecret: "7YNdhXuuXW7FVEgogITa",
        callbackURL: "http://localhost:5001/auth/vkontakte/callback",
    },
    function myVerifyCallbackFn(accessToken, refreshToken, params, profile, done) {
        done(null, {name: profile._json.first_name, password: profile.id + ""});
    }
));