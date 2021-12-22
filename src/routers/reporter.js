const express = require('express')
const router = new express.Router()
const multer = require('multer')
const Reporter = require('../models/reporter')
const auth = require('../middleware/auth')


//post   >>  sign up
router.post('/signup', async(req, res) => {
    try {
        const reporter = new Reporter(req.body)
        const token = await reporter.generateToken()
        res.status(200).send({ reporter, token })
    } catch (e) {
        res.status(400).send(e.message)
    }
})




router.delete('/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((el) => {
            return el !== req.token
        })
        await req.user.save()
        res.status(200).send('Logout Successfully')
    } catch (e) {
        res.status(500).send(error.message)
    }
})
router.get('/profile', auth, (req, res) => {
    res.send(req.user)
})

router.delete('/logoutall', auth, async(req, res) => {
    try {
        req.user.tokens = []

        await req.user.save()
        res.status(200).send('Logout All Successfully ')
    } catch (e) {
        res.status(500).send(error.message)
    }
})





//get all
// router.get('/reporter', auth, async(req, res) => {
//     try {
//         const all = await Reporter.find({})
//         res.status(200).send(all)
//     } catch (e) {
//         res.status(400).send(e.message)
//     }
// })


// get one 
router.get('/reporter', auth, async(req, res) => {
    try {
        // const _id = req.params.id
        // const one = await Reporter.findById(_id)
        // if (!one) {
        //     return res.status(400).send('Unable To Find Reporter')
        // }
        res.status(200).send(req.user)
        console.log("sss");
    } catch (e) {
        res.status(400).send(e.message)
    }
})




// patch 
router.patch('/reporter/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'password']

    let isValid = updates.every((el) => allowedUpdates.includes(el))
    if (!isValid) {
        return res.status(400).send("Can't Update")
    }
    try {
        const _id = req.params.id
        const one = await Reporter.findById(_id)
        if (!one) {
            return res.status(400).send('Unable To Find Reporter')
        }
        updates.forEach((el) => (one[el] = req.body[el]))
        await one.save()
        res.status(200).send(one)
    } catch (e) {
        res.status(400).send(e.message)
    }
})


//delete
router.delete('/reporter/:id', async(req, res) => {
    try {
        const _id = req.params.id
        const reporter = await Reporter.findByIdAndDelete(_id)
        console.log(reporter);
        if (!reporter) {
            return res.status(404).send('No Reporter Is Found')
        }
        res.status(200).send(reporter)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


//login 
router.post('/login', async(req, res) => {
    try {
        const reporter = await Reporter.findByCredentials(req.body.email, req.body.password)
        const token = await reporter.generateToken()
        res.status(200).send({ reporter, token })
    } catch (e) {
        res.status(500).send(e.message)
    }
})



//logout
router.delete('/logout', auth, async(req, res) => {
    try {
        req.reporter.tokens = req.reporter.tokens.filter((el) => {
            return el !== req.token
        })
        await req.reporter.save()
        res.status(200).send('Logout Successfully')
    } catch (e) {
        res.status(500).send(error.message)
    }
})



// router.post('/reporter/image', auth, uploads.single('avatar'), async(req, res) => {
//     // try {
//     //     req.user.avatar = req.file.buffer
//     //     await req.user.save()
//     //     res.status(200).send('Ok')
//     // } catch (e) {
//     //     res.status(400).send(error.message)
//     // }
// })


const uploads = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) {
            cb(new Error('Please Upload Image'))
        }
        cb(null, true)
    }
})


router.post('/profile/avatar', auth, uploads.single('avatar'), async(req, res) => {
    try {
        req.user.avatar = req.file.buffer
        await req.user.save()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send(error.message)
    }
})


module.exports = router