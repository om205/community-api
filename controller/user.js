const User = require('../model/User')
const { Snowflake } = require('@theinternetfolks/snowflake')

// @desc    Create new User
// @route   POST /v1/auth/signup
// @access  Public
exports.createUser = async (req, res) => {
    req.body._id = Snowflake.generate()
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        const jsonRes = {
            status: true,
            content: {
                data: user,
                meta: {
                    access_token: token
                }
            }
        }
        res.status(201).send(jsonRes)
    } catch (error) {
        res.status(400).send({status: false, error})
    }
}

// @desc    Login existing user
// @route   POST /v1/auth/signin
// @access  Public
exports.loginUser = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        const jsonRes = {
            status: true,
            content: {
                data: user,
                meta: {
                    access_token: token
                }
            }
        }
        res.send(jsonRes)
    } catch(error) {
        res.status(400).send({status: false, error})
    }
}

// @desc    Get user details
// @route   GET /v1/auth/me
// @access  Private
exports.getUser = async (req, res) => {
    const jsonRes = {
        status: true,
        content: {data: req.user}
    }
    res.send(jsonRes)
}

// @desc    Logout user
// @route   POST /v1/auth/logout
// @access  Private
exports.logoutUser = async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
}