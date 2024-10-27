const mongoose = require('mongoose');

// Schema for users
const usersSchema = new mongoose.Schema({
    name: String,
    username: { type: String, unique: true }, // Ensure unique usernames
    password: String
});
// model for users
const User = mongoose.model('User', usersSchema);

module.exports = User;