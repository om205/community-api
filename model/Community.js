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

CommunitySchema.pre('save', function(next) {
    if(this.isModified('name'))
    this.slug = slug(this.name)
    next()
})

CommunitySchema.method('toJSON', function() {
    const community = this
    const communityObject = community.toObject()
  
    delete communityObject.__v
  
    return communityObject
})

module.exports = mongoose.model('Community', CommunitySchema)