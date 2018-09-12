const mongoose = require('mongoose')
const Schema = mongoose.Schema

const googleUserSchema = new Schema({
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

const modelClass = mongoose.model('googleUsers', googleUserSchema)

module.exports = modelClass