const express = require('express');
const router = express.Router();
const User = require('../../models/User'); // Use lowercase 'user'
const Recipe = require('../../models/Recipe'); // Use lowercase 'user'
// const { generateToken, jwtAuthMiddleware } = require('../jwt');

// Check if username exists
router.get('/users', async (req, res) => {
    try {
        // Step 1: Get all users excluding passwords
        const totalUsers = await User.find().select('-password');
        
        if (totalUsers && totalUsers.length > 0) {
            // Step 2: Fetch the recipes for each user
            const usersWithRecipes = await Promise.all(totalUsers.map(async (user) => { 
                // Find recipes where the PostedBy._id matches the user's _id
                const userRecipes = await Recipe.find({ 'PostedBy._id': user._id });
                // console.log(userRecipes.length);

                // Add the 'recipes' field to the user object
                return {
                    ...user.toObject(), // Convert mongoose document to plain object
                    recipes: userRecipes.length // Add the recipes array to the user
                };
            }));

            // Step 3: Send back the users along with their recipes
            return res.json({ users: usersWithRecipes });
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