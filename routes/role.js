const express = require('express')
const { createNewRole, getAllRoles } = require('../controller/role')
const auth = require('../middleware/auth')

const router = express.Router()

router
    .route('/')
    .get(auth, getAllRoles)
    .post(auth, createNewRole)

module.exports = router