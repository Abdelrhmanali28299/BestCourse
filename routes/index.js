const express = require('express')
const mongoose = require('mongoose')
const Story = require('../models/story')
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth')
const router = express.Router()

router.get('/', ensureGuest, (req, res) => {
    res.render('index/welcome')
})

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    Story
        .find({ user: req.user.id })
        .populate('user')
        .sort({ date: 'desc' })
        .then(stories => {
            res.render('index/dashboard', { stories })
        })
})

router.get('/about', (req, res) => {
    res.render('index/about')
})

module.exports = router