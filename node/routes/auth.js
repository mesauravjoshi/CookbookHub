const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Use lowercase 'user'
const { generateToken } = require('../jwt');

router.post('/signup', async (req, res) => {
    const { name,username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        console.log('User already exists:', username);
        return res.status(400).json({ message: 'User already exists' });
    }

    let user = new User();
    user.name = name;
    user.username = username;
    user.password = password;

    const doc = await user.save();
    console.log('New user created:', doc);  

    const payload = {
        id: doc.id,
        username: doc.username
    }

    // const token = generateToken(doc.username);
    console.log(JSON.stringify((payload)));
    const token = generateToken(payload);
    console.log('Token is : ', token);
    
    res.json({doc: doc, token : token});
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
    if (password !== user.password) {
        return res.status(400).json({ message: 'Incorrect password' });
    }

    const payload = {
        id: user.id,
        name: user.name,
        username: user.username
    }
    const token = generateToken(payload)
    // Successful login
    res.json({ message: 'Login successful', user ,token });
})

module.exports = router;