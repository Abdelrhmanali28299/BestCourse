const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    googleID: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    image: {
        type: String
    }
})

const modelClass = mongoose.model('google-user', userSchema)

module.exports = modelClass