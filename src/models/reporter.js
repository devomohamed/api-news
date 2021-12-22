const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')




const reporterScema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 20,
        validate(value) {
            if (value < 0) {
                throw new Error("Age Is InValid")
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email Is InValid")
            }
        }
    },
    phone: {
        type: String,
        trim: true,
        validate(value) {
            if (!validator.isMobilePhone(value, ['ar-EG'])) {
                throw new Error("Mobile Is InValid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    tokens: [{
        type: String,
        required: true
    }],
    avatar: {
        type: Buffer
    }
});
reporterScema.pre('save', async function(next) {
    const reporter = this
    console.log(reporter);
    if (reporter.isModified("password"))
        reporter.password = await bcrypt.hash(reporter.password, 8)
    next()
})
reporterScema.statics.findByCredentials = async(email, password) => {
    const reporter = await Reporter.findOne({ email })

    if (!reporter) {
        throw new Error('Check Your Email Or Password')
    }

    const isMatch = await bcrypt.compare(password, reporter.password)
    if (!isMatch) {
        throw new Error('Check Your Email Or Password')
    }
    return reporter
}

reporterScema.methods.generateToken = async function() {
    const reporter = this

    const token = jwt.sign({ _id: reporter._id.toString() }, 'ReporterPrivateKey')
    reporter.tokens = reporter.tokens.concat(token)
    await reporter.save()
    return token
}





const Reporter = mongoose.model('Reporter', reporterScema)
module.exports = Reporter