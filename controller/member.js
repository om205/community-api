const Member = require('../model/Member')
const { Snowflake } = require('@theinternetfolks/snowflake')

// @desc    Adds a member to community
// @route   POST /v1/member
// @access  Private, Community Owner
exports.addMemberInCommunity = async (req, res, next) => {
    req.body._id = Snowflake.generate()
    const member = new Member(req.body)
    try {
        await member.save()
        const jsonRes = {
            status: true,
            content: {
                data: user
            }
        }
        if(req.noResponse) return
        res.status(201).send(jsonRes)
    } catch (error) {
        // if(error.code === 11000 && req.noResponse) return 
        res.status(400).send({status: false, error})
    }
}

// @desc    Deletes member from community
// @route   DELETE /v1/member/:id
// @access  Private, Community Owner, Community Moderater
exports.deleteMemberFromCommunity = async (req, res, next) => {
    
}