const Role = require('../model/Role')
const { Snowflake } = require('@theinternetfolks/snowflake')

// @desc    Create a new Role
// @route   POST /v1/role
// @access  Private
exports.createNewRole = async (req, res) => {
    req.body._id = Snowflake.generate()
    const role = new Role(req.body)
    try {
        await role.save()
        const jsonRes = {
            status: true,
            content: {
                data: role
            }
        }
        if(req.noResponse) return req.body._id
        res.status(201).send(jsonRes)
    } catch (error) {
        if(error.code === 11000 && req.noResponse) return        
        res.status(400).send({status: false, error})
    }
}

// @desc    Get single Workplaces
// @route   GET /api/v1/workplaces/:id
// @access  Public
exports.getAllRoles = async (req, res) => {
    const limit = parseInt(req.body.limit) || 10
    const page = parseInt(req.body.page) - 1 || 0
    try {
        const roles = await Role.find().skip(limit * page).limit(limit)
        const count = await Role.countDocuments()
        let jsonRes = {
            status: true,
            content: {
                meta: {
                    total: count,
                    pages: (count+9)/10,
                    page: page+1
                },
                data: roles
            }
        }
        res.send(jsonRes)
    } catch (error) {
        res.status(500).send({status: false, error})
    }
}