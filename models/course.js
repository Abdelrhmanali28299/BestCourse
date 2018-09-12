const mongoose = require('mongoose')
const Schema = mongoose.Schema

const storySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rate:{
        type: Number,
        default: 5
    },
    comments: [{
        commentBody: {
            type: String,
            required: true
        },
        commentRate:{
            type: Number
        },
        commentDate: {
            type: Date,
            default: Date.now
        },
        commentUser: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const modelClass = mongoose.model('courses', storySchema)

module.exports = modelClass