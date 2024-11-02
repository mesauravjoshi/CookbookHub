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
const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    _id: String,
});

const bookmarkSchema = new mongoose.Schema({
    Post_id: { type: String,  unique: true , required: true },
    Image_URL: { type: String, required: true },
    Recipes: { type: String, required: true },
    Ingredients: { type: String, required: true },
    Instructions: { type: String, required: true },
    PostedBy: { type: userSchema, required: true }
});
// model for Bookmark
const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

// ***************************************************************************************
// for test  
// Schema for Bookmark
const bmScheama = new mongoose.Schema({
    id: Number,
    name: String,
});
// model for Bookmark
const Bm = mongoose.model('Bm', bmScheama);

// *************************************************************************************
const app = express();

app.use(cors());
app.use(bodyParser.json());

// ***********************************************************************

const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipe');

app.use('/auth', authRoutes);
app.use('/recipes', recipeRoutes);

// ***********************************************************************

app.post('/bookmark_add', async (req, res) => {
    const {Post_id, Image_URL, Recipes, Ingredients, Instructions, PostedBy} = req.body;
    // Check if 
    if (!Post_id || !Image_URL || !Recipes || !Ingredients || !Instructions || !PostedBy) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    let bookmark = new Bookmark();
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

app.post('/bookmark_remove', async (req, res) => {
    const {Post_id, Image_URL, Recipes, Ingredients, Instructions, PostedBy} = req.body;

    console.log(PostedBy);
    if (!Post_id || !Image_URL || !Recipes || !Ingredients || !Instructions || !PostedBy) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const result = await Bookmark.deleteOne({ Post_id, Image_URL, Recipes, Ingredients, Instructions, PostedBy }); // Use the correct field name
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

app.get('/bookmarks', async (req, res) => {
    try {
        // Assuming you have a way to get the user's bookmarks based on their ID
        const bookmarks = await Bookmark.find(); // Adjust based on your user structure
        console.log('line 104: ',bookmarks);
        res.json(bookmarks);
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        res.status(500).json({ message: 'Error fetching bookmarks' });
    }
});

// ****************************************************************************************
// for test 
app.post('/bm_add', async (req, res) => {
    const { id, name } = req.body;
    
    if (!id || !name) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    let bm = new Bm();
    bm.id = id;
    bm.name = name;

    const doc = await bm.save();
    console.log('line 46 New post bookmarked:', doc);  
    res.json({ doc });
});

// New route to remove bookmarks
app.post('/bm_remove', async (req, res) => {
    const { id, name } = req.body;
    console.log(`id ${id} and name ${name}`);
    if (!id || !name) {
        return res.status(400).json({ message: 'id and name are required' });
    }
    try {
        const result = await Bm.deleteOne({ id, name });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }
        console.log('Bookmark removed for id:', id);
        res.json({ message: 'Bookmark removed successfully' });
    } catch (error) {
        console.error('Error removing bookmark:', error);
        res.status(500).json({ message: 'Error removing bookmark' });
    }
});

// New route to get bookmarks
app.get('/bm_get', async (req, res) => {
    try {
        const bookmarks = await Bm.find({}); // Modify this query to filter by user if necessary
        res.json(bookmarks);
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        res.status(500).json({ message: 'Error fetching bookmarks' });
    }
});


// ****************************************************************************************

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});