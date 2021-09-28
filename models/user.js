const { Schema, model } = require("mongoose")
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: { type: String, },
    resetTokenExp: { type: Date, },
    cart: {
        items: [{
            count: {
                type: Number,
                required: true,
                default: 1
            },
            drugId: {
                type: Schema.Types.ObjectId,
                ref: "Drug",
                required: true
            }
        }]
    },

})

userSchema.methods.addToCart = function(drug) {
    const items = [...this.cart.items]
    const idx = items.findIndex(c => {
        return c.drugId.toString() === drug._id.toString()
    })
    if (idx >= 0) {
        items[idx].count = items[idx].count + 1
    } else {
        items.push({
            drugId: drug._id,
            count: 1
        })
    }
    this.cart = { items }
    return this.save()
}
userSchema.methods.removeFromCart = function(id) {
    let items = [...this.cart.items]
    const idx = items.findIndex(c => c.drugId.toString() === id.toString())
    if (items[idx].count === 1) {
        items = items.filter(c => c.drugId.toString() !== id.toString())
    } else {
        items[idx].count--
    }
    this.cart = { items }
    return this.save()
}
userSchema.methods.clearCart = function() {
    this.cart = { items: [] }
    return this.save()
}
module.exports = model("User", userSchema)