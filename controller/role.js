const Role = require('../model/Role')
const { roleCreater } = require('./helper/roleCreator')

// @desc    Create a new Role
// @route   POST /v1/role
// @access  Private
exports.createNewRole = async (req, res) => {
    try {
        const role = await roleCreater(req.body)
        const jsonRes = {
            status: true,
            content: {
                data: role
            }
        }
        res.status(201).send(jsonRes)
    } catch (error) {       
        res.status(400).send({status: false, error})
    }
}

// @desc    Get all created roles
// @route   GET /v1/role
// @access  Private
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
                    pages: Math.ceil(count/limit),
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