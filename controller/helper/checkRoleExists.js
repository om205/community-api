const Role = require('../../model/Role')

exports.roleExists = async (name) => {
    const role = await Role.find({name})
    return {
        exists: role.length===1,
        role: role[0]
    }
}