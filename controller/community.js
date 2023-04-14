const Community = require('../model/Community')
const { Snowflake } = require('@theinternetfolks/snowflake')
const { addMember } = require('./helper/addMember')
const { roleCreater } = require('./helper/roleCreator')
const { roleExists } = require('./helper/checkRoleExists')

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
        
        let role
        // create admin role if it dosen't exist
        const roleDesc = {
            name: "Community Admin"
        }
        const checkRole = await roleExists(roleDesc.name)
        if(checkRole.exists)
        role = checkRole.role
        else role = await roleCreater(roleDesc)

        // add user as admin
        const memberDesc = {
            community: comm_id,
            user: req.user._id,
            role: role._id
        }
        const member = await addMember(memberDesc)

        const jsonRes = {
            status: true,
            content: {data: community}
        }
        res.status(201).send(jsonRes)
    } catch (error) {
        console.log(error)
        res.status(400).send({status: false, error})
    }
}

// @desc    Get all communities
// @route   GET /v1/community
// @access  Private
exports.getAllCommunities = async (req, res, next) => {
    try {
        const limit = parseInt(req.body.limit) || 10
        const page = parseInt(req.body.page) - 1 || 0
        const communities = await Community.find().skip(limit * page).limit(limit)
            .populate({ path: 'owner', select: ['_id','name']})
        // renaming keys (extra): without below function response just gives _id instead of id
        const communitiesArr = communities.map(community => {
            const communityObj = community.toObject()
            communityObj.id = communityObj._id
            delete communityObj._id
            delete communityObj.__v
            const ownerObj = community.owner.toJSON()
            delete ownerObj.updated_at
            communityObj.owner = ownerObj
            return communityObj
        })
        const count = await Community.countDocuments()
        const jsonRes = {
            status: true,
            content: {
                meta: {
                    total: count,
                    pages: Math.ceil(count/limit),
                    page: page+1
                },
                data: communitiesArr
            }
        }
        res.send(jsonRes)
    } catch (error) {
        res.status(500).send({status: false, error})
    }
}

// @desc    Get all members of community
// @route   GET /v1/community/:id/members
// @access  Private
exports.getAllMembers = async (req, res, next) => {
    try {
        const limit = parseInt(req.body.limit) || 10
        const page = parseInt(req.body.page) - 1 || 0
        const community = await Community.findOne({_id: req.params.id})
        if(community)
        await community.populate({
            path: 'members', 
            populate: [
                {
                    path: 'user',
                    select: ['_id', 'name']
                },
                { 
                    path: 'role',
                    select: ['_id', 'name']
                }
            ]
        })
        // renaming keys (extra): without below function response just gives _id instead of id
        const members = community.members.map(member => {
            const memberObj = member.toObject()
            const userObj = member.user.toJSON()
            delete userObj.updated_at
            const roleObj = member.role.toJSON()
            delete roleObj.updated_at
            delete roleObj.created_at
            memberObj['user'] = userObj
            memberObj['role'] = roleObj
            return memberObj
        })
        const count = members.length 
        const paginatedMembers = members.slice(page * limit).slice(0, limit)
        const jsonRes = {
            status: true,
            content: {
                meta: {
                    total: count,
                    pages: Math.ceil(count/limit),
                    page: page+1
                },
                data: paginatedMembers
            }
        }
        res.send(jsonRes)
    } catch (error) {
        res.status(500).send({status: false, error})
    }    
}

// @desc    Gets all owned communities
// @route   GET /v1/community/me/owner
// @access  Private
exports.getOwnedCommunities = async (req, res) => {
    const limit = parseInt(req.body.limit) || 10
    const page = parseInt(req.body.page) - 1 || 0
    try {
        await req.user.populate({
            path: 'ownedCommunities'
        })
        const count = req.user.ownedCommunities.length
        const ownedCommunities = count ? await req.user.ownedCommunities : []
        const paginatedItems = ownedCommunities.slice(page * limit).slice(0, limit)
        const jsonRes = {
            status: true,
            content: {
                meta: {
                    total: count,
                    pages: Math.ceil(count/limit),
                    page: page+1
                },
                data: paginatedItems
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
            select: ['community'],
            populate: {
                path: 'community',
                populate: {
                    path: 'owner',
                    select: ['_id', 'name']
                }
            }
        })
        const count = req.user.joinedCommunities.length
        // members contain users with community field expanded
        const members = await req.user.joinedCommunities
        // extracting community from members
        const joinedCommunities = members.map(user => {
            const ownerObj = user.community.owner.toJSON()
            delete ownerObj.updated_at
            const communityObj = user.community.toJSON()
            communityObj['owner'] = ownerObj
            return communityObj
        })
        // custum pagination code as we have object instead of model
        const paginatedItems = joinedCommunities.slice(page * limit).slice(0, limit)
        const jsonRes = {
            status: true,
            content: {
                meta: {
                    total: count,
                    pages: Math.ceil(count/limit),
                    page: page+1
                },
                data: paginatedItems
            }
        }
        res.send(jsonRes)
    } catch (error) {
        res.status(500).send({status: false, error})
    }
}