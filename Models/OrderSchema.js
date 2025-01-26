const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    consumer: {type: Schema.Types.ObjectId,ref: "Consumer",required: true},
    products: 
    [
        {
            product: {type: Schema.Types.ObjectId,ref: "Product",required: true},
            quantity: {type: Number,required: true},
            price: {type: Number,required: true},
        }
    ],
    totalPrice: {type: Number,required: true},
    createdAt:  {type: Date,default: Date.now}
});

module.exports = mongoose.model("Order", orderSchema);
