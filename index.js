const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
// const PORT = process.env.PORT || 3000 // Step 1
const { mongoUrl } = require('./keys')
const bcrypt = require('bcrypt')
const saltRounds = 10
module.exports.bcrypt = bcrypt

require('dotenv').config({ path: 'variables.env' })

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 3000
// Mongo Set Up
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.connection.on('connected', () => {
  console.log('connected to mongoose yeahh')
})

mongoose.connection.on('error', (err) => {
  console.log('Error in connection to mongoose yeahh', err)
})

// App Set Up
require('./models/User')
const verifyToken = require('./middleware/requireToken')
const authRoutes = require('./routes/authRoutes')
app.use(bodyParser.json())

// Routes
app.use(authRoutes)

app.post('/', (req, res) => {
  console.log(req.body)
  res.send('hello')
})

app.get('/', verifyToken, (req, res) => {
  res.send('Your email is ' + req.user.email)
})

app.listen(PORT, () => {
  console.log('server running ' + PORT) // mongodb://heroku_0lhxg6th:5nnv3u2oo3drssi40o8emoqgho@ds359868.mlab.com:59868/heroku_0lhxg6th
})
