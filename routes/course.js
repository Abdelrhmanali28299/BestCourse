const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/googleUser')
const Course = require('../models/course')
const { ensureAuthenticated } = require('../helpers/auth')

const router = express.Router()

router.get('/', (req, res) => {
    Course
        .find({ rate: 5 })
        .populate('user')
        .then(data => {
            res.render('courses/index', { courses: data })
        })
})

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('courses/add.ejs')
})

router.post('/add', ensureAuthenticated, (req, res) => {
    let course = new Course({
        title: req.body.title,
        description: req.body.body,
        rate: req.body.rate,
        user: req.user.id
    })
    course
        .save()
        .then(data => {
            res.redirect(`/course/show/${data._id}`)
        })
})

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Course
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
    Course
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
                .then(course => {
                    res.redirect('/dashboard')
                })
        })
})

router.delete('/delete/:id', ensureAuthenticated, (req, res) => {
    Course
        .remove({ _id: req.params.id })
        .then(() => {
            res.redirect('/dashboard')
        })
})

router.post('/comment/:id', ensureAuthenticated, (req, res) => {
    Course
        .findOne({ _id: req.params.id })
        .then(course => {
            let newComment = {
                commentBody: req.body.commentBody,
                commentUser: req.user.id
            }
            course.comments.unshift(newComment)
            course
                .save()
                .then(story => {
                    res.redirect(`/stories/show/${story._id}`)
                })
        })
})

router.get('/show/:id', (req, res) => {
    Course
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
    Course
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
    Course
        .find({
            user: req.user.id
        })
        .populate('user')
        .then((stories) => {
            res.render('stories/index', { stories })
        })
})

module.exports = router