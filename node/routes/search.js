const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const { jwtAuthMiddleware } = require('../jwt');

// search
router.get('/search', async (req, res) => {
    const { query } = req.query;
    console.log(query);

    try {
        // const query = req.query.q; // Get search term from query string
        if (!query) {
            return res.status(400).send("Search term is required");
        }

        const searchPattern = new RegExp(query, 'i'); // 'i' flag for case-insensitive search

        // Construct the search query
        const recipes = await Recipe.find({
            $or: [
                { Category: searchPattern },
                { Cuisine: searchPattern },
                { Recipes: searchPattern },
                { Tags: { $in: [searchPattern] } }
            ]
        });

        if (recipes.length === 0) {
            return res.status(404).send("No recipes found");
        }

        res.json(recipes); // Return the matching recipes
    } catch (err) {
        console.error(err);
        res.status(500).send("Error while searching");
    }
});


module.exports = router;