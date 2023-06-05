require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyUser = require('../Middleware/verifyUser');
const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();
const User = mongoose.model('User');

// API: User Registration
router.post('/auth/register', async (req, res) => {
    const { name, username, email, password, userType, address } = req.body;

    // validate input
    if (!name || !username || !email || !password || !userType || !address) {
        return res.status(400).json({ error: "All Fields are mandatory!" });
    }

    try {
        // check for uniqueness of email and username
        const emailFound = await User.findOne({ email });
        if (emailFound) {
            return res.status(400).json({ error: "Email already exist" });
        }

        const userFound = await User.findOne({ username });
        if (userFound) {
            return res.status(400).json({ error: "Username already exist" });
        }

        // create new user
        const hashedPassword = await bcryptjs.hash(password, 16);
        const newUser = new User({ name, email, username, password: hashedPassword, userType, address });
        await newUser.save();

        res.status(201).json({ success: "User created successfully!" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ Error: "Internal error occurred!" });
    }
});

// API: User Login
router.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;

    // validate input
    if (!username || !password) {
        return res.status(400).json({ error: "Mandatory field(s) missing" });
    }

    try {
        // find user by username
        const user = await User.findOne({ username });

        if (user) {
            // compare user password with given password
            const didMatch = await bcryptjs.compare(password, user.password);

            if (didMatch) {
                const jwtToken = jwt.sign({ id: user._id }, JWT_SECRET);
                return res.status(200).json({ username: user.username, address: user.address, token: jwtToken, userType: user.userType });
            } else {
                return res.status(400).json({ error: "Invalid Credentials!" });
            }
        } else {
            return res.status(400).json({ error: "Invalid Credentials!" });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Something went wrong" });
    }
});

// API: get all transporter username
router.get('/transporters', verifyUser, async (req, res) => {
    try {
        const transporters = await User.find({ userType: 'Transporter' }, 'username');
        const usernames = transporters.map(transporter => transporter.username);
        res.status(200).json(usernames);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Internal Error Occurred" });
    }
});


module.exports = router;