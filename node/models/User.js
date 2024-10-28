const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schema for users
const usersSchema = new mongoose.Schema({
    name: String,
    username: { type: String, unique: true }, // Ensure unique usernames
    password: String
});

// Pre-save hook to hash the password before saving a user document
usersSchema.pre('save',async function (next) {
    const person = this;
    if(!person.isModified('password')) return next();
    try {
        // hash password generation 
        const salt = await bcrypt.genSalt(10);
        // hash password 
        const hashedPassword = await bcrypt.hash(person.password, salt);
        // override the plain password with hashed one 
        person.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
})

// Method to compare a candidate password with the hashed password stored in the database
usersSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch  = await bcrypt.compare(candidatePassword, this.password)
        return isMatch;
    } catch (error) {
        throw error;
    }
}

// model for users
const User = mongoose.model('User', usersSchema);

module.exports = User;