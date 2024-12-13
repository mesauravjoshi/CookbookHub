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

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating name:', error);
        res.status(500).json({ message: 'Error updating name' });
    }
});



module.exports = router;