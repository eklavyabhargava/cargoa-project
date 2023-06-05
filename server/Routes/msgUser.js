require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const verifyUser = require('../Middleware/verifyUser');

const Msg = mongoose.model("Message");
const router = express.Router();

// API: create message
router.post('/message', verifyUser, async (req, res) => {
    const { to, from, quantity, address, transporter } = req.body;
    const manufacturerId = req.user._id;

    console.log(to, from, quantity, address, transporter);

    // generate a unique order ID
    const orderId = generateOrderID();

    // validate input
    if (!to || !from || !quantity || !address || !transporter) {
        return res.status(400).json({ error: "Please provide all details" });
    }

    try {
        // create a new message
        const newMsg = new Msg({ orderId, to, from, quantity, address, transporter, manufacturer: manufacturerId });
        await newMsg.save();

        return res.status(201).json({ success: "Message created!" });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ error: "Internal error occurred!" });
    }
});

// Function to generate a random order ID
function generateOrderID() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    let orderId = '';

    // Add random letters
    for (let i = 0; i < 2; i++) {
        orderId += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Add random digits
    for (let i = 0; i < 3; i++) {
        orderId += digits.charAt(Math.floor(Math.random() * digits.length));
    }

    return orderId;
}


// API: Reply to message
router.post('/message/:id/reply', verifyUser, async (req, res) => {
    const { price } = req.body;
    const { id } = req.params;

    // validate input
    if (!price) {
        return res.status(400).json({ error: "Invalid Input" });
    }

    try {
        const msg = await Msg.findById(id);

        if (!msg) {
            return res.status(404).json({ error: "Message not found" });
        }

        msg.price = price;
        msg.replied = true;
        await msg.save();

        return res.status(200).json({ success: "Reply sent!" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Internal error occurred" });
    }
});

// API: Get all messages
router.get('/allMsg/:username', verifyUser, async (req, res) => {
    const { username } = req.params;
    const userId = req.user._id;

    try {
        const messages = await Msg.find({
            $or: [
                { manufacturer: userId },
                { transporter: username }
            ]
        });

        if (messages.length > 0) {
            res.status(200).json(messages);
        } else {
            res.status(404).json({ error: "There are no messages for you" });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Internal Error Occurred" });
    }
});


module.exports = router;