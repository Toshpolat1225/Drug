const { Router } = require('express')
const router = Router()
const User = require("../models/user")
const auth = require('../middleware/auth')
const fileMiddleware = require('../middleware/file')

router.get('/', auth, async(req, res) => {
    const user = await User.findById(req.user._id)
    const image = user.avatarUrl
    const name2 = req.session.user.name
    res.render('profile', {
        title: 'Профиль',
        isProfile: true,
        user: req.user.toObject(),
        image,
        name2
    })
})

router.post('/', auth, fileMiddleware.single("avatar"), async(req, res) => {
    try {
        const user = await User.findById(req.user._id)
        const toChange = {}
        if (req.file) {
            toChange.avatarUrl = req.file.path
        }
        Object.assign(user, toChange)
        await user.save()
        res.redirect("/profile")
    } catch (error) {
        console.log(error);
    }
})

module.exports = router