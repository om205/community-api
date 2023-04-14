const mongoose = require('mongoose')
const slug = require('slug')

const CommunitySchema = new mongoose.Schema({
        _id: {
            type: String
        },
        name: {
            type: String,
            default: '',
            unique: true,
            trim: true,
            maxlength: [50, 'Name can not be more than 50 characters']
        },
        slug: String,
        owner: {
            type: String,
            required: true,
            ref: 'User'
        }
},
{
    timestamps: true
})

CommunitySchema.virtual('members', {
    ref: 'Member',
    localField: '_id',
    foreignField: 'community'
})

CommunitySchema.pre('save', function(next) {
    if(this.isModified('name'))
    this.slug = slug(this.name)
    next()
})

CommunitySchema.method('toJSON', function() {
    const community = this
    const communityObject = community.toObject()
    communityObject.id = communityObject._id
    communityObject.created_at = communityObject.createdAt
    communityObject.updated_at = communityObject.updatedAt
  
    delete communityObject._id
    delete communityObject.__v
    delete communityObject.createdAt
    delete communityObject.updatedAt
  
    return communityObject
})

module.exports = mongoose.model('Community', CommunitySchema)