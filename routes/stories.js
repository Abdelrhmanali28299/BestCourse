const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/User')
const Story = require('../models/story')
const { ensureAuthenticated } = require('../helpers/auth')

const router = express.Router()

router.get('/', (req, res) => {
    Story
        .find({ status: 'public' })
        .populate('user')
        .then(data => {
            res.render('stories/index', { stories: data })
        })
})

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add.ejs')
})

router.post('/add', ensureAuthenticated, (req, res) => {
    let allowComments
    if (req.body.allowComments) {
        allowComments = true
    } else {
        allowComments = false
    }

    let story = new Story({
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: allowComments,
        user: req.user.id
    })
    story
        .save()
        .then(data => {
            res.redirect(`/stories/show/${data._id}`)
        })
})

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Story
        .findOne({ _id: req.params.id })
        .then((data) => {
            if (data.user != req.user.id) {
                res.redirect('/stories')
            } else {
                res.render('stories/edit', { story: data })
            }
        })
})

router.put('/edit/:id', ensureAuthenticated, (req, res) => {
    Story
        .findOne({ _id: req.params.id })
        .then((data) => {
            let allowComments
            if (req.body.allowComments) {
                allowComments = true
            } else {
                allowComments = false
            }
            data.title = req.body.title
            data.body = req.body.body
            data.status = req.body.status
            data.allowComments = allowComments
            data
                .save()
                .then(story => {
                    res.redirect('/dashboard')
                })
        })
})

router.delete('/delete/:id', ensureAuthenticated, (req, res) => {
    Story
        .remove({ _id: req.params.id })
        .then(() => {
            res.redirect('/dashboard')
        })
})

router.post('/comment/:id', ensureAuthenticated, (req, res) => {
    Story
        .findOne({ _id: req.params.id })
        .then(story => {
            let newComment = {
                commentBody: req.body.commentBody,
                commentUser: req.user.id
            }
            story.comments.unshift(newComment)
            story
                .save()
                .then(story => {
                    res.redirect(`/stories/show/${story._id}`)
                })
        })
})

router.get('/show/:id', (req, res) => {
    Story
        .findOne({ _id: req.params.id })
        .populate('user')
        .populate('comments.commentUser')
        .then((data) => {
            if (data.status == 'public') {
                res.render('stories/show', { story: data })
            } else {
                if (req.user && req.user.id == data.user._id) {
                    res.render('stories/show', { story: data })
                } else {
                    res.redirect('/stories')
                }
            }
        })
})

router.get('/user/:id', (req, res) => {
    Story
        .find({
            user: req.params.id,
            status: 'public'
        })
        .populate('user')
        .then((stories) => {
            res.render('stories/index', { stories })
        })
})

router.get('/my', ensureAuthenticated, (req, res) => {
    Story
        .find({
            user: req.user.id
        })
        .populate('user')
        .then((stories) => {
            res.render('stories/index', { stories })
        })
})

module.exports = router