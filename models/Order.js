const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerDetails: {
        type: Object,
        required: true
    },
    customerEmail: {
        type: String,
        required: true
    },
    cartItems: [{
        name: String,
        price: Number,
        quantity: { type: Number, default: 1 }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    orderStatus: {
        type: String,
        default: 'Preparing'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
