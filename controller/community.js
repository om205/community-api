const Community = require('../model/Community')
const { Snowflake } = require('@theinternetfolks/snowflake')
const { addMemberInCommunity } = require('../controller/member')
const { createNewRole } = require('../controller/role')

// @desc    Create new Community
// @route   POST /v1/community
// @access  Private
exports.createCommunity = async (req, res) => {
    const comm_id = Snowflake.generate()
    req.body._id = comm_id
    req.body.owner = req.user._id
    const community = new Community(req.body)
    try {
        await community.save()
        req.noResponse = true
        console.log('ch1')
        // create admin role
        req.body.name = "Community Admin"
        const role_id = await createNewRole(req, res)

        console.log(role_id)
        console.log('ch2')
        // add user as admin
        req.body.community = comm_id,
        req.body.user = req.user._id,
        req.body.role = role_id
        
        await addMemberInCommunity(req, res)

        console.log('ch3')
        const jsonRes = {
            status: true,
            content: {data: community}
        }
        res.status(201).send(jsonRes)
    } catch (error) {
        res.status(400).send({status: false, error})
    }
}

// @desc    Get all communities
// @route   GET /v1/community
// @access  Private
exports.getAllCommunities = async (req, res, next) => {
    
}

// @desc    Get all members of community
// @route   GET /v1/community/:id/members
// @access  Private
exports.getAllMembers = async (req, res, next) => {
    
}

// @desc    Gets all owned communities
// @route   GET /v1/community/me/owner
// @access  Private
exports.getOwnedCommunities = async (req, res, next) => {
    const limit = parseInt(req.body.limit) || 10
    const page = parseInt(req.body.page) - 1 || 0
    try {
        await req.user.populate({
            path: 'ownedCommunities',
            options: {
                limit,
                skip: page*limit
            }
        })
        const count = req.user.ownedCommunities.length
        const jsonRes = {
            status: true,
            content: {
                meta: {
                    total: count,
                    pages: (count+9)/10,
                    page: page+1
                },
                data: req.user.ownedCommunities
            }
        }
        res.send(jsonRes)
    } catch (error) {
        res.status(500).send({status: false, error})
    }
}

// @desc    Gets all joined communities
// @route   GET /v1/community/me/member
// @access  Private
exports.getJoinedCommunities = async (req, res, next) => {
    const limit = parseInt(req.body.limit) || 10
    const page = parseInt(req.body.page) - 1 || 0
    try {
        await req.user.populate({
            path: 'joinedCommunities',
            options: {
                limit,
                skip: page*limit
            }
        })
        const count = req.user.joinedCommunities.length
        const jsonRes = {
            status: true,
            content: {
                meta: {
                    total: count,
                    pages: parseInt((count+9)/10),
                    page: page+1
                },
                data: req.user.joinedCommunities
            }
        }
        res.send(jsonRes)
    } catch (error) {
        res.status(500).send({status: false, error})
    }
}