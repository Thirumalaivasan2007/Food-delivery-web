const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    prepTime: {
        type: String,
        default: '25-30 Mins'
    },
    tag: {
        type: String,
        default: 'Fresh Items'
    }
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);
