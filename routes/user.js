const express = require('express')
const { createUser, loginUser, getUser, logoutUser } = require('../controller/user')
const auth = require('../middleware/auth')

const router = express.Router()

router
    .route('/signup')
    .post(createUser)

router
    .route('/signin')
    .post(loginUser)

router
    .route('/me')
    .get(auth, getUser)

router
    .route('/logout')
    .post(auth, logoutUser)

module.exports = router