const express = require('express')
const { addMemberInCommunity, deleteMemberFromCommunity } = require('../controller/member')
const auth = require('../middleware/auth')

const router = express.Router()

router
    .route('/')
    .post(auth, addMemberInCommunity)

router
    .route('/:id')
    .delete(auth, deleteMemberFromCommunity)

module.exports = router