const express = require('express')
const auth = require('../middleware/auth')
const { createCommunity, getAllCommunities, getAllMembers, getOwnedCommunities, getJoinedCommunities } = require('../controller/community')

const router = express.Router()

router
    .route('/')
    .get(auth, getAllCommunities)
    .post(auth, createCommunity)

router
    .route('/:id/members')
    .get(auth, getAllMembers)

router
    .route('/me/owner')
    .get(auth, getOwnedCommunities)

router
    .route('/me/member')
    .get(auth, getJoinedCommunities)

module.exports = router