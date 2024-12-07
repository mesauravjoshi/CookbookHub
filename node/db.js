const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/CookbookHub', {
        });
        console.log('DB connected');
    } catch (err) {
        console.error('DB connection error:', err);
        throw err; // Rethrow the error for handling in index.js
    }
}

module.exports = connectDB;
