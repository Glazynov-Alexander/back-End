const mongoose = require("mongoose");

const { Schema } = mongoose;

const user = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true }
}, { versionKey: false });
const users = mongoose.model("Users", user);

module.exports = { Users: users };
