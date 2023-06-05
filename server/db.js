const mongoose = require('mongoose');

require('dotenv').config();

const connectDb = async => {
    const MONGODB_URL = process.env.MONGODB_URL;

    try {
        // connect to mongodb
        mongoose.connect(MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to Database!');
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

module.exports = connectDb;