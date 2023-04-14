const { Snowflake } = require('@theinternetfolks/snowflake')
const Member = require('../../model/Member')

exports.addMember = async (reqBody) => {
    reqBody._id = Snowflake.generate()
    const member = new Member(reqBody)
    await member.save()
    return member
}