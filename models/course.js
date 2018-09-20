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
    rate: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        required: true
    },
    link: {
        type: String
    },
    location: {
        type: {
            type: String,
            default: "Point"
        },
        coordinates: {
            type: [Number],
            index: "2dsphere"
        }
    },
    comments: [{
        commentBody: {
            type: String,
            required: true
        },
        commentRate: {
            type: Number,
            default: 0
        },
        commentDate: {
            type: Date,
            default: Date.now
        },
        commentUser: {
            type: Schema.Types.ObjectId,
            ref: 'googleUsers'
        }
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'googleUsers'
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const modelClass = mongoose.model('courses', storySchema)

module.exports = modelClass