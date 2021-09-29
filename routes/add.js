const {
    Router
} = require('express')
const { validationResult } = require('express-validator/check')
const router = Router()
const auth = require("../middleware/auth")
const Drug = require('../models/Drugs')
const { courseValidators } = require('../utils/validators')

router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Добавить лекарство',
        isAdd: true
    })
})

router.post('/', auth, courseValidators, async(req, res) => {
    const errors = validationResult(req)


    if (!errors.isEmpty()) {
        return res.status(422).render('add', {
            title: 'Добавить лекарство',
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
                sort: req.body.sort,
                model: req.body.model,
                amount: req.body.amount,
                country: req.body.country,
                price: req.body.price,
                img1: req.body.img1,
                img2: req.body.img2,
                img3: req.body.img3,
            }
        })
    }

    const drug = new Drug({
        sort: req.body.sort,
        model: req.body.model,
        amount: req.body.amount,
        country: req.body.country,
        price: req.body.price,
        img1: req.body.img1,
        img2: req.body.img2,
        img3: req.body.img3,
        userId: req.user
    })
    try {
        await drug.save()
        res.redirect('/drugs')
    } catch (e) {
        console.log(e, "add js 24")
    }
})


module.exports = router