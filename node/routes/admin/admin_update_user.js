const express = require('express');
const router = express.Router();
const User = require('../../models/User'); 
const Recipe = require('../../models/Recipe'); 
const Bookmark = require('../../models/Bookmarks'); 
const {jwtAuthMiddleware } = require('../../jwt');

router.put('/username/:recipe_id', jwtAuthMiddleware, async (req, res) => {
    const { recipe_id } = req.params;  // Get recipe_id from URL params
    const { recipeName, category, cuisine, ingredients, instructions } = req.body;  // Get other details from request body
    // console.log(recipe_id);  // Now it should log the recipe_id sent from the client

    try {
        // Assuming you have a Recipe model to update
        const updatedRecipe = await Recipe.findByIdAndUpdate(
            recipe_id,
            { 
                Recipes: recipeName,
                Category: category,
                Cuisine: cuisine,
                Ingredients: ingredients,
                Instructions: instructions
            },
            { new: true } // Returns the updated document
        );

        if (!updatedRecipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json({ message: 'Recipe updated successfully', updatedRecipe });
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).json({ message: 'Error updating recipe' });
    }
});

module.exports = router;