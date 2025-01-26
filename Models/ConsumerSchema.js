const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'User' },
    PhoneNumber: { type: String, unique: true, required: true },
});
module.exports = mongoose.model('Consumer', userSchema)