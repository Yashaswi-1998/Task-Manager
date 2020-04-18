const express = require('express')
const User = require('../models/users.js')
const router = new express.Router()
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const Email = require('../emails/account')



router.post('/user', async (req, res) => {

    try {
        const user = new User(req.body)
        //await user.save() 
        const token = await user.jwtToken()

        Email.welcomeEmail(user.email, user.name)


        res.status(201).send({ user, token })

    }
    catch (e) {
        console.log(e)
        console.log('inside user post')
        var er = e.message
        var val = er.split(',', 1)
        val = val[0].split(':')
        res.status(400).send(val[2])

    }
})

router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()

    }
    catch (e) {
        res.status(500).send('Error')
    }
})

router.post('/user/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []

        await req.user.save()
        res.send()
    }
    catch (e) {
        res.status(500).send('Error')
    }
})


router.get('/user/me', auth, async (req, res) => {
    // console.log(req.user)
    res.send(req.user)
})


const upload = multer(
    {
        // dest:'avatar',
        limits:
        {
            filesize: 1000000
        },
        fileFilter(req, file, cb) {

            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                return cb(new Error('Please upload valid image!'))
            }
            cb(undefined, true)
        }

    })
router.post('/user/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()

}, (error, req, res, next) => {
    res.status(400).send({ Error: error.message })
})



router.delete('/user/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})



router.get('/user/:id/avatar', async (req, res) => {
    try {

        console.log('running')
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error('Image not found')
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    }
    catch (e) {
        res.status(404).send(e.toString())
    }
})
router.patch('/user/me', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']

    const isTrue = updates.every(update => {
        return allowedUpdates.includes(update)
    })

    if (!isTrue) {
        return res.status(400).send('Wrong fields entered')
    }

    try {

        //const user=await User.findById(req.user._id)

        //console.log(user)

        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        await req.user.save()

        // const user= await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
        res.send(req.user)
    }
    catch (e) {
        console.log('error')
        res.status(400).send(e.toString())
    }
})

router.delete('/user/me', auth, async (req, res) => {
    // const _id=req.params.id

    try {
        // const user= await User.findByIdAndDelete(_id)

        await req.user.remove()
        Email.cancelEmail(req.user.email, req.user.name)
        res.send(req.user)
    }
    catch (e) {
        res.status(400).send('Error')
    }
})

router.post('/user/login', async (req, res) => {
    try {

        const user = await User.matchEmail(req.body.email, req.body.password)
        const token = await user.jwtToken()
        res.status(200).send({ user, token })


    }
    catch (e) {
        console.log(e)
        res.status(400).send(e.toString())
    }
})

module.exports = router