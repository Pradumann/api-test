const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = mongoose.model('User')
const { jwtKey } = require('../keys')

router.post('/signup', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = new User({ email, password })
    await user.save()
    const token = jwt.sign({ userId: user._id }, jwtKey)
    res.send({
      token
    })
  } catch (error) {
    return res.status(422).send(error)
  }
})

router.post('/signin', async (req, res) => {
  const { email, password } = req.body
  console.log('email = ' + email + ' password = ' + password)
  if (!email || !password) {
    console.log('status 422')
    return res.status(422).send({ error: 'must provide email and password both' })
  }
  const user = await User.findOne({ email })
  if (!user) {
    console.log('user not found')
    return res.status(422).send({ error: 'Must provide email and password both' })
  }
  try {
    console.log('comparing password')
    user.comparePassword(password)
    const token = jwt.sign({ userId: user._id }, jwtKey)
    return res.send({ token })
  } catch (error) {
    console.log('error = ', error)
    return res.status(422).send({ error: 'Must provide email and password both' })
  }
})

module.exports = router
