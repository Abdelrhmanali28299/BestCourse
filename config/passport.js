const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')
const keys = require('./keys')

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
        }, (accessToken, refreshToken, profile, done) => {
            let image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'))
            const user = {
                googleID: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                image: image
            }
            User
                .findOne({ googleID: user.googleID })
                .then(data => {
                    if (data) {
                        done(null, data)
                    } else {
                        new User(user)
                            .save()
                            .then(user => {
                                done(null, user)
                            })

                    }
                })
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id).then(user => {
            done(null, user)
        })
    })
}