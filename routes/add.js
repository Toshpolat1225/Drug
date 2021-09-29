const {
    Router
} = require('express')
const router = Router()
const auth = require("../middleware/auth")
const Drug = require('../models/Drugs')

router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Добавить лекарство',
        isAdd: true
    })
})

router.post('/', auth, async (req, res) => {
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
    try{
        await drug.save()
        res.redirect('/drugs')
    }catch(e){
        console.log(e, "add js 24")
    }
})


module.exports = router