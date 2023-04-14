const mongoose = require('mongoose')

const RoleSchema = new mongoose.Schema({
        _id: {
            type: String
        },
        name: {
          type: String,
          default: '',
          unique: true,
          trim: true,
          maxlength: [50, 'Name can not be more than 50 characters']
        }
},
{
    timestamps: true
})

RoleSchema.virtual('users', {
  ref: 'Member',
  localField: '_id',
  foreignField: 'role'
})

RoleSchema.method('toJSON', function() {
  const role = this
  const roleObject = role.toObject()
  roleObject.created_at = roleObject.createdAt
  roleObject.updated_at = roleObject.updatedAt
  roleObject.id = roleObject._id

  delete roleObject.createdAt
  delete roleObject.updatedAt
  delete roleObject._id
  delete roleObject.__v

  return roleObject
})

module.exports = mongoose.model('Role', RoleSchema)