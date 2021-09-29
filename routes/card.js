const {
    Router
} = require('express')
const router = Router()
const Drugs = require('../models/Drugs')
const auth = require("../middleware/auth")
function mapCartItems(cart){
    return cart.items.map(c=>({
        ...c.drugId._doc,
        id: c.drugId.id,
        count: c.count

    }))
}
function computePrice(drugs){
    return drugs.reduce((model ,drug)=>{
        return model += drug.price * drug.count
    },0)
}



router.get('/', auth, async (req, res) => {
    const user = await req.user
        .populate("cart.items.drugId")
        .execPopulate()

    console.log(user.cart.items);
    const drugs = await mapCartItems(user.cart)

    res.render('card', { 
        title: 'Корзина',
        isCard: true,
        drugs: drugs,
        price: computePrice(drugs)
    })
})

router.delete('/remove/:id', auth, async (req, res) => {
    await req.user.removeFromCart(req.params.id)
    const user= await req.user.populate("cart.items.drugId").execPopulate()

    const drugs=mapCartItems(user.cart)
    const cart ={
        drugs, price: computePrice(drugs)

    }

    res.status(200).json(cart)

})

router.post('/add', auth, async (req, res) => {
    const drug = await Drugs.findById(req.body.id)
    await req.user.addToCart(drug)
    res.redirect('/card')
})


module.exports = router