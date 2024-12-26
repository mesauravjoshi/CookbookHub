const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schema for users
const adminsSchema = new mongoose.Schema({
    // adminName: String,
    username_admin: { type: String, unique: true }, // Ensure unique username_admin
    password: String
});

// Pre-save hook to hash the password before saving a user document
adminsSchema.pre('save',async function (next) {
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
adminsSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch  = await bcrypt.compare(candidatePassword, this.password)
        return isMatch;
    } catch (error) {
        throw error;
    }
}

// model for users
const Admin = mongoose.model('Admin', adminsSchema);

module.exports = Admin;