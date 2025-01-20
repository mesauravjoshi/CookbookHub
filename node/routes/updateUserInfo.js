const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Use lowercase 'user'
const { generateToken, jwtAuthMiddleware } = require('../jwt');

router.put('/name', jwtAuthMiddleware, async (req, res) => {
    const { name } = req.body; // Access the name from the request body
    const userId = req.user.id;

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const updatedName = updatedUser.name;
        // console.log(updatedName);
        const payload = {
            id: updatedUser.id,
            name: updatedUser.name,
            username: updatedUser.username
        }
        const token = generateToken(payload)
        console.log(`${updatedUser.username}'s Account name updated to ${updatedUser.name}`);
        res.json({ message: 'Name change successful', updatedName, token });

        // res.json(updatedUser);
    } catch (error) {
        console.error('Error updating name:', error);
        res.status(500).json({ message: 'Error updating name' });
    }
});

router.put('/username', jwtAuthMiddleware, async (req, res) => {
    const { username } = req.body; // Access the name from the request body
    const userId = req.user.id;
    console.log(username);
    console.log(userId);

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        console.log('User already exists:', username);
        return res.status(400).json({ message: 'User already exists' });
    } else {

        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { username },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            const updatedUsername = updatedUser.username;
            // console.log(updatedUsername);
            const payload = {
                id: updatedUser.id,
                name: updatedUser.name,
                username: updatedUser.username
            }
            console.log(payload);
            const token = generateToken(payload)
            console.log(`${updatedUser.username}'s Account username updated to ${updatedUser.name}`);
            res.json({ message: 'Username change successful', updatedUsername, token });

            // res.json(updatedUser);
        } catch (error) {
            console.error('Error updating name:', error);
            res.status(500).json({ message: 'Error updating name' });
        }
    }

});

module.exports = router;