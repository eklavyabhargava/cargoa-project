require('dotenv').config();

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


const User = mongoose.model("User");
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = ((req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(400).json({error: "Please login again"});
    }

    const token = authorization.replace("Bearer ", "");

    // verify token
    jwt.verify(token, JWT_SECRET, (error, payload) => {
        if (error) {
            return res.status(500).json({error: "Internal Error Occurred!"});
        }
        User.findById(payload.id).then((userFound) => {
            if (!userFound) {
                return res.status(400).json({error: "Invalid Credentials"});
            }

            req.user = userFound;
            next();
        });
    });
});