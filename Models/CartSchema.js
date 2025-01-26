const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    consumer: { type: Schema.Types.ObjectId, ref: 'Consumer', required: true },  
    items: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },  
            quantity: { type: Number, required: true, default: 1 },
        },
    ],
    totalPrice: { type: Number, default: 0 }
});

module.exports = mongoose.model('Cart', cartSchema);
