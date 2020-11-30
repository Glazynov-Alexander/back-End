require("env2")("./.env");
const express = require("express");
const mongoose = require("mongoose");
const product = require("./routes/task.route");
const auth = require("./routes/auth.route");
const bodyParser = require("body-parser");
const morgan = require("morgan");
// eslint-disable-next-line no-undef
const dbUrl = process.env.DB_URL;
const app = express();


mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
mongoose.set("debug", true);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use("/lists", product);
app.use("/", auth);

// eslint-disable-next-line no-undef
app.listen(process.env.PORT, () => console.log("Server is up and running on port number " + process.env.PORT));


