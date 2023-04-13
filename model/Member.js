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
  
    delete memberObject.__v
    delete memberObject.updated_at
  
    return memberObject
})

module.exports = mongoose.model('Member', MemberSchema)