const mongoose = require('mongoose');

const mongoURL = 'mongodb+srv://<username>:<password>@cluster0.jv3io.mongodb.net/';
// const mongoURL = 'mongodb://127.0.0.1:27017/CookbookHub';

async function connectDB() {
    try {
        await mongoose.connect(mongoURL, {
        });
        console.log('DB connected');
    } catch (err) {
        console.error('DB connection error:', err);
        throw err; // Rethrow the error for handling in index.js
    }
}

module.exports = connectDB;
