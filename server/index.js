require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDb = require('./db');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET;

// get logs
const logger = morgan(':remote-addr :user-agent :referrer :method :url :status :res[content-length] - :response-time ms');

connectDb();

require('./Models/UserModel');
require('./Models/MessageModel');

app.use(cors());
app.use(express.json());
app.use(logger);

app.use(require('./Routes/authUser'));
app.use(require('./Routes/msgUser'));

app.listen(PORT, ()=>{
    console.log(`Server started at PORT ${PORT}`);
})