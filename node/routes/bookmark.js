const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmarks'); // Use lowercase 'user'
const { generateToken, jwtAuthMiddleware } = require('../jwt');

router.post('/bookmark_add', async (req, res) => {
    const { Category, Cuisine , Post_id, Image_URL, Recipes, Ingredients, Instructions, PostedBy} = req.body;
    // Check if 
    if (!Category || !Cuisine || !Post_id || !Image_URL || !Recipes || !Ingredients || !Instructions || !PostedBy) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    let bookmark = new Bookmark();
    bookmark.Category = Category;
    bookmark.Cuisine= Cuisine;
    bookmark.Post_id = Post_id;
    bookmark.Image_URL = Image_URL;
    bookmark.Recipes = Recipes;
    bookmark.Ingredients = Ingredients;
    bookmark.Instructions = Instructions;
    bookmark.PostedBy = PostedBy;

    const doc = await bookmark.save();
    console.log('New post bookmarked:', doc);  
    res.json({ doc });
});

router.post('/bookmark_remove', async (req, res) => {
    const { Category, Cuisine ,Post_id, Image_URL, Recipes, Ingredients, Instructions, PostedBy} = req.body;

    console.log(PostedBy);
    if (!Category || !Cuisine || !Post_id || !Image_URL || !Recipes || !Ingredients || !Instructions || !PostedBy) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const result = await Bookmark.deleteOne({Category, Cuisine , Post_id, Image_URL, Recipes, Ingredients, Instructions, PostedBy }); // Use the correct field name
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }
        console.log('Bookmark removed for Post_id:', Post_id);
        res.json({ message: 'Bookmark removed successfully' });
    } catch (error) {
        console.error('Error removing bookmark:', error);
        res.status(500).json({ message: 'Error removing bookmark' });
    }
});

router.get('/bookmarks',jwtAuthMiddleware, async (req, res) => {
    try {
        // Assuming you have a way to get the user's bookmarks based on their ID
        const bookmarks = await Bookmark.find(); // Adjust based on your user structure
        res.json(bookmarks);
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        res.status(500).json({ message: 'Error fetching bookmarks' });
    }
});

module.exports = router;