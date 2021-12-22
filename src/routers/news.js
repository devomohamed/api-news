const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const News = require('../models/news')


router.post('/addnews', auth, (req, res) => {
    const task = new News({...req.body, owner: req.user._id })
    task.save().then(() => {
        res.status(200).send(task)
    }).catch((error) => {
        res.status(400).send(error)
    })
})



router.get('/news', auth, async(req, res) => {
    try {
        const news = await News.find({ owner: req.user._id })
        res.send(news)
    } catch (e) {
        res.status(500).send(e.message)
    }
})
router.patch('/news/:id', auth, async(req, res) => {
    // const update = req.body
    // const _id = 

    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'description']

    let isValid = updates.every((el) => allowedUpdates.includes(el))
    if (!isValid) {
        return res.status(400).send("Can't Update")
    }
    try {
        const _id = req.params.id
        const task = await News.findOne({ _id, owner: req.user._id })
        if (!task) {
            res.status(404).send('No Task Is Found')
        }
        console.log("done");
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})
router.delete('/news/:id', auth, async(req, res) => {
    try {
        const _id = req.params.id
        const task = await News.findOneAndDelete({ _id, owner: req.user._id })
        if (!task) {
            return res.status(400).send('Cant Delete, This Is Not Exsist')
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(400).send(error)
    }

})
router.get('/news/:id', auth, async(req, res) => {
    try {
        const _id = req.params.id
        const task = await News.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(400).send('Unable To Find Task')
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e.message)
    }
})



module.exports = router