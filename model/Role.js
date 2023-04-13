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

RoleSchema.method('toJSON', function() {
  const role = this
  const roleObject = role.toObject()

  delete roleObject.__v

  return roleObject
})

module.exports = mongoose.model('Role', RoleSchema)