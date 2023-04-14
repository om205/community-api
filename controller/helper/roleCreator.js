const Role = require('../../model/Role')
const { Snowflake } = require('@theinternetfolks/snowflake')

exports.roleCreater = async (reqBody) => {
    reqBody._id = Snowflake.generate()
    const role = new Role(reqBody)
    await role.save()
    return role
}