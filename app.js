const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const ejs = require('ejs')
const path = require('path')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const auth = require('./routes/auth')
const index = require('./routes/index')
const course = require('./routes/course')
const keys = require('./config/keys')
const User = require('./models/googleUser')
const Course = require('./models/course')
require('./config/passport')(passport)

const app = express()
mongoose.Promise = global.Promise

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(methodOverride('_method'))

mongoose
  .connect(keys.mongoURI, { useMongoClient: true })
  .then(() => {
    console.log(`your database connected`)
  })
  .catch(err => {
    console.log(err)
  })

app.set('view engine', 'ejs')

app.use(cookieParser())
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())


app.use((req, res, next) => {
  res.locals.user = req.user || null
  next()
})
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', index)
app.use('/auth', auth)
app.use('/course', course)

const port = process.env.PORT || 5050

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})