const mongoose = require('mongoose')

const MemberSchema = new mongoose.Schema({
        _id: {
            type: String
        },
        community: {
            type: String,
            required: true,
            ref: 'Community'
        },
        user: {
            type: String,
            required: true,
            ref: 'User'
        },
        role: {
            type: String,
            required: true,
            ref: 'Role'
        }
},
{
    timestamps: true
})

MemberSchema.method('toJSON', function() {
    const member = this
    const memberObject = member.toObject()
    memberObject.id = memberObject._id
    memberObject.created_at = memberObject.createdAt

    delete memberObject._id
    delete memberObject.__v
    delete memberObject.createdAt
    delete memberObject.updatedAt
  
    return memberObject
})

module.exports = mongoose.model('Member', MemberSchema)