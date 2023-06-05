const mongoose = require('mongoose');
const { ObjectID } = mongoose.Schema.Types;

const messageSchema = new mongoose.Schema({
    to: {
        type: String,
        required: true
    },

    from: {
        type: String,
        required: true
    },

    orderId: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    transporter: {
        type: String,
        required: true,
        ref: "User"
    },

    price: {
        type: Number
    },

    manufacturer: {
        type: ObjectID,
        required: true,
        ref: "User"
    },

    replied: {
        type: Boolean,
        default: false
    }
});

mongoose.model("Message", messageSchema);