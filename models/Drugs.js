const {Schema, model}= require("mongoose")
const drugSchema = new Schema({
    sort: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
      },
    price: {
        type: Number,
        required: true
    },
    img1: String,
    userId:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    img2: String,
    userId:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    img3: String,
    userId:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

drugSchema.method("toClient", function(){
    const drug = this.toObject()
    drug.id = drug._id
    delete drug._id
    return drug
})

module.exports = model("Drug", drugSchema)