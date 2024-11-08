const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const { jwtAuthMiddleware } = require('../jwt');

// Get all recipes with pagination
// router.get('/data',jwtAuthMiddleware, async (req, res) => {
//     const limit = parseInt(req.query._limit) || 4;  // Default to 4 if no limit is provided
//     const page = parseInt(req.query._page) || 1;    // Default to page 1 if no page is provided
//     const skip = (page - 1) * limit;  // Calculate skip for pagination

//     try {
//         // Fetch recipes from the database with pagination
//         const recipes = await Recipe.find()
//             .skip(skip)   // Skip the records based on page number
//             .limit(limit); // Apply the limit to restrict the number of records
        
//         // Send the response as JSON
//         res.json(recipes);
//     } catch (error) {
//         console.error('Error fetching recipes:', error);
//         res.status(500).json({ message: 'Error fetching recipes' });
//     }
// });

router.get('/recipe_category_by_date/', jwtAuthMiddleware, async (req, res) => {
    try {
        const recipes = await Recipe.find(); 
        res.json(recipes); // Return the recipes as JSON
    } catch (error) {
        console.log('Error fetching recipes:', error);
        res.status(500).json({ message: 'Error fetching recipes' });
    }
});

module.exports = router;