const mongoose = require('mongoose');
const { ObjectID } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    userType: {
        type: String,
        required: true,
        enum: ['Manufacturer', 'Transporter']
    },

    address: {
        type: String,
        required: true
    }
});

mongoose.model("User", userSchema);