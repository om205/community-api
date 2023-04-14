const Member = require('../model/Member')
const Community = require('../model/Community')
const { addMember } = require('./helper/addMember')

// @desc    Adds a member to community
// @route   POST /v1/member
// @access  Private, Community Owner
exports.addMemberInCommunity = async (req, res) => {
    try {
        const community = await Community.findOne({id: req.body.commmunity})//why this behaviour not _id
            .populate({ path: 'owner', select: ['_id']} )
        if(req.user._id !== community.owner._id) throw 'NOT_ALLOWED_ACCESS'
        const member = await addMember(req.body)
        const jsonRes = {
            status: true,
            content: {
                data: member
            }
        }
        res.status(201).send(jsonRes)
    } catch (error) {
        res.status(400).send({status: false, error})
    }
}

// @desc    Deletes member from community
// @route   DELETE /v1/member/:id
// @access  Private, Community Owner, Community Moderater
exports.deleteMemberFromCommunity = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id).populate({ path: 'community' })
        const isOwner = member.community.owner === req.user._id
        await member.community.populate({
            path: 'members', 
            populate: { 
                path: 'role',
                select: ['name']
            }
        })
        const moderator = member.community.members.find(member => member.role.name === 'Community Moderator' || member.role.name === 'Community Admin')
        const isModerator = moderator === req.user._id
        if(!(isModerator||isOwner)) throw 'NOT_ALLOWED_ACCESS'

        const deletedMember = await Member.findOneAndDelete({ _id:req.params.id})
        if(!deletedMember) return res.status(404).send({status: false})
        res.send({status: true})
    } catch (error) {
        res.status(500).send({status: false, error})
    }
}