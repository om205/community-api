const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
        _id: {
            type: String
        },
        name: {
          type: String,
          default: '',
          minLength: 2,
          unique: true,
          trim: true,
          maxlength: [50, 'Name can not be more than 50 characters']
        },
        email: {
          type: String,
          unique: true,
          required: true,
          match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
          ]
        },
        password: {
            type: String,
            trim: true,
            minLength: 6,
            required: true,
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
},
{
    timestamps: true
})

UserSchema.virtual('ownedCommunities', {
  ref: 'Community',
  localField: '_id',
  foreignField: 'owner'
})

UserSchema.virtual('joinedCommunities', {
  ref: 'Member',
  localField: '_id',
  foreignField: 'user'
})

// to stop sending user password and auth tokens in user object
UserSchema.method('toJSON', function() {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.updatedAt
  delete userObject.__v

  return userObject
})

UserSchema.method('generateAuthToken', async function() {
  const user = this
  const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
  user.tokens = user.tokens.concat({token})
  await user.save()
  return token
})

UserSchema.static('findByCredentials', async (email, password) => {
  const user = await User.findOne({email})
  if(!user) throw {error:'unable to login'}
  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch) throw {error:'unable to login'}
  return user
})

UserSchema.pre('save', async function(next) {
  const user = this
  if(user.isModified('password'))
  user.password = await bcrypt.hash(user.password, 8)
  next()
})

const User = mongoose.model('User', UserSchema)
module.exports = User