const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe'); 
const { jwtAuthMiddleware } = require('../jwt');

// get all recipes into home page 
router.get('/data',jwtAuthMiddleware, async (req, res) => {
    try {
        const recipes = await Recipe.find(); // Fetch all recipes
        res.json(recipes); // Return the recipes as JSON
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Error fetching recipes' });
    }
});

// Upload recipies 
router.post('/recipie_data', jwtAuthMiddleware,async (req, res) => {
    const { Image_URL, Recipes, Ingredients, Instructions, PostedBy } = req.body; // Ensure you destructure UploadedBy
    if (!Image_URL || !Recipes || !Ingredients || !Instructions || !PostedBy) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    // Create a new recipe document
    const recipe = new Recipe({ Image_URL, Recipes, Ingredients, Instructions, PostedBy: PostedBy }); // Save UploadedBy as PostedBy
    try {
        const savedRecipe = await recipe.save();
        console.log('New recipe created:', savedRecipe);
        res.status(201).json(savedRecipe); // Respond with the created recipe
    } catch (error) {
        console.error('Error saving recipe:', error);
        res.status(500).json({ message: 'Error saving recipe' });
    }
});

router.get('/user_data/:username', jwtAuthMiddleware, async (req, res) => {
    const { username } = req.params; // Extract username from URL

    try {
        const recipes = await Recipe.find({ 'PostedBy.username': username }); // Fetch recipes for the specific user
        res.json(recipes); // Return the recipes as JSON
    } catch (error) {
        console.log('Error fetching recipes:', error);
        res.status(500).json({ message: 'Error fetching recipes' });
    }
});

module.exports = router;