const jwt = require('jsonwebtoken')
const User = require('../model/User')

const auth = async (req, res, next) => {
    if(req.body.commmunity)
    try {
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
        
        if(!user) throw new Error()

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({success: false, error:'Please authenticate first.'})
    }
}

module.exports = auth