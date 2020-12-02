require("env2")("./.env");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const product = require("./routes/task.route");
const auth = require("./routes/auth.route");

let passport = require("passport");
require("./authorizationVK/index");

const {PORT, DB_URL} = process.env;
const dbUrl = DB_URL;
const app = express();


mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
mongoose.set("debug", true);


app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({extended: true}));
app.use(require("express-session")({secret: "keyboard cat", resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());



app.use("/lists", product);
app.use("/auth", auth);




app.get("/auth/vkontakte", passport.authenticate("vkontakte",
    {scope: ["status", "friends", "name"], prompt: "select_account"}));


app.get("/auth/vkontakte/callback",
    passport.authenticate("vkontakte", {
        successRedirect: "/auth/vk",
        failureRedirect: "/auth/login"
    })
);

app.get("/",  auth);


app.listen(PORT, () => console.log(`Server is up and running on port number ${PORT}`));
