const express = require('express');
const router = express.Router();
const User = require('../../models/User'); // Use lowercase 'user'
const Recipe = require('../../models/Recipe'); // Use lowercase 'user'
// const { generateToken, jwtAuthMiddleware } = require('../jwt');

// Check if username exists
router.get('/users', async (req, res) => {
    try {
        // Use select() to exclude password field
        const totalUsers = await User.find().select('-password'); // Exclude the password field
        
        if (totalUsers) {
            return res.json({ users: totalUsers });
        }
        return res.json({ users: false });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

router.get('/recipes', async (req, res) => {
    try {
        // Use select() to exclude password field
        const totalRecipes = await Recipe.find(); // Exclude the password field
        
        if (totalRecipes) {
            return res.json({ recipes: totalRecipes });
        }
        return res.json({ recipes: false });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;