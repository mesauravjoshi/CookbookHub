const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db'); // Import connectDB
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe'); 

require('dotenv').config();

const {jwtAuthMiddleware,generateToken} = require('./jwt')

connectDB().catch(err => console.log(err)); // Call connectDB function

// Schema for Bookmark
const bookmarkSchema = new mongoose.Schema({
    post_id: String,
    saved_by: String
});
// model for Bookmark
const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ***********************************************************************

const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipe');

app.use('/auth', authRoutes);
app.use('/recipes', recipeRoutes);

// ***********************************************************************

app.post('/bookmark', async (req, res) => {
    const { post_id, saved_by } = req.body;

    // Check if post_id already exists
    const existingPostId = await Bookmark.findOne({ post_id, saved_by });
    if (existingPostId) {
        // Delete the existing bookmark with the same post_id and saved_by
        await Bookmark.deleteOne({ post_id, saved_by });
        console.log('Bookmark deleted for post_id:', post_id);
        return res.status(400).json({ message: 'Post_id already exists and was deleted' });
    }

    let bookmark = new Bookmark();
    bookmark.post_id = post_id;
    bookmark.saved_by = saved_by;

    const doc = await bookmark.save();
    console.log('New post bookmarked:', doc);  
    res.json({ doc });
});

app.get('/bookmarked', async (req, res) => {
    try {
        const bookmarked = await Bookmark.find(); // Fetch recipes for the specific user
        res.json(bookmarked); // Return the recipes as JSON
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Error fetching recipes' });
    }
});

app.get('/bookmarked_recipies', async (req, res) => {
    try {
        const bookmarked = await Recipe.find(); // Fetch recipes for the specific user
        res.json(bookmarked); // Return the recipes as JSON
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Error fetching recipes' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});