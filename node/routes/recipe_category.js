const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const { jwtAuthMiddleware } = require('../jwt');

router.get('/recipe_category_by_date/', async (req, res) => {
    try {
        const recipes = await Recipe.find()
        .sort({ Created_At: -1 })
        .limit(2); 
        res.json(recipes); // Return the recipes as JSON
    } catch (error) {
        console.log('Error fetching recipes:', error);
        res.status(500).json({ message: 'Error fetching recipes' });
    }
});

module.exports = router;