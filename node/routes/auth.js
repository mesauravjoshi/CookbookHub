const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Use lowercase 'user'
const { generateToken, jwtAuthMiddleware } = require('../jwt');

// Check if username exists
router.get('/usernameExists/:username', async (req, res) => {
    const { username } = req.params;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({ exists: true });
    }
    return res.json({ exists: false });
  });
  

router.post('/signup', async (req, res) => {
    const { name, username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        // console.log('User already exists:', username);
        return res.status(400).json({ message: 'User already exists' });
    }

    let user = new User();
    user.name = name;
    user.username = username;
    user.password = password;

    const doc = await user.save();
    // console.log('New user created:', doc);

    const payload = {
        id: doc.id,
        username: doc.username
    }

    // const token = generateToken(doc.username);
    // console.log(JSON.stringify((payload)));
    const token = generateToken(payload);
    // console.log('Token is : ', token);

    res.json({ doc: doc, token: token });
})

router.post('/login', async (req, res) => {
    // console.log(req.body);
    // res.json(req.body)

    const { username, password } = req.body;
    // Find user by username
    const user = await User.findOne({ username });
    // Check if user exists
    if (!user) {
        return res.status(400).json({ message: 'Incorrect username' });
    }
    // Compare passwords
    const isPasswordMatch = await user.comparePassword(password)
    if (!isPasswordMatch) {
        return res.status(400).json({ message: 'Incorrect password' });
    }

    const payload = {
        id: user.id,
        name: user.name,
        username: user.username
    }
    const token = generateToken(payload)
    // Successful login
    res.json({ message: 'Login successful', user, token });
})

router.post('/changePassword', jwtAuthMiddleware, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    // console.log(oldPassword, newPassword);

    try {
        // Find the user by ID from the token payload
        const user = await User.findById(req.user.id); // req.user is set by verifyToken middleware
        // console.log(user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the old password with the stored password
        const isOldPasswordCorrect = await user.comparePassword(oldPassword);
        // console.log('isOldPasswordCorrect: ', isOldPasswordCorrect);
        if (!isOldPasswordCorrect) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        // Set the new password (this will trigger the pre-save hook)
        user.password = newPassword;

        // Save the user document
        await user.save();
        // Return success message
        res.json({ message: 'Password changed successfully' });

    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'An error occurred while changing the password' });
    }
})

router.post('/checkPasswordCorrect', jwtAuthMiddleware, async (req, res) => {
    const { oldPassword } = req.body;
    // console.log('inside checkPasswordCorrect',oldPassword);

    try {
        // Find the user by ID from the token payload
        const user = await User.findById(req.user.id); // req.user is set by verifyToken middleware

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the old password with the stored password
        const isOldPasswordCorrect = await user.comparePassword(oldPassword);
        // console.log('isOldPasswordCorrect: ', isOldPasswordCorrect);
        if (!isOldPasswordCorrect) {
            // return res.status(400).json({ message: 'Old password is incorrect' });
            return res.status(400).json({ message: false });
        }

        // res.json({ message: 'Old Password is correct ' });
        res.json({ message: true });

    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'An error occurred while changing the password' });
    }
})

module.exports = router;