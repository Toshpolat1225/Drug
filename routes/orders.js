const { Router } = require("express")
const Order = require("../models/order")
const auth = require("../middleware/auth")
const router = Router()

router.get("/", auth, async (req, res) => {
    try {
        const orders = await Order.find({ "user.userId": req.user._id })
            .populate("user.userId")

        res.render("orders", {
            isOrder: true,
            title: "Заказы",
            orders: orders.map(o => {      
                return {
                    ...o._doc,
                    price: o.drugs.reduce((total, c) => {
                        return total += c.count * c.drug.price
                    }, 0)
                }
            })
        })

    } catch (e) {
        console.log(e, "order js 9")
    }

})

router.post("/", auth, async (req, res) => {

    try {

        const user = await req.user
            .populate("cart.items.drugId")
            .execPopulate()

        const drugs = user.cart.items.map(i => ({                 //--------------------------------------

            count: i.count,
            drug: { ...i.drugId._doc }
        }))

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            drugs: drugs
        })
        await order.save()
        await req.user.clearCart()



        res.redirect("/orders")
    } catch (e) {
        console.log(e)
    }

})
module.exports = router