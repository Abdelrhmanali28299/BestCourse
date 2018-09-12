const express = require('express')
const mongoose = require('mongoose')
const Course = require('../models/course')
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth')
const router = express.Router()

router.get('/', ensureGuest, (req, res) => {
    res.render('index/welcome')
})

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    Course
        .find({ user: req.user.id })
        .populate('user')
        .sort({ date: 'desc' })
        .then(courses => {
            res.render('index/dashboard', { courses })
        })
})

router.get('/about', (req, res) => {
    res.render('index/about')
})

module.exports = router