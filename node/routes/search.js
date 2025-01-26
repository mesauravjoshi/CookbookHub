const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const SearchSuggestion = require('../models/SearchSuggestion');

// search
router.get('/search', async (req, res) => {
    const { query } = req.query;

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
                { Instructions: searchPattern },
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

router.post('/searchSuggestion', async (req, res) => {
    const { search } = req.body;
    // console.log(search);
    
    try {
      const existingSearch = await SearchSuggestion.findOne({});
  
      if (existingSearch) {
        // Add the new search term to the existing array if it exists
        existingSearch.search.push(search[0]);
        await existingSearch.save();
        console.log('inside if');
      } 
  
      res.status(201).json({ message: 'Search added successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error while adding search term");
    }

  });
  

module.exports = router;