const mongoose = require('mongoose')
const joi = require('joi')
const Schema = mongoose.Schema


const token = new Schema({
    tokenId: {type: String},
    userId: {type: String},
}, {versionKey: false})
const tokens = mongoose.model('Tokens', token)

module.exports = {Tokens: tokens}