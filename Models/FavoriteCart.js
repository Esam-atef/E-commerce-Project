const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteCartSchema = new Schema
({
    user: { type: Schema.Types.ObjectId, ref: 'Consumer', required: true }, 
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }] 
})

module.exports = mongoose.model('FavoriteCart', favoriteCartSchema)
