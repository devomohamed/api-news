const jwt = require('jsonwebtoken')
const Reporter = require('../models/reporter')

const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, 'ReporterPrivateKey')
        const user = await Reporter.findOne({ _id: decode._id, tokens: token })

        if (!user) {
            throw new Error()
        }

        req.user = user

        req.token = token

        next()
    } catch (e) {
        res.status(401).send({
            error: 'Please Authenticate'
        })
    }
}


module.exports = auth