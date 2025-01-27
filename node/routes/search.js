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

// search suggestion
router.post('/searchSuggestion', async (req, res) => {
  const { search } = req.body;

  // Check if search array exists and has elements
  if (!search || search.length === 0) {
    return res.status(400).json({ message: "Search term is missing!" });
  }

  // console.log('Received search:', search); // Log to ensure correct input

  try {
    const existingSearch = await SearchSuggestion.findOne({});

    if (existingSearch) {
      // Flatten the incoming search array and merge it with the existing search array
      existingSearch.search = [
        ...existingSearch.search,
        ...search.flat()  // Flatten any nested arrays
      ];

      // Remove duplicates if necessary
      existingSearch.search = [...new Set(existingSearch.search)];

      // Sort the array alphabetically
      existingSearch.search.sort((a, b) => a.localeCompare(b));

      await existingSearch.save();
      // console.log('Search term added');
    } else {
      // If no existing search, create a new one and flatten the search array
      const newSearch = new SearchSuggestion({
        search: search.flat(),  // Ensure the search array is flattened
      });
      await newSearch.save();
      console.log('New search term added');
    }

    res.status(201).json({ message: 'Search added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error while adding search term");
  }
});

// Endpoint to get suggestions based on search query
router.get('/searchSuggestions', async (req, res) => {
  const { query } = req.query; // Get the search query from the query string
  
  if (!query || query.length === 0) {
    return res.status(400).json({ message: 'No search query provided' });
  }

  try {
    // Find the existing search suggestions
    const searchSuggestions = await SearchSuggestion.findOne({});
    if (searchSuggestions) {
      // Filter suggestions based on the query (case-insensitive)
      const filteredSuggestions = searchSuggestions.search.filter((item) =>
        item.toLowerCase().startsWith(query.toLowerCase())
      );

      // Limit results to 10 suggestions
      res.status(200).json(filteredSuggestions.slice(0, 10));
    } else {
      res.status(404).json({ message: 'No search suggestions found in database' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching suggestions' });
  }
});  


module.exports = router;