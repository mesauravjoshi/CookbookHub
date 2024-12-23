const express = require('express');
const router = express.Router();
const User = require('../../models/User'); 
const Recipe = require('../../models/Recipe'); 
const Bookmark = require('../../models/Bookmarks'); 
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

router.get('/Detailed-User-data/:user_id', async (req, res) => {
    const { user_id } = req.params; 
    console.log(user_id);
    
    try {
        const user_info = await User.find({ '_id': user_id }); // Fetch recipes for the specific user

        const user_recipe = await Recipe.find({ 'PostedBy._id': user_id }); // Fetch recipes for the specific user
        const user_recipe_bookmark = await Bookmark.find({ 'BookmarkBy._id': user_id }); // Fetch recipes for the specific user
        
        res.json({user_info, user_recipe, user_recipe_bookmark}); // Return the recipes as JSON
    } catch (error) {
        console.log('Error fetching recipes:', error);
        res.status(500).json({ message: 'Error fetching recipes' });
    }
});

// DELETE request: Delete the recipe by ID
router.delete('/delete_recipe/:recipe_id', async (req, res) => {
    const { recipe_id } = req.params;  // Get the recipe ID from the request parameters

    try {
        const recipe = await Recipe.findByIdAndDelete(recipe_id);  // Find and delete the recipe by ID

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.status(200).json({ message: 'Recipe successfully deleted' });  // Return success message
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ message: 'Error deleting recipe' });
    }
});

router.get('/detail-recipe/:recipe_id', async (req, res) => {
    const { recipe_id } = req.params; 
    try {
        const recipe = await Recipe.find({ '_id': recipe_id }); // Fetch recipes for the specific user

        const recipe_bookmark = await Bookmark.find({ 'Post_id': recipe_id }); // Fetch recipes for the specific user
        console.log(recipe_bookmark);

        res.json({recipe , recipe_bookmark}); // Return the recipes as JSON
    } catch (error) {
        console.log('Error fetching recipes:', error);
        res.status(500).json({ message: 'Error fetching recipes' });
    }
});

module.exports = router;