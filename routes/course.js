const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/googleUser')
const Course = require('../models/course')
const { ensureAuthenticated } = require('../helpers/auth')

const router = express.Router()

router.get('/search', (req, res) => {
    res.render('courses/search')
})

router.get('/', (req, res) => {
    if (req.query.page && req.query.page != '' && req.query.search && req.query.search != '' && req.query.minPrice <= req.query.maxPrice && req.query.minPrice >= 0 && req.query.maxPrice >= 0) {
        Course
            .find({ title: { $regex: req.query.search }, price: { $lt: parseFloat(req.query.maxPrice) + 1, $gt: parseFloat(req.query.minPrice) - 1 } })
            .skip((parseInt(req.query.page) - 1) * 15)
            .limit(15)
            .sort({ rate: -1 })
            .populate('user')
            .then(data => {
                res.render('courses/index', { courses: data, lastIndex: parseInt(req.query.page) + 1, searchWord: req.query.search })
            })
    } else {
        res.redirect('/course/search')
    }
})

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('courses/add.ejs')
})

router.post('/add', ensureAuthenticated, (req, res) => {
    if (req.body.type == "online") {
        let course = new Course({
            title: req.body.title,
            description: req.body.body,
            price: parseFloat(req.body.price),
            type: req.body.type,
            link: req.body.link,
            rate: 0,
            user: req.user.id
        })
        course
            .save()
            .then(data => {
                res.redirect(`/course/show/${data._id}`)
            })
    } else {
        let course = new Course({
            title: req.body.title,
            description: req.body.body,
            type: req.body.type,
            location: {
                type: "point",
                coordinates: [parseFloat(req.body.lat), parseFloat(req.body.long)]
            },
            rate: 0,
            user: req.user.id
        })
        course
            .save()
            .then(data => {
                res.redirect(`/course/show/${data._id}`)
            })
    }
})

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Course
        .findOne({ _id: req.params.id })
        .then((data) => {
            if (data.user != req.user.id) {
                res.redirect('/course/search')
            } else {
                res.render('courses/edit', { course: data })
            }
        })
})

router.put('/edit/:id', ensureAuthenticated, (req, res) => {
    Course
        .findOne({ _id: req.params.id })
        .then((data) => {
            data.title = req.body.title
            data.description = req.body.body
            data.type = req.body.type
            data.price = parseFloat(req.body.price)
            if (req.body.type == "online") {
                data.link = req.body.link
            } else if (req.body.type == "offline") {
                data.location.coordinates = [parseFloat(req.body.lat), parseFloat(req.body.long)]
            }
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
            course.rate = ((parseInt(course.rate) * course.comments.length) + parseInt(req.body.rate * 10) / 10) / (course.comments.length + 1)
            let newComment = {
                commentBody: req.body.commentBody,
                commentRate: req.body.rate,
                commentUser: req.user.id
            }
            course.comments.unshift(newComment)
            course
                .save()
                .then(course => {
                    res.redirect(`/course/show/${course._id}`)
                })
        })
})

router.get('/show/:id', (req, res) => {
    Course
        .findOne({ _id: req.params.id })
        .populate('user')
        .populate('comments.commentUser')
        .then((data) => {
            res.render('courses/show', { course: data })
        })
})

router.get('/user/:id', (req, res) => {
    Course
        .find({
            user: req.params.id
        })
        .populate('user')
        .then((courses) => {
            res.render('courses/index', { courses })
        })
})

router.get('/my', ensureAuthenticated, (req, res) => {
    Course
        .find({
            user: req.user.id
        })
        .populate('user')
        .then((courses) => {
            res.render('courses/index', { courses })
        })
})

module.exports = router